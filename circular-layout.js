/*
  parameter: words, radius, opts = {}
    opts.offset : object: { x: x, y: y };
    opts.padding: float;
    opts.fontFamily: css str
    opts.fontSize: float, for init guess;
    opts.lineHeightScale: float;
    opts.wordSpacing: float, in em
  @return: array of lines
*/
const layoutCircularLines = function (words, radius, opts = {}) {

  let padding = opts.padding || 0;
  let offset = opts.offset || { x: 0, y: 0 };
  let lineHeightScale = opts.lineHeightScale || 1.2;

  let wordSpace = opts.wordSpace || 0;
  let fontFamily = opts.fontFamily || 'times';
  let fontSize = radius / 4, result;

  do {
    fontSize -= 0.1;
    let leading = fontSize * lineHeightScale;
    let metrics = { fontFamily, fontSize, leading, wordSpacing: wordSpace };
    result = fitToLineWidths(offset, radius - padding, words, metrics);
  }
  while (result.words.length);

  //if (opts.forceFontSize) fontSize = opts.forceFontSize;

  let answer = result.rects.map((r, i) => ({
    fontSize, wordSpacing: wordSpace, bounds: r, text: result.text[i], fontFamily
  }));

  return answer; // [fontSize, wordSpacing, bounds, text, fontFamily]
}

/*
  @params: target, lines, opts
      opts.fontSize: float, fontSize in px
      opts.fontFamily: string, fontFamily string

  @return: an array of original line widths
*/
const createCircularDOM = function (target, initialRadius, lines) {

  let lineWidths = []
  let fontSize = lines[0].fontSize;

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

  let initialMetrics = {
    fontSize,
    lineWidths,
    textDisplay,
    radius: initialRadius
  };
  domLegend = createLegend(initialMetrics);

  return initialMetrics;
}

// adjust word-spacing to get as close to target-width given min/max
// start at current word-spacing and takes small steps toward target
const adjustWordSpace = function (lineEle, targetWidth, opts) {
  //console.log('adjustWordSpace',lineEle, targetWidth, opts);
  // calculation in scale=1, not current scale

  if (!initialMetrics) throw Error('requires initialMetrics');

  if (highlightWs) ["max-word-spacing", "min-word-spacing"]
    .forEach(c => { if (lineEle.firstChild) lineEle.firstChild.classList.remove(c) });

  //let restore = opts && opts.restore;
  let radius = initialMetrics.radius;
  let fontSize = initialMetrics.fontSize;
  let lineIdx = parseInt((lineEle.id).slice(1));
  let currentWidth = getLineWidth(lineIdx);
  let wordSpacingPx = window.getComputedStyle(lineEle).wordSpacing.replace('px', '');
  let wordSpacingEm = (parseFloat(wordSpacingPx) / fontSize); // px => em
  let step = currentWidth > targetWidth ? -0.01 : 0.01;
  //let originalWordSpacing = wordSpacingEm;
  /*console.log('adjustWordSpace: "' + lineEle.textContent
    + '"\n  width=' + currentWidth + '\n  target=' + targetWidth
    + '\n  wspace=' + wordSpacingEm + '\n  step=' + step);*/

  let closeEnough = radius / 100, hitMin = false, hitMax = false;
  while (Math.abs(currentWidth - targetWidth) > closeEnough) {

    lineEle.style.wordSpacing = wordSpacingEm + "em";
    currentWidth = getLineWidth(lineIdx);
    wordSpacingEm = clamp(wordSpacingEm + step, minWordSpace, maxWordSpace);
    if (wordSpacingEm === minWordSpace) hitMin = true;
    if (wordSpacingEm === maxWordSpace) hitMax = true;
    if (hitMin || hitMax) {
      console.log('[WARN] @'+lineIdx+' Wordspace at max: ' + wordSpacingEm);
      break;
    }
  }

  if (/*!restore && */highlightWs && (hitMin || hitMax)) { // debugging only
    if (lineEle.firstChild) {
      if (hitMax) lineEle.firstChild.classList.add("max-word-spacing");
      if (hitMin) lineEle.firstChild.classList.add("min-word-spacing");
    }
  }

  //  if (restore) lineEle.style.wordSpacing = originalWordSpacing + "em";

  return wordSpacingEm;
}

const adjustWordSpaceOld = function (lineEle) {
  // calculation in scale=1, not current scale

  if (highlightWs) ["max-word-spacing", "min-word-spacing"]
    .forEach(c => lineEle.classList.remove(c));

  let minWordSpace = minWordSpace;
  let maxWordSpace = maxWordSpace;
  let wordSpacing = window.getComputedStyle(lineEle).wordSpacing;
  let step = 0.01;
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

  if (highlightWs) { // debugging only
    if (ws >= maxWordSpace) line.classList.add("max-word-spacing");
    if (ws >= minWordSpace) line.classList.add("min-word-spacing");
  }

  // set word-spacing on line to clamped value
  lineEle.style.wordSpacing = clamp(ws, minWordSpace, maxWordSpace) + "em";

  return ws;
}

/*
  parameter: offset, radius, words, metrics: {fontName, fontSize, lineHeight, wordSpacing} 
  @return: { text, rects, words }
*/
const fitToLineWidths = function (offset, radius, words, metrics) {
  // calculation in scale=1, not current scale
  let { fontFamily, fontSize, leading, wordSpacing } = metrics;
  let tokens = words.slice();
  let text = [], rects = lineWidths(offset, radius, leading);
  rects.forEach(([x, y, w, h], i) => {
    let data = fitToBox(tokens, w, fontSize, fontFamily, wordSpacing);
    if (!data) { // fail to fit any words
      text.push('');
      return;
    }
    text.push(data.used);
    tokens = data.unused;
  });
  return { text, rects, words: tokens };
}

/*
  Finds the set of words that can fit in the specificied width
  @return: { words: remaining words, text: words that fit on line }
*/
const fitToBox = function (words, maxWidth, fontSize, fontName, wordSpacing) {
  // caculation in scale=1, not current scale
  //console.log('fitToBox', words, width, fontSize);
  let i = 1, line = {
    text: words[0],
    width: measureWidth(words[0], fontSize, fontName, wordSpacing)
  };

  if (line.width > maxWidth) return; // can't fit first word

  for (let n = words.length; i < n; ++i) {
    let next = ' ' + words[i];
    let nextWidth = measureWidth(next, fontSize, fontName, wordSpacing);
    if (line.width + nextWidth > maxWidth) break; // done
    line.text += next;
    line.width += nextWidth;
  }
  words = words.slice(i); // remove used words
  if (RiTa.isPunct(words[0])) { // punct can't start a line
    line.text += words.shift();
  }

  return {
    unused: words, used: RiTa.untokenize((line.text || '').split(' ')),
  };
}

// TODO: should measure with the DOM, not canvas
const measureWidth = function (text, fontSizePx = 12, fontName = fontFamily, wordSpacing = 0) {
  // caculation in scale=1, not current scale
  measureCtx = measureCtx || document.createElement("canvas").getContext("2d");
  measureCtx.font = fontSizePx + 'px ' + fontName;
  let spaceCount = text ? (text.split(" ").length - 1) : 0;
  return measureCtx.measureText(text).width + (spaceCount * (wordSpacing * fontSizePx));
}

const chordLength_old = function (rad, d) {
  return 2 * Math.sqrt(rad * rad - (rad - d) * (rad - d));
}

const lineWidths_old = function (center, rad, lh) {
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

const chordLength = function (rad, dis) {
  return 2 * Math.sqrt(rad * rad - dis * dis);
}

const lineWidths = function (center, rad, lh) {
  let numOfLine = Math.floor((2 * rad) / lh);
  let gap = ((2 * rad) - (numOfLine * lh)) / (numOfLine + 1);
  if (numOfLine % 2 === 1) {
    let numInEachPart = (numOfLine - 1) / 2;
    let halfLh = lh / 2;
    let middleCl = chordLength(rad, halfLh);
    let result = [[center.x - middleCl / 2, center.y - halfLh, middleCl, lh]];
    for (let i = 0; i < numInEachPart - 1; i++) {
      let d = halfLh + ((i + 1) * (gap + lh));
      let cl = chordLength(rad, d);
      if (cl) result.unshift([center.x - cl / 2, center.y - d, cl, lh]);
    }
    for (let i = 0; i < numInEachPart - 1; i++) {
      let d = halfLh + (i * lh + (i + 1) * gap);
      let d2 = halfLh + ((i + 1) * (gap + lh));
      let cl = chordLength(rad, d2);
      if (cl) result.push([center.x - cl / 2, center.y + d, cl, lh]);
    }
    return result;
  } else {
    let numInEachPart = (numOfLine / 2) - 1;
    let halfGap = gap / 2;
    let middleCl = chordLength(rad, lh + halfGap);
    let result = [[center.x - middleCl / 2, center.y - (halfGap + lh), middleCl, lh],
    [center.x - middleCl / 2, center.y + (halfGap), middleCl, lh]];
    for (let i = 0; i < numInEachPart - 1; i++) {
      let d = (halfGap + lh) + ((i + 1) * (gap + lh));
      let cl = chordLength(rad, d);
      if (cl) result.unshift([center.x - cl / 2, center.y - d, cl, lh]);
    }
    for (let i = 0; i < numInEachPart - 1; i++) {
      let d = (halfGap + lh) + (i * lh + (i + 1) * gap);
      let d2 = (halfGap + lh) + ((i + 1) * (gap + lh));
      let cl = chordLength(rad, d2);
      if (cl) result.push([center.x - cl / 2, center.y + d, cl, lh]);
    }
    return result;
  }
}
