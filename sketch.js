
let cx = 450, cy = 450, radius = 450,  cursor = 0, layout;
//fontSize = 32, lineHeight = fontSize * 1.2
let words = ['by', 'the', 'time', 'the', 'light', 'has', 'faded,', 'as', 'the', 'last', 'of', 'the', 'reddish', 'gold', 'illumination', 'comes', 'to', 'rest,', 'then', 'imperceptibly', 'spreads', 'out', 'over', 'the', 'dust', 'and', 'rubble', 'of', 'the', 'craters', 'on', 'the', 'easterly', 'facing', 'bankside', 'heights,', 'you', 'or', 'I', 'will', 'have', 'rushed', 'out', 'on', 'several', 'of', 'yet', 'more', 'circuits', 'at', 'every', 'time', 'and', 'in', 'all', 'directions,', 'before', 'or', 'after', 'this', 'or', 'that', 'violent,', 'usually', 'nocturnal,', 'event', 'on', 'desperately', 'hurried', 'unfamiliar', 'flights,', 'as', 'if', 'these', 'panics', 'might', 'be', 'movements', 'of', 'desire', 'whereas', 'always', 'our', 'gestures,', 'constrained', 'by', 'obstacles,', 'are', 'also', 'more', 'like', 'scars', 'of', 'universal', 'daily', 'terror:', 'just', 'before', 'or', 'with', 'the', 'dawn,', 'after', 'a', 'morning', 'prayer,', 'in', 'anticipation', 'of', 'hunger,', 'while', 'the', 'neighbors', 'are', 'still', 'breathing,', 'as', 'and', 'when', 'the', 'diligent', 'authorities', 'are', 'marshaling', 'their', 'cronies', 'and', 'thugs,', 'after', 'our', 'own', 'trials', 'of', 'loss,', 'while', 'the', 'mortars', 'still', 'fall,', 'in', 'quiet', 'moments', 'after', 'shock,', 'most', 'particularly', 'after', 'curfew,', 'at', 'sunset,', 'to', 'escape,', 'to', 'avoid', 'being', 'found,', 'to', 'seem', 'to', 'be', 'lost', 'right', 'here', 'in', 'this', 'place', 'where', 'you', 'or', 'I', 'have', 'always', 'wanted', 'to', 'be', 'and', 'where', 'we', 'might', 'sometimes', 'now', 'or', 'then', 'have', 'discovered', 'some', 'singular', 'hidden', 'beauty,', 'or', 'one', 'another,', 'or', 'stumbled', 'and', 'injured', 'ourselves', 'beyond', 'the', 'hearing', 'and', 'call', 'of', 'other', 'voices,', 'or', 'met', 'with', 'other', 'danger,', 'venal', 'or', 'military,', 'the', 'one', 'tearing', 'and', 'rending', 'and', 'opening', 'up', 'the', 'darkness', 'within', 'us', 'to', 'bleed,', 'yet', 'we', 'suppress', 'any', 'sound', 'that', 'might', 'have', 'expressed', 'the', 'terror', 'and', 'longing', 'and', 'horror', 'and', 'pain', 'so', 'that', 'I', 'or', 'you', 'may', 'continue', 'on', 'this', 'expedition,', 'this', 'before', 'or', 'after', 'assault,', 'and', 'still', 'return;', 'or', 'the', 'other,', 'the', 'quiet', 'evacuation', 'of', 'the', 'light,', 'the', 'way,', 'as', 'we', 'have', 'kept', 'on', 'struggling,', 'it', 'falls', 'on', 'us', 'and', 'removes', 'us', 'from', 'existence', 'since', 'in', 'any', 'case', 'we', 'are', 'all', 'but', 'never', 'there,', 'always', 'merely', 'passing', 'through', 'and', 'by', 'and', 'over', 'the', 'dust,', 'within', 'the', 'shadows', 'of', 'our', 'ruins,', 'beneath', 'the', 'wall,', 'within', 'the', 'razor', 'of', 'its', 'coiled', 'wire,', 'annihilated,', 'gone,', 'quite', 'gone,', 'now', 'simply', 'gone', 'and,', 'in', 'being', 'or', 'advancing', 'in', 'these', 'ways,', 'giving', 'up', 'all', 'living', 'light', 'for', 'unsettled,', 'heart', 'felt', 'fire', 'in', 'our', 'veins,', 'exiled'];
//let txt = "by the time the light has faded, as the last of the reddish gold illumination comes to rest, then imperceptibly spreads out over the dust and rubble of the craters on the easterly facing bankside heights, you or I will have rushed out on several of yet more circuits at every time and in all directions, before or after this or that violent, usually nocturnal, event on desperately hurried unfamiliar flights, as if these panics might be movements of desire whereas always our gestures, constrained by obstacles, are also more like scars of universal daily terror: just before or with the dawn, after a morning prayer, in anticipation of hunger, while the neighbors are still breathing, as and when the diligent authorities are marshaling their cronies and thugs, after our own trials of loss, while the mortars still fall, in quiet moments after shock, most particularly after curfew, at sunset, to escape, to avoid being found, to seem to be lost right here in this place where you or I have always wanted to be and where we might sometimes now or then have discovered some singular hidden beauty, or one another, or stumbled and injured ourselves beyond the hearing and call of other voices, or met with other danger, venal or military, the one tearing and rending and opening up the darkness within us to bleed, yet we suppress any sound that might have expressed the terror and longing and horror and pain so that I or you may continue on this expedition, this before or after assault, and still return; or the other, the quiet evacuation of the light, the way, as we have kept on struggling, it falls on us and removes us from existence since in any case we are all but never there, always merely passing through and by and over the dust, within the shadows of our ruins, beneath the wall, within the razor of its coiled wire, annihilated, gone, quite gone, now simply gone and, in being or advancing in these ways, giving up all living light for unsettled, heart felt fire in our veins, exiled";

function setup() {
  createCanvas(900, 900);
  textFont('sans-serif');
  textAlign(CENTER, CENTER);
}

function draw() {
  background(245);
  noFill();
  circle(cx, cy, radius * 2);
  if (++cursor <= words.length) {
    let txt = words.slice(0, cursor).join(' ');
    layout = maxFontSizeForCircle(txt, radius);
  }
  layout.forEach(r => {
    noFill();
    //rect(...r.bounds);
    fill(0);
    textSize(r.fontSize);
    text(r.text, cx, r.bounds[1] + r.bounds[3] / 2);
  });
}


function maxFontSizeForCircle(text, radius, fontName = 'sans-serif') {
  let fontSize = radius / 2;
  let words = text.split(' ');
  let result;
  do {
    result = fitToLineWidths(cx, cy, words, fontSize *= .95);
  }
  while (result.words.length);

  return result.rects.map((r, i) => ({ fontSize, bounds: r, text: result.texts[i] }));
}

function fitToLineWidths(cx, cy, words, fontSize, fontName = 'sans-serif') {
  //console.log('fitToLineWidths', fontSize);
  let tokens = words.slice();
  let lh = fontSize * 1.2;
  let texts = [];
  let rects = lineWidths(cx, cy, radius, lh);
  rects.forEach(([x, y, w, h], i) => {
    let data = fitToBox(tokens, w, fontSize, fontName);
    if (!data) return { words, rects, texts: [] };
    texts.push(data.text);
    tokens = data.words;
  });
  return { texts, words: tokens, rects };
}

function fitToBox(words, width, fontSize, fontName = 'sans-serif') {
  //console.log('fitToBox', words, width, fontSize);
  let i = 1, line = {
    text: words[0],
    width: measureWidth(words[0], fontSize, fontName)
  };
  if (line.width > width) return;
  for (let n = words.length; i < n; ++i) {
    let next = ' ' + words[i];
    let nextWidth = measureWidth(next, fontSize, fontName);
    if (line.width + nextWidth > width) { // new line
      break;
    }
    line.text += next;
    line.width += nextWidth;
  }
  return { text: line.text || '', words: words.slice(i) };
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

function measureWidth(text, fontSizePx = 12, fontName = 'sans-serif') {
  const context = document.createElement("canvas").getContext("2d");
  context.font = fontSizePx + 'px ' + (fontName || '');
  let w = context.measureText(text).width;
  //console.log(text, w);
  return w;
}

// at distance d from top of circle with radius r
function chordLength(r, d) {
  return 2 * Math.sqrt(r * r - (r - d) * (r - d));
}

function lineate(words, maxWidth) { // unused
  let line, lines = [];
  for (let i = 0, n = words.length; i < n; ++i) {
    let next = ' ' + words[i];
    let nextWidth = measureWidth(next);
    if (!line || line.width + nextWidth > maxWidth) { // new line
      line = { text: words[i], width: measureWidth(words[i]) };
      lines.push(line);
    }
    else { // add to current
      line.text += next;
      line.width += nextWidth;
    }
  }
  return lines;
}
