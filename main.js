// length of short/long walks (legs)
let walks = { short: 2, long: 16 };

// steps in each incoming/outgoing leg
let stepsPerLeg = 50;

// time between word replacements (ms)
let updateDelay = 500;

// time on new text before updates (ms)
let preUpdateDelay = stepsPerLeg * updateDelay * 2;

// min/max CSS word-spacing (em)
let wordspaceMinMax = [-0.1, .5];

// leading for text display
let lineHeightScale = 1.28;

// keyboard toggle options
let logging = true, verbose = false, highlights = false;

// progress bar color options
let redblue = ["rgb(0, 0, 0, 0.6)", "rgb(255, 97, 97, 0.6)", "rgba(178, 68, 68, 0.8)", "rgba(106, 166, 230, 0.6)", "rgba(54, 84, 116, 0.8)"];
let redgreen = ["rgb(0, 0, 0, 0.6)", "rgba(255, 97, 97, 0.6)", "rgba(178, 68, 68, 0.8)", "rgba(50, 187, 87, 0.6)", "rgb(30, 111, 52, 0.8)"];
let yellowblue = ["rgb(0, 0, 0, 0.6)", "rgba(0, 166, 233, 0.6)", "rgba(82, 158, 191, 0.8)", "rgba(245, 199, 0, 0.6)", "rgba(236, 192, 0, 0.8)"];
let progressBarColor = redblue;

// show and hide the strict (outer) progress bars
let displayStrict = false;

// progress bars dict
let progressBarDict = displayStrict ? 
{
  divIndex:
  // [correspondingDivId, correspondingData, correspondingAffinityIndex, correspondingColorIndex]
  [
    ["progressbar0","background", -1, 0],
    ["progressbar1","urbanRegular", 0, 1],
    ["progressbar2","urbanStrict", 1, 2],
    ["progressbar3","ruralRegular", 2, 3],
    ["progressbar4","ruralStrict", 3, 4],
  ],
  contentIndex: 
  //  [correspondingDivId, correspondingAffinityIndex, correspondingColorIndex, correspondingDivIdx]
  {
    background: ["progressbar0", -1, 0, 0],
    urbanRegular: ["progressbar1", 0, 1, 1],
    urbanStrict: ["progressbar2", 1, 2, 2],
    ruralRegular: ["progressbar3", 2, 3, 3],
    ruralStrict: ["progressbar4", 3, 4, 4],
  }
} :
{
  divIndex:
  [
    ["progressbar0","background", -1, 0],
    ["progressbar1","urbanStrict", 1, 2],
    ["progressbar2","urbanRegular", 0, 1],
    ["progressbar3","ruralStrict", 3, 4],
    ["progressbar4","ruralRegular", 2, 3],
  ],
  contentIndex: 
  {
    background: ["progressbar0", -1, 0, 0],
    urbanStrict: ["progressbar1", 0, 2,1 ],
    urbanRegular: ["progressbar2", 1, 1, 2],
    ruralStrict: ["progressbar3", 2, 4,3],
    ruralRegular: ["progressbar4", 3, 3,4],
  }
};

if (1) { // DEBUG-ONLY
  walks.short = 4;
  walks.long = 6;
  stepsPerLeg = 4;
  updateDelay = 1000;
  preUpdateDelay = 5000;
  logging = true;
}

let state = {
  domain: 'rural',
  outgoing: true,
  maxLegs: walks.short,
  stepMode: false,
  updating: false,
  reader: 0,
  loopId: 0,
  legs: 0,
};

let repIds = replaceables();
let history = { rural: [], urban: [] };
let strictRepIds = strictReplaceables(repIds);
let domStats = document.querySelector('#stats');
let domDisplay = document.querySelector('#display');

let displaySims, shadowSims, worker, cachedHtml, wordSpacing, spans
let displayBounds = domDisplay.getBoundingClientRect();
let font = window.getComputedStyle(domDisplay).fontFamily;
let cpadding = window.getComputedStyle(domDisplay).padding;
let padfloat = parseFloat(cpadding.replace('px', ''));
let padding = (!padfloat || padfloat === NaN) ? 30 : padfloat;
let radius = displayBounds.width / 2;

// setup history and handlers
Object.keys(history).map(k => sources[k].map((w, i) => history[k][i] = [w]));
document.addEventListener('keyup', keyhandler);
console.log('[INFO] Keys -> (h)ighlight (i)nfo (s)tep (e)nd (l)og (v)erbose');
window.onresize = () => {
  displayBounds = domDisplay.getBoundingClientRect();
  radius = displayBounds.width / 2;
  scaleToFit();
}

// create progress bars
let progressBars = setupProgress({ color: progressBarColor, displayStrict:displayStrict, dict:progressBarDict });
console.log('[INFO] Displaying strict progress bars: ' + displayStrict);

// layout lines in circular display
let initialMetrics = { radius: Math.max(radius, 450) };
let offset = {
  x: displayBounds.x + initialMetrics.radius,
  y: displayBounds.y + initialMetrics.radius
};
let opts = { offset, font, lineHeightScale, padding };
let lines = dynamicCircleLayout
  (sources[state.domain], initialMetrics.radius, opts);
initialMetrics.lineWidths = layoutCircular
  (domDisplay, initialMetrics.radius, lines);
initialMetrics.fontSize = lines[0].fontSize;

createLegend();
scaleToFit();
ramble();// go

/////////////////////////////////////////////////////////

function ramble() {

  let { updating, outgoing, domain, maxLegs } = state;

  if (maxLegs / 2 !== Math.floor(maxLegs / 2)) {
    throw Error('all walks must be even length');
  }

  if (!worker) {
    worker = new Worker("similars.js");
    worker.onmessage = replace;
  }

  if (!state.reader) { // first time

    // load the word spans
    spans = document.getElementsByClassName("word");
    if (!state.stepMode) {

      // create/start the reader
      state.reader = new Reader(spans);
      log(`Delays: { preUpdate: ${preUpdateDelay / 1000}s,`
        + ` update: ${updateDelay}ms }`);
      log(`Pause for ${preUpdateDelay / 1000}s {domain: ${domain}}`);
      state.reader.pauseForThen(preUpdateDelay, update); // first-time
      state.reader.start();
    }
  }

  if (updating) {
    if (outgoing) {
      // tell worker to do similar search
      let idx = RiTa.random(repIds.filter(id => !state.reader
        || !state.reader.selection().includes(sources[domain][id])));
      startMs = Date.now();

      // calls replace() when done
      worker.postMessage({ idx, domain });
    }
    else {
      restore();
    }
  }
}

/* logic for steps, legs and domain swapping */
function updateState() {

  let steps = numMods();
  if (state.outgoing) {
    if (steps >= stepsPerLeg) {
      state.legs++;
      log(`Reverse: incoming in '${state.domain}'`
        + ` on leg ${state.legs + 1}/${state.maxLegs}`);
      state.outgoing = false;
    }
  }
  else {   // incoming
    if (steps === 0) {
      state.outgoing = true;
      if (++state.legs >= state.maxLegs) {
        state.legs = 0;
        if (state.maxLegs === walks.short) {
          // finished a short walk
          state.maxLegs = walks.long;
          swapDomain();
        }
        else {
          // finished a long walk
          state.updating = false;
          state.maxLegs = walks.short;
          log(`Pause for ${preUpdateDelay / 1000}s {domain: ${state.domain}}`);
          return state.reader.pauseForThen(preUpdateDelay, update);
        }
        log(`Reverse: outgoing in '${state.domain}'`
          + ` on leg ${state.legs + 1}/${state.maxLegs}`);
      }
      else {
        log(`Reverse: outgoing in '${state.domain}'`
          + ` on leg ${state.legs + 1}/${state.maxLegs}`);
      }
    }
  }
  updateInfo();
  return true;
}

function swapDomain() {
  state.legs = 0;
  state.domain = (state.domain === 'rural') ? 'urban' : 'rural';
  log(`Domain switch -> '${state.domain}'`);
}

function replace(e) { // called by similars.js (worker)

  let { domain, verbose } = state;
  let { idx, displaySims, shadowSims } = e.data;

  if (idx === -1) { // dev-only
    let cache = e.data.similarCache;
    let size = Object.keys(cache).length;
    let data = `let precache=${JSON.stringify(cache, 0, 2)};`
    data += `\nlet htmlSpans='${cachedHtml}';\n`;
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

  let { domain, verbose } = state;

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
    let word = sources[domain][id];
    let hist = history[domain][id];
    console.warn('[WARN] Invalid-state, numMods:'
      + numMods() + ' idx=' + id + '/' + word + ' history=', hist);
    stop();
    return
  }

  if (updateState() && !state.stepMode) {
    state.loopId = setTimeout(ramble, updateDelay);
  }
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
  if (logging) console.log('[INFO] done');
  updateInfo();
  worker.postMessage({ idx: 0, domain: 0 });
}

/* update stats in debug panel */
function updateInfo() {
  let { updating, domain, outgoing, legs, maxLegs } = state;

  let displayWords = unspanify(); // get words

  // compare visible text to each source text
  let affinities = [
    affinity(sources.urban, displayWords, repIds),
    affinity(sources.urban, displayWords, strictRepIds), 
    affinity(sources.rural, displayWords, repIds), 
    affinity(sources.rural, displayWords, strictRepIds), 
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
    if (i) p.animate((updating ? affinities[progressBarDict.divIndex[i][2]] : 0) / 100,
      { duration: 3000 }, () => 0/*no-op*/);
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
  let wordEle = document.querySelector(`#w${widx}`);
  let lineEle = wordEle.parentElement.parentElement;
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
    logging = !logging;
    console.log('[INFO] logging: '+logging);
  }
  else if (e.code === 'KeyV') {
    verbose = !verbose;
    console.log('[INFO] verbose: '+verbose);
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
    console.log('[INFO] stepMode: '+stepMode);
  }
}

function updateDOM(next, idx) {
  let { outgoing } = state;
  let word = document.querySelector(`#w${idx}`);
  let line = word.parentElement.parentElement;
  word.textContent = next;
  if (highlights) word.classList.add(outgoing ? 'outgoing' : 'incoming');
  wordSpacing = adjustWordSpace(line,
    initialMetrics, wordspaceMinMax, padding, radius);
}

function update(updating = true) {
  let { domain, legs, maxLegs } = state;
  log(`Start:   outgoing in '${domain}' on leg ${legs + 1}/${maxLegs}`);
  state.updating = updating;
  state.maxLegs = walks.short;
  ramble();
}

function log(msg) {
  if (!logging) return;
  console.log('[INFO] ' + msg);
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
  <p><svg class="rural-legend" style="fill: ${progressBarColor[progressBarDict.contentIndex.ruralRegular[2]]}">
  <rect id="box" x="0" y="0" width="20" height="20"/>
  </svg> rural</p>
  <p><svg class="urban-legend" style="fill: ${progressBarColor[progressBarDict.contentIndex.urbanRegular[2]]}">
  <rect id="box" x="0" y="0" width="20" height="20"/>
  </svg> urban</p>
  `;
  legendDiv.append(legendContent);
  legendDiv.style.fontSize = (initialMetrics.fontSize || 20.5) + 'px';
  document.querySelector("#display").append(legendDiv)
}