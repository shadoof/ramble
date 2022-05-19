/*
  Measure a string with canvas context using the current font and fontsize
  @param: text: str to be measured 
          font: css str to set the font for measurement
          wordSpacing: (optional) css string or number in em
*/
const measureWidthCtx = function (text, font, wordSpacing) { // scale = 1

  if (typeof font !== 'string') throw Error('font must be string');

  measureCtx.font = font;

  let wordSpacePx = wordSpacing || 0;
 
  if (typeof wordSpacing === 'number') {
    wordSpacePx = wordSpacing * initialMetrics.fontSize;
  } 
  else if (typeof wordSpacing === 'string') {
    if (/px/.test(wordSpacing)) {
      wordSpacePx = parseFloat(wordSpacing.replace("px", "").trim());
    } else if (/em/.test(wordSpacing)) {
      wordSpacePx = parseFloat(wordSpacing.replace("em", "").trim()) * initialMetrics.fontSize;
    } else {
      wordSpacePx = 0;
      console.error("Unable to parse wordSpacing, using 0");
    }
  } else {
    throw Error("Invalid wordSpacing arg");
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
      opt: array[percentage, width, wsPx(num in px), wsEm] distance to target width after ws adjustment
  }
  @param: newWord: str, the word  to change to
          wordId: int, the id of the word to be changed
          field: arr, return field, ['max', 'min', 'opt'] 
          // only get the neccessary ones for the best performance
*/
const estWidthChangePercentage = function (newWord, wordIdx, fields = ['max', 'min']) {

  let result = {};
  let wordEle = document.getElementById("w" + wordIdx);
  let originalWord = wordEle.textContent;
  let spanContainer = wordEle.parentElement;
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
    let step = 0.01 * initialMetrics.fontSize;
    let currentWidth = measureWidthCtx(newtxt, style.font, currentWsPx + "px");
    let direction = currentWidth >= targetWidth ? -1 : 1;
    let bound1 = currentWsPx, bound2, w1;
    while((direction > 0 ? currentWidth < targetWidth : currentWidth > targetWidth)){
      bound1 += step * direction;
      currentWidth = measureWidthCtx(newtxt, style.font, bound1 + "px");
    }
    w1 = currentWidth
    bound2 = bound1 - (step * direction);
    currentWidth = measureWidthCtx(newtxt, style.font, bound2 + "px");
    
    let finalWidth = Math.abs(w1 - targetWidth) >= Math.abs(currentWidth - targetWidth) ? currentWidth : w1;
    let finalWs = Math.abs(w1 - targetWidth) >= Math.abs(currentWidth - targetWidth) ? bound2 : bound1;
    result.opt = [((finalWidth - targetWidth) / finalWidth) * 100, finalWidth, finalWs, finalWs / initialMetrics.fontSize]
  }

  return result;
}

/*
  Computes the change of width in percentage after a word change using client rectangle
  @return {
      min: array[percentage, width] distance to target width with minimal word spacing,
      max: array[percentage, width] distance to target width with max word spacing
      opt: array[percentage, width, wsPx(num in px), wsEm(num in em)] distance to target width after ws adjustment
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
    let wordSpaceEm = adjustWordSpace(lineEle, targetWidth);
    let finalWidth = lineEle.firstChild.getBoundingClientRect().width / scaleRatio;
    let finalWs = parseFloat(window.getComputedStyle(lineEle).wordSpacing.replace("px", ""));
    lineEle.style.wordSpacing = originWs;
    spanContainer.classList.remove("max-word-spacing");
    spanContainer.classList.remove("min-word-spacing");
    result.opt = [((finalWidth - targetWidth) / targetWidth) * 100, finalWidth, finalWs, wordSpaceEm]
  }

  wordEle.textContent = originalWord; // restore the original text

  return result;
}

function getWordSpaceEm(lineEle) {
  let wordSpacingPx = window.getComputedStyle(lineEle).wordSpacing.replace('px', '');
  return parseFloat(wordSpacingPx) / initialMetrics.fontSize; // px => em
}


