/*
  Layout lines within radius, adjusting font-size as needed
  @params words, radius, opts = {
    opts.offset : object: { x: x, y: y };
    opts.padding: float;
    opts.fontFamily: css str
    opts.fontSize: float, for init guess;
    opts.lineHeightScale: float;
    opts.wordSpacing: float, in em
  }
  @return [fontSize, wordSpacing, bounds, text, fontFamily]
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
  // calculation in scale=1, not current scale

  if (!initialMetrics) throw Error('requires initialMetrics');

  if (highlightWs) ["max-word-spacing", "min-word-spacing"].forEach
    (c => lineEle.firstChild && lineEle.firstChild.classList.remove(c));

  let lineIdx = parseInt((lineEle.id).slice(1));
  let currentWidth = getLineWidth(lineIdx);
  let wordSpacingEm = getWordSpaceEm(lineEle); // px => em

  wordSpacingEm = parseFloat(wordSpacingEm.toFixed(2)); // why?

  if (targetWidth === currentWidth) return wordSpacingEm;

  let bound1 = wordSpacingEm, bound2, w1;
  let hitMin = false, hitMax = false, step = 0.01;
  let direction = currentWidth > targetWidth ? -1 : 1;

  while ((direction > 0 ? currentWidth < targetWidth : currentWidth > targetWidth)) {
    bound1 = clamp(bound1 + (step * direction), minWordSpace, maxWordSpace);
    currentWidth = getLineWidth(lineIdx, bound1);
    if (bound1 <= minWordSpace || bound1 >= maxWordSpace) break;
  }

  w1 = currentWidth;
  bound2 = bound1 - (step * direction);
  currentWidth = getLineWidth(lineIdx, bound2);

  let finalWs = Math.abs(w1 - targetWidth) >
    Math.abs(currentWidth - targetWidth) ? bound2 : bound1;

  if (finalWs <= minWordSpace) hitMin = true;
  if (finalWs >= maxWordSpace) hitMax = true;

  lineEle.style.wordSpacing = finalWs + "em";

  if (highlightWs && lineEle.firstChild && (hitMin || hitMax)) { // debugging
    if (hitMax) {
      console.log('[WARN] @' + lineIdx + ' Wordspace at max: ' + finalWs);
      lineEle.firstChild.classList.add("max-word-spacing");
    }
    else {
      console.log('[WARN] @' + lineIdx + ' Wordspace at min: ' + finalWs);
      lineEle.firstChild.classList.add("min-word-spacing");
    }
  }

  return finalWs;
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

  if (RiTa.isPunct(words[0])) { // punct shouldn't start a line
    line.text += words.shift();
  }

  return {
    unused: words, used: RiTa.untokenize((line.text || '').split(' ')),
  };
}

const measureWidth = function (text, fontSizePx = 12, fontName = fontFamily, wordSpacing = 0) {
  // caculation in scale=1, not current scale
  measureCtx.font = fontSizePx + 'px ' + fontName;
  let spaceCount = text ? (text.split(" ").length - 1) : 0;
  return measureCtx.measureText(text).width + (spaceCount * (wordSpacing * fontSizePx));
}

const chordLength = function (rad, dis) {
  return 2 * Math.sqrt(rad * rad - dis * dis);
}

const lineWidths = function (center, rad, lh) {
  let numOfLine = Math.floor((2 * rad) / lh), result;
  let gap = ((2 * rad) - (numOfLine * lh)) / (numOfLine + 1);
  if (numOfLine % 2 === 1) {
    let numInEachPart = (numOfLine - 1) / 2;
    let halfLh = lh / 2;
    let middleCl = chordLength(rad, halfLh);
    result = [[center.x - middleCl / 2, center.y - halfLh, middleCl, lh]];
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
  }
  else {
    let numInEachPart = (numOfLine / 2) - 1;
    let halfGap = gap / 2;
    let middleCl = chordLength(rad, lh + halfGap);
    result = [
      [center.x - middleCl / 2, center.y - (halfGap + lh), middleCl, lh],
      [center.x - middleCl / 2, center.y + (halfGap), middleCl, lh]
    ];
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
  }
  return result;
}
