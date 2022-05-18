/*
  Measure a string with canvas context using the current font and fontsize
  @param: text: str to be measured 
          font: css str to set the font for measurement
          wordSpacing: (optional) css string or number in em
*/
const measureWidthCtx = function (text, font, wordSpacing) { // scale = 1

  if (typeof font !== 'string') throw Error('font must be string');

  measureCtx.font = font;

  let wordSpacePx;
  if (!wordSpacing) {
    wordSpacePx = 0;
  } else {
    if (typeof wordSpacing === 'number') {
      wordSpacePx = wordSpacing * initialMetrics.fontSize;
    } else if (typeof wordSpacing === 'string') {
      if (/px/.test(wordSpacing)) {
        wordSpacePx = parseFloat(wordSpacing.replace("px", "").trim());
      } else if (/em/.test(wordSpacing)) {
        wordSpacePx = parseFloat(wordSpacing.replace("em", "").trim()) * initialMetrics.fontSize;
      } else {
        wordSpacePx = 0
        console.error("Unable to parse wordSpacing in measureWidthCtx, using 0");
      }
    } else {
      throw Error("Invalid wordSpacing arugment in measureWidthCtx");
    }
  }
  let width = measureCtx.measureText(text).width;
  let numSpaces = text.split(' ').length - 1;

  return width + (numSpaces * wordSpacePx);
}

/*
  Get the current width of a line in scaleRatio = 1
  @param: line: line element or line index
          wordSpacing: (optional) set the wordSpacing for calculation, number in em
*/
const getLineWidth = function (line, wordSpacing = undefined) {
  // return value in scaleRatio = 1 (initial state)
  let lineEle = line instanceof HTMLElement ? line : document.getElementById("l" + line);
  let currentSpacing = lineEle.style.wordSpacing;
  if (wordSpacing) lineEle.style.wordSpacing = wordSpacing + "em"; // set ws
  let contentSpan = lineEle.firstElementChild;
  let width = !contentSpan ? 0 : contentSpan.getBoundingClientRect().width
    / (typeof scaleRatio === 'number' ? scaleRatio : 1);
  if (wordSpacing) lineEle.style.wordSpacing = currentSpacing; // reset ws
  return width;
}

/*
  Get line width after a subsitution, return the minWidth 
  (with min word space) and maxWidth (with max word space)
  @param: newWord: the word to replace
          wordIdx: the index of the word to be replaced
*/
const getLineWidthAfterSubX = function (newWord, wordIdx) {
  // return value in scaleRatio = 1 (initial state), not current scale

  let targetSpan = document.getElementById("w" + wordIdx);
  let lineEle = targetSpan.parentElement;
  let origWord = targetSpan.textContent;

  targetSpan.textContent = newWord; // replace

  let minWidth = getLineWidth(lineEle, minWordSpace);
  let maxWidth = getLineWidth(lineEle, maxWordSpace);

  targetSpan.textContent = origWord; // reset

  return { min: minWidth, max: maxWidth };
}

/*
  Get line width after a subsitution, with the current or a set word space
  @param: newWord: the word to replace
          wordIdx: the index of the word to be replaced
          wordSpacing: (optional, number in em)
*/
const getLineWidthAfterSub = function (newWord, wordIdx, wordSpacing) {
  // return value in scaleRatio = 1 (initial state), not current scale
  let targetSpan = document.getElementById("w" + wordIdx);
  let lineEle = targetSpan.parentElement;
  let origWord = targetSpan.textContent;

  targetSpan.textContent = newWord; // replace
  let lineWidth = getLineWidth(lineEle, wordSpacing);
  targetSpan.textContent = origWord; // reset

  return lineWidth;
}

const getLineWidthAfterSubOld = function (newWord, wordIdx, lineIdx) {
  // return value in scaleRatio = 1 (initial state), not current scale (width on brower window)
  let targetSpan = document.getElementById("w" + wordIdx);
  let origWord = targetSpan.textContent;
  targetSpan.textContent = newWord; // replace
  let targetLine = targetSpan.parentElement;
  if (lineIdx) targetLine = document.getElementById("l" + lineIdx).firstChild;
  let lineWidth = targetLine.getBoundingClientRect().width / scaleRatio;
  targetSpan.textContent = origWord; // reset ???
  return lineWidth;
}

const getInitialContentWidths = function (n, useCtx) {
  let r = [];
  for (let i = 0; i < n; i++) {
    const lineEle = document.getElementById("l" + i);
    if (!useCtx) {
      r.push(lineEle.firstChild ? lineEle.firstChild.getBoundingClientRect().width : 0);
    } else {
      let style = window.getComputedStyle(lineEle);
      let t = lineEle.firstChild ? lineEle.firstChild.textContent : "";
      r.push(measureWidthCtx(t, style.font, style.wordSpacing));
    }
  }
  return r;
}

/*
  Computes the estimated change of width in percentage after a word change
  @return {
      min: array[percentage, width] distance to target width with minimal word spacing,
      max: array[percentage, width] distance to target width with max word spacing
      opt: array[percentage, width, ws(num in px)] distance to target width after ws adjustment
  }
  @param: newWord: str, the word  to change to
          wordId: int, the id of the word to be changed
          field: arr, return field, ['max', 'min', 'opt'] 
          // only get the neccessary ones for the best performance
*/
const estWidthChangePercentage = function (newWord, wordIdx, fields = ['max', 'min']) {

  let result = {};
  let originalWord = document.getElementById("w" + wordIdx).textContent;
  let spanContainer = document.getElementById("w" + wordIdx).parentElement;
  let lineEle = spanContainer.parentElement;
  let lineIdx = parseInt(lineEle.id.slice(1));
  let targetWidth = initialMetrics.lineWidths[lineIdx];
  let newtxt = spanContainer.textContent.replace(originalWord, newWord);
  let style = window.getComputedStyle(lineEle);

  if (fields.includes('max')) {
    let maxWsPx = maxWordSpace * initialMetrics.fontSize;
    let widthMaxWs = measureWidthCtx(newtxt, style.font, maxWsPx + "px");
    result.max = [((widthMaxWs - targetWidth) / targetWidth) * 100, widthMaxWs]
  }

  if (fields.includes('min')) {
    let minWsPx = minWordSpace * initialMetrics.fontSize;
    let widthMinWs = measureWidthCtx(newtxt, style.font, minWsPx + "px");
    result.min = [((widthMinWs - targetWidth) / targetWidth) * 100, widthMinWs]
  }

  if (fields.includes('opt')) {
    let currentWsPx = parseFloat(style.wordSpacing.replace("px", "").trim())
    let numOfSpace = newtxt.split(" ").length - 1; // unused?
    let step = 0.01 * initialMetrics.fontSize;
    let currentWidth = measureWidthCtx(newtxt, style.font, currentWsPx + "px");
    let left = currentWsPx, right = currentWsPx;
    while (currentWidth > targetWidth) {
      left -= step;
      currentWidth = measureWidthCtx(newtxt, style.font, left + "px")
    }
    currentWidth = measureWidthCtx(newtxt, style.font, currentWsPx + "px");
    let lw = currentWidth;
    while (currentWidth < targetWidth) {
      right += step;
      currentWidth = measureWidthCtx(newtxt, style.font, right + "px")
    }
    let finalWidth = Math.abs(lw - targetWidth) >= Math.abs(currentWidth - targetWidth) ? currentWidth : lw;
    let finalWs = Math.abs(lw - targetWidth) >= Math.abs(currentWidth - targetWidth) ? right : left;
    result.opt = [((finalWidth - targetWidth) / finalWidth) * 100, finalWidth, finalWs]
  }

  return result;
}

/*
  Computes the change of width in percentage after a word change using client rectangle
  @return {
      min: array[percentage, width] distance to target width with minimal word spacing,
      max: array[percentage, width] distance to target width with max word spacing
      opt: array[percentage, width, ws(num in px)] distance to target width after ws adjustment
  }
  @param: newWord: str, the word  to change to
          wordId: int, the id of the word to be changed
          field: arr, return field, ['max', 'min', 'opt'] 
          // only get the neccessary ones for the best performance 
          // but this is generally slower than estWidthChangePercentage
*/
const widthChangePercentage = function (newWord, wordIdx, fields = ['max', 'min']) {

  let result = {};
  let wordEle = document.getElementById("w" + wordIdx)
  let originalWord = wordEle.textContent;
  let spanContainer = wordEle.parentElement;
  let lineEle = spanContainer.parentElement;
  let lineIdx = parseInt(lineEle.id.slice(1));
  let targetWidth = initialMetrics.lineWidths[lineIdx];
  let style = window.getComputedStyle(lineEle);

  wordEle.textContent = newWord; // make the substitution

  if (fields.includes('max')) {
    let originWs = style.wordSpacing;
    lineEle.style.wordSpacing = maxWordSpace + "em";
    let widthMaxWs = lineEle.firstChild.getBoundingClientRect().width / scaleRatio;
    lineEle.style.wordSpacing = originWs;
    result.max = [((widthMaxWs - targetWidth) / targetWidth) * 100, widthMaxWs]
  }

  if (fields.includes('min')) {
    let originWs = style.wordSpacing;
    lineEle.style.wordSpacing = minWordSpace + "em";
    let widthMinWs = lineEle.firstChild.getBoundingClientRect().width / scaleRatio;
    lineEle.style.wordSpacing = originWs;
    result.min = [((widthMinWs - targetWidth) / targetWidth) * 100, widthMinWs]
  }

  if (fields.includes('opt')) {
    let originWs = style.wordSpacing;
    adjustWordSpace(lineEle, targetWidth);
    let finalWidth = lineEle.firstChild.getBoundingClientRect().width / scaleRatio;
    let finalWs = parseFloat(window.getComputedStyle(lineEle).wordSpacing.replace("px", ""));
    lineEle.style.wordSpacing = originWs;
    spanContainer.classList.remove("max-word-spacing");
    spanContainer.classList.remove("min-word-spacing");
    result.opt = [((finalWidth - targetWidth) / targetWidth) * 100, finalWidth, finalWs]
  }

  wordEle.textContent = originalWord; // restore the original text

  return result;
}


