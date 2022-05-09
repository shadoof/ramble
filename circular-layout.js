/*
  @params: target, lines, opts
      opts.fontSize: float, fontSize in px
      opts.fontFamily: string, fontFamily string

  @return: an array of original line widths
*/
const createCircularDOM = function (target, initialRadius, lines, fontSize) {

  let lineWidths = [];
  let textDisplay = document.createElement("div");
  textDisplay.id = "text-display";
  textDisplay.style.width = initialRadius * 2 + "px";
  textDisplay.style.height = initialRadius * 2 + "px";

  let wordIdx = 0;
  lines.forEach((l, li) => {
    let lineDiv = document.createElement("div");
    lineDiv.classList.add("line");
    lineDiv.style.fontSize = (l.fontSize || fontSize) + "px";
    lineDiv.style.fontFamily = l.fontFamily || 'sans-serif';
    lineDiv.style.wordSpacing = l.wordSpacing + "em";
    lineDiv.style.top = (l.bounds[1] - l.bounds[3] / 2) + "px";
    lineDiv.id = "l" + li;

    if (l.text && l.text.length > 0) {
      let wrapperSpan = document.createElement("span");
      wrapperSpan.style.display = "inline-block";
      //if (li === 0) wrapperSpan.style.outline = '1px solid red';

      wrapperSpan.classList.add("wrapper");
      let words = RiTa.tokenize(l.text);
      words.forEach((w, iil) => {
        if (iil > 0 && !RiTa.isPunct(w)) wrapperSpan.append(" ");
        let wordSpan = document.createElement("span");
        wordSpan.classList.add("word");
        wordSpan.id = "w" + wordIdx++;
        wordSpan.innerText = w;
        wrapperSpan.append(wordSpan);
      });
      lineDiv.append(wrapperSpan);
    }

    textDisplay.append(lineDiv);
    lineWidths.push(l.bounds[2]);
  });

  target.append(textDisplay);

  return { // main::initMetrics
    fontSize,
    lineWidths,
    textDisplay,
    radius: initialRadius,
  };
}

const adjustWordSpace = function (lineEle, targetWidth) {
  console.log('adjustWordSpace',lineEle.textContent+' -> '+targetWidth);

  // WORKING HERE *******
  
  let step = 0.01, scaleRatio = getScaleRatio();
  let lineIdx = parseInt((lineEle.id).slice(1));
}

const adjustWordSpaceOld = function (lineEle) {
  // calculation in scale=1, not current scale
  let dbug = 0;
  if (dbug) ["max-word-spacing", "min-word-spacing"]
    .forEach(c => lineEle.classList.remove(c));

  let minWordSpace = wordspaceMinMaxDefault[0];
  let maxWordSpace = wordspaceMinMaxDefault[1];
  let wordSpacing = window.getComputedStyle(lineEle).wordSpacing;
  let step = 0.01, scaleRatio = getScaleRatio();
  let lineIdx = parseInt((lineEle.id).slice(1));
  let origW = initialMetrics.lineWidths[lineIdx] - 2 * padding;
  let currentW = lineEle.firstChild.getBoundingClientRect().width / scaleRatio;
  let ws = parseFloat(wordSpacing.replace('px', '')) / initialMetrics.fontSize; // px => em

  // try to get within 5 pixels of current width ?
  for (let tries = 0; Math.abs(origW - currentW) > 0.00555555 * initialMetrics.radius && tries < 200; tries++) {
    ws += (origW > currentW) ? step : -step;
    lineEle.style.wordSpacing = ws + "em";
    currentW = lineEle.firstChild.getBoundingClientRect().width / scaleRatio; // scale=1
  }

  if (0) { // debugging only
    if (ws >= maxWordSpace) line.classList.add("max-word-spacing");
    if (ws >= minWordSpace) line.classList.add("min-word-spacing");
  }

  // set word-spacing on line to clamped value
  lineEle.style.wordSpacing = clamp(ws, minWordSpace, maxWordSpace) + "em";

  return ws;
}

/*
  parameter: words, radius, opts = {}
    opts.offset : object: { x: x, y: y };
    opts.padding: float;
    opts.font: css str
    opts.fontSize: float, for init guess;
    opts.lineHeightScale: float;
    opts.wordSpacing: float, in em
  @return: array of lines
*/
const layoutCircularLines = function (words, radius, opts = {}) {
  let padding = opts.padding || 0;
  let offset = opts.offset || { x: 0, y: 0 };
  let fontFamily = opts.fontFamily || 'sans-serif';
  let lineHeightScale = opts.lineHeightScale || 1.2;
  let wordSpacing = opts.wordSpacing || wordspaceMinMaxDefault[2];
  let fontSize = radius / 4, result;
  do {
    fontSize -= 0.1;
    let leading = fontSize * lineHeightScale;
    let metrics = { fontFamily, fontSize, leading, wordSpacing };
    result = fitToLineWidths(offset, radius - padding, words, metrics);
  }
  while (result.words.length);

  let answer = result.rects.map((r, i) => ({ fontSize, wordSpacing, bounds: r, text: result.text[i] }));
  //console.log('Computed fontSize: '+fontSize, answer);
  return answer;
}

/*
  parameter: offset, radius, words, metrics: {fontName, fontSize, lineHeight, wordSpacing} 
  @return: { text, rects, words }
*/
const fitToLineWidths = function (offset, radius, words, metrics) {
  // calculation in scale=1, not current scale
  //console.log('fitToLineWidths', fontSize);
  let { fontFamily, fontSize, leading, wordSpacing } = metrics;
  let tokens = words.slice();
  let text = [], rects = lineWidths(offset, radius, leading);
  rects.forEach(([x, y, w, h], i) => {
    let data = fitToBox(tokens, w, fontSize, fontFamily, wordSpacing);
    if (!data) { // fail to fit any words
      text.push('');
      return;
    }
    text.push(data.text);
    tokens = data.words;
  });
  return { text, rects, words: tokens };
}

/*
  parameter: words, width, fontSize, fontName
  @return: { words, text }
*/
const fitToBox = function (words, width, fontSize, fontName, wordSpacing) {
  // caculation in scale=1, not current scale
  //console.log('fitToBox', words, width, fontSize);
  let i = 1, line = {
    text: words[0],
    width: measureWidth(words[0], fontSize, fontName, wordSpacing)
  };
  if (line.width > width) return; // can't fit first word

  for (let n = words.length; i < n; ++i) {
    let next = ' ' + words[i];
    let nextWidth = measureWidth(next, fontSize, fontName, wordSpacing);
    if (line.width + nextWidth > width) break; // done
    line.text += next;
    line.width += nextWidth;
  }
  words = words.slice(i);
  if (RiTa.isPunct(words[0])) { // punct can't start a line
    line.text += words.shift();
  }
  return {
    words, text: RiTa.untokenize((line.text || '').split(' ')),
  };
}

const measureWidth = function (text, fontSizePx = 12, fontName = fontFamily, wordSpacing = 0) {
  // caculation in scale=1, not current scale
  canvasCtx = canvasCtx || document.createElement("canvas").getContext("2d");
  canvasCtx.font = fontSizePx + 'px ' + fontName;
  let spaceCount = text ? (text.split(" ").length - 1) : 0;
  return canvasCtx.measureText(text).width + spaceCount * (wordSpacing * fontSizePx);
}
let canvasCtx; // don't recreate canvas

const chordLength = function (rad, d) {
  return 2 * Math.sqrt(rad * rad - (rad - d) * (rad - d));
}

const lineWidths = function (center, rad, lh) {
  let result = [];
  let num = Math.floor((rad * 2) / lh);
  let gap = ((rad * 2) - (lh * num)) / 2;
  for (let i = 0; i < num; i++) {
    let d = gap + lh / 2 + (i * lh); // distance from top to the middle of the textline
    let cl = chordLength(rad, d > rad ? d + lh : d);
    let x = center.x - cl / 2;
    let y = center.y - (rad - d + lh / 2);
    if (cl) {
      //console.log(i, d, d > r, cl);
      result.push([x, y, cl, lh]);
    }
  }
  return result;
}

const currentLineWidth = function (lineIdx) {
  // return value in scaleRatio = 1 (initial state)
  let lineEle = document.getElementById("l" + lineIdx);
  return lineEle.firstChild.getBoundingClientRect().width / getScaleRatio();
}

const getLineWidth = function (lineIdx, wordSpacing) {
  // return value in scaleRatio = 1 (initial state), not current scale (width on brower window)
  let lineEle = document.getElementById("l" + lineIdx);
  let currentSpacing = lineEle.style.wordSpacing;
  //let lineEle = realEle.cloneNode(true);
  if (wordSpacing) lineEle.style.wordSpacing = wordSpacing + "em"; // set ws
  let contentSpan = lineEle.firstChild;
  let width = contentSpan.getBoundingClientRect().width / getScaleRatio();
  if (wordSpacing) lineEle.style.wordSpacing = currentSpacing; // reset ws
  return width;
}

const getLineWidthAfterSub = function (newWord, wordIdx, lineIdx) {
  // return value in scaleRatio = 1 (initial state), not current scale (width on brower window)
  let targetSpan = document.getElementById("w" + wordIdx);
  let origWord = targetSpan.textContent;
  targetSpan.textContent = newWord; // replace
  let targetLine = targetSpan.parentElement;
  if (lineIdx) targetLine = document.getElementById("l" + lineIdx).firstChild;
  let lineWidth = targetLine.getBoundingClientRect().width / getScaleRatio();
  targetSpan.textContent = origWord; // reset ???
  return lineWidth;
}


const getLineWidthAfterSub_old = function (text, lineIndex) {
  // return value in scaleRatio = 1 (initial state), not current scale (width on brower window)
  const line = document.querySelector("#l" + lineIndex);
  const lineCss = window.getComputedStyle(line);
  const textCss = window.getComputedStyle(textDisplay);

  const wordSpacing = parseFloat(lineCss.wordSpacing.replace("px", ""));
  const scaleRatio = getScaleRatio();
  const numSpaces = text ? (text.split(" ").length - 1) : 0;

  lineCtx = lineCtx || document.createElement("canvas").getContext("2d");
  lineCtx.font = lineCss.font;

  const lineWidth = lineCtx.measureText(text).width;
  return (lineWidth + (numSpaces * wordSpacing)) * scaleRatio;
};
let lineCtx; // don't recreate canvas

