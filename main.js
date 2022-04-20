const repIds = replaceables();
const history = { rural: [], urban: [] };
const strictRepIds = strictReplaceables(repIds);
const domStats = document.querySelector('#stats');
const domDisplay = document.querySelector('#display');

// length of short and long walks
const shortWalkLegs = 4, longWalkLegs = 20;

// time between word replacements
const updateDelay = 500;

// number of steps on incoming/outgoing legs
const stepsPerLeg = 20;

// time on new text before updates begin
const preUpdateDelay = stepsPerLeg * updateDelay * 3; 

// min and max CSS word-spacing (em)
const wordspaceMinMax = [-0.1, .5];

const progressBarColor = ["rgb(0, 0, 0, 0.6)", "rgb(255, 97, 97, 0.6)", "rgba(178, 68, 68, 0.8)", "rgba(106, 166, 230, 0.6)", "rgba(54, 84, 116, 0.8)"]; // red-blue
// ["rgb(0, 0, 0, 0.6)", "rgba(0, 166, 233, 0.6)", "rgba(82, 158, 191, 0.8)", "rgba(245, 199, 0, 0.6)", "rgba(236, 192, 0, 0.8)"]; // yellow-blue
// ["rgb(0, 0, 0, 0.6)", "rgba(255, 97, 97, 0.6)", "rgba(178, 68, 68, 0.8)", "rgba(50, 187, 87, 0.6)", "rgb(30, 111, 52, 0.8)"]; // red-green

const state = {
  domain: 'rural',
  maxLegs: shortWalkLegs,
  verbose: false,
  stepMode: false,
  outgoing: true,
  updating: false,
  logging: true,
  reader: 0,
  loopId: 0,
  legs: 0
};

let displaySims, shadowSims, worker, cachedHtml, wordSpacing, spans;
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
let progressBars = setupProgress({ color: progressBarColor });

// layout lines in circular display
let initialMetrics = { radius: Math.max(radius, 450) };
let offset = {
  x: displayBounds.x + initialMetrics.radius,
  y: displayBounds.y + initialMetrics.radius
};
let opts = { offset, font, lineHeightScale: 1.28, padding: padding };
let lines = dynamicCircleLayout
  (sources[state.domain], initialMetrics.radius, opts);
initialMetrics.lineWidths = layoutCircular
  (domDisplay, initialMetrics.radius, lines);
initialMetrics.fontSize = lines[0].fontSize;

createLegend();
scaleToFit();
ramble(); // go

/////////////////////////////////////////////////////////

function ramble() {

  let { updating, outgoing, domain } = state;

  if (!state.reader) { // first time
    spans = document.getElementsByClassName("word");
    if (!state.stepMode) {
      state.reader = new Reader(spans);
      state.reader.doAfter(preUpdateDelay, update); // first-time
      console.log(`[INFO] Delays: preUpdate=${preUpdateDelay}ms`
        + ` update=${updateDelay}ms`);
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
        || !state.reader.selection().includes(sources[domain][id])));
      startMs = Date.now();
      worker.postMessage({ idx, domain }); // calls replace() when done
    }
    else {
      restore();
    }
  }
}

function update(updating = true) {
  //console.log(`update(${updating})`);
  state.updating = updating;
  state.maxLegs = shortWalkLegs;
  ramble();
}

/* logic for steps, legs and domain swapping */
function updateState() {

  let { domain, legs, maxLegs, logging } = state;

  let steps = numMods();
  if (state.outgoing) {
    if (steps >= stepsPerLeg) {
      //if (++state.legs >= maxLegs) return stop();
      if (logging) console.log(`Reverse: incoming in `
        + `"${domain}" on leg #${legs + 1}/${maxLegs}\n`);
      state.outgoing = false;
    }
  }
  else {   // incoming
    if (steps === 0) {
      state.outgoing = true;
      if (++state.legs >= maxLegs) {
        state.legs = 0;
        state.domain = (state.domain === 'rural') ? 'urban' : 'rural';
        if (maxLegs === shortWalkLegs) {
          state.maxLegs = longWalkLegs;
        }
        else {
          state.update = false;
          state.maxLegs = shortWalkLegs;
          state.reader.doAfter(preUpdateDelay, update);
        }
        if (logging) console.log(`Reverse: outgoing in `
          + `"${state.domain}" for ${state.maxLegs} legs\n`);
      }
      else {
        if (logging) console.log(`Reverse: outgoing in `
          + `"${state.domain}" on leg #${legs + 1}/${state.maxLegs}\n`);
      }
    }
  }
  updateInfo();
}


function replace(e) { // called by similars.js (worker)

  let { domain, logging, verbose } = state;
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

  let shadow = domain === 'rural' ? 'urban' : 'rural';
  let displayWord = sources[domain][idx];
  let shadowWord = sources[shadow][idx];
  let pos = sources.pos[idx];
  let delayMs = 1;

  if (displaySims.length && shadowSims.length) {

    // pick a random similar to replace in display text
    let displayWord = sources[domain][idx];
    let displayNext = lengthAwareRandom(idx, displayWord, displaySims);
    history[domain][idx].push(displayNext);
    updateDOM(displayNext, idx);

    let shadowNext = lengthAwareRandom(idx, shadowWord, shadowSims);
    history[shadow][idx].push(shadowNext);

    updateState();

    let ms = Date.now() - startMs;
    delayMs = Math.max(1, updateDelay - ms);

    if (logging && verbose) console.log(`${numMods()}) @${idx} ${domain}: ${displayWord} `
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

  let { domain, logging, verbose } = state;

  let displayWords = unspanify();

  // get all possible restorations
  let choices = repIds
    .map(idx => ({ idx, word: displayWords[idx] }))
    .filter(({ word, idx }) => history[domain][idx].length > 1
      && isReplaceable(word));

  if (choices.length) {

    // pick a changed word to step back
    let { word, idx } = RiTa.random(choices);
    let pos = sources.pos[idx];
    let hist = history[domain][idx];

    // select newest from history
    hist.pop();
    let next = hist[hist.length - 1];

    history[shadowTextName()][idx].pop(); // stay in sync

    // do replacement
    updateDOM(next, idx);

    if (logging && verbose) console.log(`${numMods()}] @${idx} `
      + `${domain}: ${word} -> ${next} [${pos}]`);
  }
  else {
    let id = repIds.find(idx => history[domain][idx].length > 1);
    let wrd = sources[domain][id];
    let hst = history[domain][id];
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
    total + history[state.domain][idx].length - 1, 0);
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
  worker.postMessage({ idx: 0, domain: 0 });
}

/* update stats in debug panel */
function updateInfo() {
  let { updating, domain, outgoing, legs, maxLegs } = state;

  let displayWords = unspanify(); // get words

  // compare visible text to each source text
  let affinities = [
    affinity(sources.urban, displayWords, repIds), // progress bar #1
    affinity(sources.urban, displayWords, strictRepIds), // progress bar #2
    affinity(sources.rural, displayWords, repIds), // progress bar #3
    affinity(sources.rural, displayWords, strictRepIds), // progress bar #4
  ];

  // Update the #stat panel
  let data = 'Domain: ' + domain;
  data += '&nbsp;' + (updating ? (outgoing ? '⟶' : '⟵') : 'X');
  data += ` &nbsp; Leg: ${legs + 1} /${maxLegs}&nbsp; Affinity:`;
  data += ' Rural=' + affinities[2] + ' Urban=' + affinities[0];
  data += ' &nbsp;Strict:'; // and now in strict mode
  data += ' Rural=' + affinities[3] + ' Urban=' + affinities[1];

  domStats.innerHTML = data;

  progressBars.forEach((p, i) => {
    if (i > 0) {
      p.animate((updating ? affinities[i - 1] : 0) / 100,
        { duration: 3000 }, () => 0/*console.log('done0')*/)
    }
  });
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
  return state.domain === 'rural' ? 'urban' : 'rural';
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
  document.querySelector('#legend').style.transform
    = "scale(" + radius / initialMetrics.radius + ")";
}

function createLegend() {
  let legendDiv = document.createElement("div");
  legendDiv.id = "legend";
  legendDiv.style.width = "900px"
  legendDiv.style.height = "900px"
  let legendContent = document.createElement("div");
  legendContent.classList.add("legend-content");
  legendContent.innerHTML = `
  <p><svg class="rural-legend" style="fill: ${progressBarColor[3]}">
  <rect id="box" x="0" y="0" width="20" height="20"/>
  </svg> rural</p>
  <p><svg class="urban-legend" style="fill: ${progressBarColor[1]}">
  <rect id="box" x="0" y="0" width="20" height="20"/>
  </svg> urban</p>
  `
  legendDiv.append(legendContent);
  legendDiv.style.fontSize = (initialMetrics.fontSize) ? initialMetrics.fontSize + "px" : "20.5px"
  document.querySelector("#display").append(legendDiv)
}