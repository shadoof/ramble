
/* NEXT: 
  -- finish worker: awaiting john's reply
  -- OR do progress bars
  -- ? circle should split empty lines btwn top/bottom (not easy)
*/

const domStats = document.querySelector('#stats');
const domDisplay = document.querySelector('#display');
const repIds = replaceables();
const strictRepIds = strictReplaceables();
const history = { rural: [], urban: [] };

let font = window.getComputedStyle(domDisplay).fontFamily;
let displayBounds = domDisplay.getBoundingClientRect();
let cy = displayBounds.y + displayBounds.height / 2;
let cx = displayBounds.x + displayBounds.width / 2;
let radius = displayBounds.width / 2;
let displaySims, shadowSims;

// setup the history
Object.keys(history).map(k => sources[k].map((w, i) => history[k][i] = [w]));

const state = {
  destination: 'rural',
  updateDelay: 500,
  stepDebug: false,
  outgoing: true,
  updating: true,
  maxSteps: 5, // 50
  maxLegs: 2, // 20
  reader: 0,
  loopId: 0,
  legs: 0
};

////////////////////////////////////////////////////////

let opts = { xOffset: cx, yOffset: cy, padding: 20, font, fontSize: 22.35 };
let lines = circleLayout(sources[state.destination], radius, opts);
//let lines = bestCircleLayout(sources[state.destination], radius, opts);
let spans = spanify(lines);
let worker = new Worker("similars.js");
worker.onmessage = replace;
ramble(spans);

// let progress = createProgressBar('#progress'); d = 50;
// let ani = () => progress.animate((d += Math.random() < .5 ? 5 : -5) / 100,
//   { duration: 3000 }, () => setTimeout(ani, 1)); ani(); // animate

/////////////////////////////////////////////////////////

function ramble(spans) {

  const { updating, outgoing, destination } = state;

  if (!state.reader) {
    state.reader = new Reader(spans);
    state.reader.start();
  }
  if (updating) {
    if (outgoing) {
      // tell worker to do similar search
      let idx = RiTa.random(repIds.filter(id =>
        !state.reader.selection().includes(sources[destination][id])));
      startMs = Date.now();
      worker.postMessage({ idx, destination });
      // worker calls replace() when done
    }
    else {
      restore();
    }
  }
}

/* logic for steps, legs and domain swapping */
function updateState() {

  const { maxSteps, legs, maxLegs } = state;

  let steps = numMods();
  if (state.outgoing) {
    if (steps >= maxSteps) {
      if (++state.legs >= maxLegs) return stop();
      console.log(`Reverse: incoming in `
        + `"urban" after leg #${legs + 1}.\n`);
      state.outgoing = false;
      state.destination = 'urban'; // swap dest
    }
  }
  else {   // incoming
    if (steps === 0) {
      if (++state.legs >= maxLegs) return stop();
      console.log(`Reverse: outgoing in `
        + `"urban" after leg #${legs + 1}.\n`);
      state.outgoing = true;
    }
  }
  updateInfo();
}

function replace(e) {

  const { outgoing, destination, updateDelay } = state;

  // isn't this always outgoing?

  let { idx, displaySims, shadowSims } = e.data;

  let shadow = destination === 'rural' ? 'urban' : 'rural';
  let displayWord = sources[destination][idx];
  let shadowWord = sources[shadow][idx];
  let pos = sources.pos[idx];
  let ms = Date.now() - startMs;

  // pick a random similar to replace in display text
  let displayNext = RiTa.random(displaySims);
  history[destination][idx].push(displayNext);
  updateDOM(displayNext, idx);

  let shadowNext = RiTa.random(shadowSims); // displaySims?
  history[shadow][idx].push(shadowNext);

  console.log(`${numMods()}) @${idx} `
    + `${destination}: ${displayWord} -> ${displayNext}, ${shadow}: `
    + `${shadowWord} -> ${shadowNext} [${pos}] ${ms}ms  ${Math.max(1, updateDelay - ms)}`);

  updateState();

  state.loopId = setTimeout(ramble, Math.max(1, updateDelay - ms));
}


/* selects an index with which to replace a word in each text */
/*function replaceOrig() {

  const { outgoing, destination } = state;

  let beingRead = state.reader ? state.reader.selection() : [];
  let ids = repIds.filter(id => !beingRead.includes(sources[destination][id]));
  let idx = RiTa.random(ids);
  let pos = sources.pos[idx];
  let startMs = +new Date();
  let shadow = shadowTextName();
  let displayWord = sources[destination][idx];
  let shadowWord = sources[shadow][idx];

  // get similars for both words
  let displaySims = similars(displayWord.toLowerCase(), pos);
  let shadowSims = similars(shadowWord.toLowerCase(), pos);
  if (!displaySims || !shadowSims) {
    //return; // tmp
    throw Error('FAILED TO REPLACE: \n' + displayWord + ': ' + displaySims + '\n' + shadowWord + ': ' + shadowSims);
  }

  // pick a random similar to replace in display text
  let displayNext = RiTa.random(displaySims);
  history[destination][idx].push(displayNext);
  updateDOM(displayNext, idx);

  let shadowNext = RiTa.random(displaySims);
  history[shadow][idx].push(shadowNext);

  let ms = +new Date() - startMs; // tmp: for perf
  console.log(`${numMods()}${outgoing ? ')' : ']'} @${idx} `
    + `${destination}: ${displayWord} -> ${displayNext}, ${shadow}: `
    + `${shadowWord} -> ${shadowNext} [${pos}] ${outgoing ? ms + 'ms' : ''}`);
}*/

/* selects an index to restore (from history) in displayed text */
function restore() {

  const { outgoing, destination, updateDelay } = state;

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

    console.log(`${numMods()}] @${idx} `
      + `${destination}: ${word} -> ${next} [${pos}]`);
  }
  else {
    console.warn('numMods:' + numMods(), repIds, repIds.map(i => sources[destination][i]));
  }

  updateState();

  state.loopId = setTimeout(ramble, updateDelay);
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
  clearTimeout(state.loopId);
  state.updating = false;
  state.reader && state.reader.stop();
  Array.from(document.querySelectorAll('.word')).forEach(e => {
    e.classList.remove('incoming')
    e.classList.remove('outgoing')
  });
}

/* update stats in debug panel */
function updateInfo() {
  const { updating, destination, outgoing, legs, maxLegs } = state;

  let data = 'Domain: ' + destination;
  data += '&nbsp;' + (updating ? (outgoing ? '⟶' : '⟵') : 'X');

  let displayWords = unspanify(); // compare visible text to each source text
  data += ` &nbsp;Leg: ${legs + 1}/${maxLegs}&nbsp; Affinity:`;
  data += ' Rural=' + affinity(sources.rural, displayWords, repIds);
  data += ' Urban=' + affinity(sources.urban, displayWords, repIds);

  data += ' &nbsp;Strict:'; // and now in strict mode
  data += ' Rural=' + affinity(sources.rural, displayWords, strictRepIds);
  data += ' Urban=' + affinity(sources.urban, displayWords, strictRepIds);

  domStats.innerHTML = data;
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

/*function similars(word, pos) {
  let sims;
  if (word in similarCache) {
    sims = similarCache[word]; // cache
  }
  else {
    let rhymes = RiTa.rhymes(word, { pos });
    let sounds = RiTa.soundsLike(word, { pos });
    let spells = RiTa.spellsLike(word, { pos });
    sims = [...rhymes, ...sounds, ...spells];
  }
 
  sims = sims.filter(next => isReplaceable(next)
    && !word.includes(next) && !next.includes(word)
    && !ignores.includes(next));
 
  if (sims.length > 1) {
    similarCache[word] = sims; // store in cache
    return sims;
  }
 
  console.warn('no similars for: "' + word + '"/' + pos
    + ((sources.rural.includes(word) || sources.rural.includes(word))
      ? ' *** [In Source]' : ''));
}*/

function isReplaceable(word) {
  return word.length >= minWordLength && !stops.includes(word);
}

/* compute id set for strict replacements */
function strictReplaceables() {
  return repIds.filter(idx =>
    sources.rural[idx] !== sources.urban[idx]);
}

function spanify(lines) {
  let wordIdx = 0;
  let html = lines.reduce((html, l, i) => {
    let line = '-';
    let ypos = l.bounds[1] - l.bounds[3] / 2;
    if (l.text) {
      let words = RiTa.tokenize(l.text);
      line = words.reduce((line, word, j) => {
        return line +
          `<span id="w${wordIdx++}" class="word">${word}</span>`
          + (j < words.length - 1 && RiTa.isPunct(words[j + 1]) ? '' : ' ');

      }, '');
    }
    return html + `<div id="l${i}"class="line" style="top: ${ypos}px;`
      + ` font-size:${l.fontSize}px;">${line}</div>`;
  }, '');
  domDisplay.innerHTML = html;

  let spans = document.getElementsByClassName("word"); // double-check
  if (spans.length != sources[state.destination].length) throw Error
    ('Invalid spanify: ' + spans.length + '!==' + sources[state.destination].length);

  return spans;
}

function unspanify() {
  return Array.from(document.getElementsByClassName
    ("word")).map(e => e.textContent);
}

function shadowTextName() {
  return state.destination === 'rural' ? 'urban' : 'rural';
}

function updateDOM(next, idx) {
  const ele = document.querySelector(`#w${idx}`);
  ele.textContent = next;
  ele.classList.add(state.outgoing ? 'outgoing' : 'incoming');
}

