
function circleLayout(words, radius, opts = {}) {
  let cx = opts.xOffset || 0;
  let cy = opts.yOffset || 0;
  let padding = opts.padding || 0;
  let fontName = opts.font || 'sans-serif';
  let fontSize = opts.fontSize || 10;
  
  let result = fitToLineWidths(cx, cy, radius - padding, words, fontSize, fontName);
  
  let excess = result.words.length;
  let blanks = result.text.filter(t => t.length <= 1).length;
  if (blanks > 2) console.warn('[WARN] ' + blanks + ' blank lines');
  if (excess) console.warn('[WARN] ' + excess + ' words not included');
  
  return result.rects.map((r, i) => ({ fontSize, bounds: r, text: result.text[i] }));
}

function bestCircleLayout(words, radius, opts = {}) {

  let cx = opts.xOffset || 0;
  let cy = opts.yOffset || 0;
  let padding = opts.padding || 0;
  let fontName = opts.font || 'sans-serif';

  radius -= padding;
  let fontSize = radius / 4, result;
  do {
    fontSize *= .99;
    result = fitToLineWidths(cx, cy, radius, words, fontSize, fontName);
  }
  while (result.words.length);
  console.log('Computed fontSize:', fontSize);
  
  return result.rects.map((r, i) => ({ fontSize, bounds: r, text: result.text[i] }));
}

function fitToLineWidths(cx, cy, radius, words, fontSize, fontName = 'sans-serif') {
  //console.log('fitToLineWidths', fontSize);
  let tokens = words.slice(), lh = fontSize * 1.2;
  let text = [], rects = lineWidths(cx, cy, radius, lh);
  rects.forEach(([x, y, w, h], i) => {
    let data = fitToBox(tokens, w, fontSize, fontName);
    if (!data) { // fail to fit any words
      text.push('');
      return;
    }
    text.push(data.text);
    tokens = data.words;
  });
  if (rects.length !== text.length) throw Error('mismatch in fitToLineWidths')//tmp
  return { text, rects, words: tokens };
}

function fitToBox(words, width, fontSize, fontName = 'sans-serif') {
  //console.log('fitToBox', words, width, fontSize);
  let i = 1, line = {
    text: words[0],
    width: measureWidth(words[0], fontSize, fontName)
  };
  if (line.width > width) return; // can't fit first word

  for (let n = words.length; i < n; ++i) {
    let next = ' ' + words[i];
    let nextWidth = measureWidth(next, fontSize, fontName);
    if (line.width + nextWidth > width) {
      break; // done
    }
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

function lineWidths(cx, cy, r, lh) {
  //console.log('lineWidths', cx, cy, r, lh);
  let result = [];
  let num = Math.floor((r * 2) / lh);
  for (let i = 0; i < num; i++) {
    let d = (i + 1) * lh - lh / 3; // ?
    let cl = chordLength(r, d > r ? d + lh : d);
    let x = cx - cl / 2;
    let y = cy - (r - d);
    if (cl) {
      //console.log(i, d, d > r, cl);
      result.push([x, y, cl, lh]);
    }
  }
  return result;
}

// at distance 'd' from top of circle with radius 'rad'
function chordLength(rad, d) {
  return 2 * Math.sqrt(rad * rad - (rad - d) * (rad - d));
}

let context;
function measureWidth(text, fontSizePx = 12, fontName = font) {
  context = context || document.createElement("canvas").getContext("2d");
  context.font = fontSizePx + 'px ' + fontName;
  return context.measureText(text).width;
}

function createProgressBar(ele, opts = {}) {
  return new ProgressBar.Circle(ele, {
    duration: opts.duration || 3000,
    strokeWidth: opts.strokeWidth || 1.1,
    easing: opts.easing || 'easeOut',
    trailColor: opts.trailColor || '#fafafa',
    color: opts.color || '#ddd'
  });
}