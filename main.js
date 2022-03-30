const repIds = replaceables();
const history = { rural: [], urban: [] };
const strictRepIds = strictReplaceables(repIds);
const domStats = document.querySelector('#stats');
const domDisplay = document.querySelector('#display');

const state = {
  destination: 'rural',
  updateDelay: 500,
  stepMode: false,
  outgoing: true,
  updating: true,
  logging: false,
  maxSteps: 50,
  maxLegs: 20,
  reader: 0,
  loopId: 0,
  legs: 0
};

let displaySims, shadowSims, worker, cachedHtml, wordSpacing, spans;

let wordspaceMinMax = [-0.1, .5]; // in em
let displayBounds = domDisplay.getBoundingClientRect();
let font = window.getComputedStyle(domDisplay).fontFamily;
let cpadding = window.getComputedStyle(domDisplay).padding;
let padfloat = parseFloat(cpadding.replace('px', ''));
let padding = (!padfloat || padfloat === NaN) ? 30 : padfloat;
let radius = displayBounds.width / 2;
let highlights = false;

// setup history and handlers
Object.keys(history).map(k => sources[k].map((w, i) => history[k][i] = [w]));
document.addEventListener('keyup', keyhandler);
console.log('[INFO] Key cmds -> (l)ogging (h)ighlight (i)nfo (s)tep (e)nd');
window.onresize = () => {
  displayBounds = domDisplay.getBoundingClientRect();
  radius = displayBounds.width / 2;
  scaleToFit();
}

// create progress bars
let progressBars = setupProgress({
  color:
    //["#26495c", "#c4a35a", "#c66b3d", "#e5e5cd"] 
    ["#d8d8d8", "#dfdfdf", "#eaeaea", "#f6f6f6"]
});

// layout lines in circular display
let initialMetrics = { radius: Math.max(radius, 450) };
let offset = {
  x: displayBounds.x + initialMetrics.radius,
  y: displayBounds.y + initialMetrics.radius
};
let opts = { offset, font, lineHeightScale: 1.28, padding: padding };
let lines = dynamicCircleLayout(sources[state.destination], initialMetrics.radius, opts);
initialMetrics.lineWidths = layoutCircular(domDisplay, initialMetrics.radius, lines);
initialMetrics.fontSize = lines[0].fontSize;

scaleToFit();
ramble(); // go

/////////////////////////////////////////////////////////

function ramble() {

  let { updating, outgoing, destination } = state;

  if (!state.reader) { // first time

    // double-check the span count
    spans = document.getElementsByClassName("word");
    // if (spans.length != sources[state.destination].length) {
    //   throw Error('Invalid spanify: ' + spans.length
    //     + '!==' + sources[state.destination].length);
    // }

    // double-check measureWidthForLine
    // let l1 = document.querySelector("#l1");
    // let cWidth = window.getComputedStyle(l1.firstChild).width;
    // let mWidth = measureWidthForLine(lines[1].text, 1);
    // let radScale = radius / initialMetrics.radius;
    // if (Math.abs(parseFloat(cWidth.replace("px", "")) * radScale - mWidth) > 1) {
    //   throw new Error("invalid measureWidthForLine");
    // }

    if (!state.stepMode) {
      state.reader = new Reader(spans);
      state.reader.start();
    }
  }

  if (!worker) {
    worker = new Worker("similars.js");
    worker.onmessage = replace;
  }

  if (updating) {
    if (outgoing) {
      // tell worker to do similar search
      let idx = RiTa.random(repIds.filter(id => !state.reader
        || !state.reader.selection().includes(sources[destination][id])));
      startMs = Date.now();
      worker.postMessage({ idx, destination }); // calls replace() when done
    }
    else {
      restore();
    }
  }
}

/* logic for steps, legs and domain swapping */
function updateState() {

  let { maxSteps, legs, maxLegs, logging } = state;

  let steps = numMods();
  if (state.outgoing) {
    if (steps >= maxSteps) {
      if (++state.legs >= maxLegs) return stop();
      if (logging) console.log(`Reverse: incoming in `
        + `"urban" after leg #${legs + 1}.\n`);
      state.outgoing = false;
      state.destination = 'urban'; // swap dest
    }
  }
  else {   // incoming
    if (steps === 0) {
      if (++state.legs >= maxLegs) return stop();
      if (logging) console.log(`Reverse: outgoing in `
        + `"urban" after leg #${legs + 1}.\n`);
      state.outgoing = true;
    }
  }
  updateInfo();
}


function replace(e) { // called by similars.js (worker)

  let { destination, updateDelay, logging } = state;
  let { idx, displaySims, shadowSims } = e.data;

  if (idx === -1) { // dev-only
    let cache = e.data.similarCache;
    let size = Object.keys(cache).length;
    let data = `let precache=${JSON.stringify(cache, 0, 2)};`
    data += `\n\nlet htmlSpans='${cachedHtml}';\n`;
    if (0) {
      download(data, `preload-${size}.js`, 'text');
      console.log(`[INFO] wrote preload-${size}.js`);
    }
    return;
  }

  let shadow = destination === 'rural' ? 'urban' : 'rural';
  let displayWord = sources[destination][idx];
  let shadowWord = sources[shadow][idx];
  let pos = sources.pos[idx];
  let delayMs = 1;

  if (displaySims.length && shadowSims.length) {

    // pick a random similar to replace in display text
    let displayWord = sources[destination][idx];
    let displayNext = lengthAwareRandom(idx, displayWord, displaySims);
    history[destination][idx].push(displayNext);
    updateDOM(displayNext, idx);

    let shadowNext = lengthAwareRandom(idx, shadowWord, shadowSims);
    history[shadow][idx].push(shadowNext);

    updateState();

    let ms = Date.now() - startMs;
    delayMs = Math.max(1, updateDelay - ms);

    if (logging) console.log(`${numMods()}) @${idx} ${destination}: ${displayWord} `
      + ` -> ${displayNext}, ${shadow}: ${shadowWord} -> ${shadowNext} [${pos}] ${ms}ms`);
  }
  else {

    console.warn(`[FAIL] @${idx} `
      + `${displayWord} -> ${displaySims.length}, ${shadowWord} `
      + `-> ${shadowSims.length} [${pos}] in ${Date.now() - startMs} ms`);
  }

  if (!state.stepMode) state.loopId = setTimeout(ramble, delayMs);
}

/* selects an index to restore (from history) in displayed text */
function restore() {

  let { destination, updateDelay, logging } = state;

  let displayWords = unspanify();

  // get all possible restorations
  let choices = repIds
    .map(idx => ({ idx, word: displayWords[idx] }))
    .filter(({ word, idx }) => history[destination][idx].length > 1
      && isReplaceable(word));

  if (choices.length) {

    // pick a changed word to step back
    let { word, idx } = RiTa.random(choices);
    let pos = sources.pos[idx];
    let hist = history[destination][idx];

    // select newest from history
    hist.pop();
    let next = hist[hist.length - 1];

    history[shadowTextName()][idx].pop(); // stay in sync?

    // do replacement
    updateDOM(next, idx);

    if (logging) console.log(`${numMods()}] @${idx} `
      + `${destination}: ${word} -> ${next} [${pos}]`);
  }
  else {
    let id = repIds.find(idx => history[destination][idx].length > 1);
    let wrd = sources[destination][id];
    let hst = history[destination][id];
    console.warn('[WARN] Invalid-state, numMods:'
      + numMods() + ' idx=' + id + '/' + wrd + ' history=', hst);
    stop();
    return
  }

  updateState();

  if (!state.stepMode) state.loopId = setTimeout(ramble, updateDelay);
}

/* compute the affinity over 2 text arrays for a set of word-ids */
function affinity(textA, textB, idsToCheck) {

  let matches = idsToCheck.reduce((total, idx) =>
    total + (textA[idx] === textB[idx] ? 1 : 0), 0);
  let raw = matches / idsToCheck.length;
  let fmt = (raw * 100).toFixed(2);
  while (fmt.length < 5) fmt = '0' + fmt; // pad
  return fmt;
}

/* total number of replacements made in display text */
function numMods() {
  return repIds.reduce((total, idx) =>
    total + history[state.destination][idx].length - 1, 0);
}

/* stop rambler and reader  */
function stop() {
  let { reader } = state;
  clearTimeout(state.loopId);
  state.updating = false;
  if (reader) reader.stop();
  setTimeout(_ =>
    Array.from(spans).forEach(e => {
      e.classList.remove('incoming');
      e.classList.remove('outgoing');
    }), 1000);
  if (state.logging) console.log('[INFO] done');
  updateInfo();
  worker.postMessage({ idx: 0, destination: 0 });
}

/* update stats in debug panel */
function updateInfo() {
  let { updating, destination, outgoing, legs, maxLegs } = state;

  let displayWords = unspanify(); // get words

  // compare visible text to each source text
  let affinities = [
    affinity(sources.rural, displayWords, repIds),
    affinity(sources.urban, displayWords, repIds),
    affinity(sources.rural, displayWords, strictRepIds),
    affinity(sources.urban, displayWords, strictRepIds)
  ];

  // Update the #stat panel
  let data = 'Domain: ' + destination;
  data += '&nbsp;' + (updating ? (outgoing ? '⟶' : '⟵') : 'X');
  data += ` &nbsp; Leg: ${legs + 1} /${maxLegs}&nbsp; Affinity:`;
  data += ' Rural=' + affinities[0] + ' Urban=' + affinities[1];
  data += ' &nbsp;Strict:'; // and now in strict mode
  data += ' Rural=' + affinities[2] + ' Urban=' + affinities[3];

  domStats.innerHTML = data;

  progressBars.forEach((p, i) =>
    p.animate((updating ? affinities[i] : 0) / 100,
      { duration: 3000 }, () => 0/*console.log('done0')*/));
}

function replaceables() { // [] of replaceable indexes
  let repids = [], count = 0;
  sources.rural.forEach((word, idx) => {
    if (isReplaceable(word)) repids.push(idx);
  });
  sources.urban.forEach((word, idx) => {
    if (isReplaceable(word)) {
      if (!repids.includes(idx)) throw Error('Invalid state[1]');
      count++;
    }
  });
  if (repids.length !== count) throw Error('Invalid state[2]');

  return repids;
}

function isReplaceable(word) {
  return word.length >= minWordLength && !stops.includes(word);
}

/* compute id set for strict replacements */
function strictReplaceables() {
  return repIds.filter(idx =>
    sources.rural[idx] !== sources.urban[idx]);
}


function unspanify() {
  return Array.from(document.getElementsByClassName
    ("word")).map(e => e.textContent);
}

function lengthAwareRandom(widx, word, options) {

  let scaleRatio = radius / initialMetrics.radius;
  const wordEle = document.querySelector(`#w${widx}`);
  const lineEle = wordEle.parentElement.parentElement;
  let lineIdx = parseInt((lineEle.id).slice(1));
  let originalW = initialMetrics.lineWidths[lineIdx] - (2 * padding);
  let currentW = lineEle.firstChild.getBoundingClientRect().width / scaleRatio;
  let filter, msg = '', wordW = measureWidthForLine(word, lineIdx); 
  if (originalW > currentW) {
    filter = (o) => measureWidthForLine(o, lineIdx) > wordW;
    msg += 'need longer word';
  }
  else {
    filter = (o, i) => measureWidthForLine(o, lineIdx) < wordW;
      // console.log('  ', i, `orig: ${word}(${Math.round(wordW)})`
      //   + ` check: ${o} (${Math.round(ow)})`);
    msg += 'need shorter word';
  }

  let choices = options.filter(filter);
  if (!choices || !choices.length) {
    choices = options;
    msg += ' [random] ';
  }

  let choice = RiTa.random(choices);
  //console.log(msg + ', replaced ' + word + `(${Math.round(wordW)})` + ' with '
    //+ choice + `(${Math.round(measureWidthForLine(choice, lineIdx))})`);
  return choice;
}

function shadowTextName() {
  return state.destination === 'rural' ? 'urban' : 'rural';
}

function keyhandler(e) {
  if (e.code === 'KeyI') {
    let stats = document.querySelector('#stats');
    let curr = window.getComputedStyle(stats);
    stats.style.display = curr.display === 'block' ? 'none' : 'block';
  }
  else if (e.code === 'KeyL') {
    state.logging = !state.logging;
  }
  else if (e.code === 'KeyH') {
    highlights = !highlights;
    if (!highlights) {
      Array.from(spans).forEach(e => {
        e.classList.remove('incoming');
        e.classList.remove('outgoing');
      });
    }
  }
  else if (e.code === 'KeyE') {
    stop();
  }
  else if (e.code === 'KeyS') {
    if (!state.stepMode) {
      state.stepMode = true;
      if (state.reader) state.reader.stop();
    }
    else {
      state.loopId = setTimeout(ramble, 1);
    }
  }
}

function updateDOM(next, idx) {
  const word = document.querySelector(`#w${idx}`);
  const line = word.parentElement.parentElement;
  word.textContent = next;
  if (highlights) word.classList.add(state.outgoing ? 'outgoing' : 'incoming');
  wordSpacing = adjustWordSpace(line,
    initialMetrics, wordspaceMinMax, padding, radius);
}

function scaleToFit() {
  document.querySelector('#text-display').style.transform
    = "scale(" + radius / initialMetrics.radius + ")";
}