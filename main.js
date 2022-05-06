// length of short/long walks (legs)
let walks = { short: 2, long: 16 };

// steps in each incoming/outgoing leg
let stepsPerLeg = 50;

// time between word replacements (ms)
let updateDelay = 500

// time on new text before updates (ms) 
let readDelay = stepsPerLeg * updateDelay * 2;

// min/max CSS word-spacing (em)
let wordspaceMinMax = [-0.1, .5];

// leading for text display
let lineHeightScale = 1.28;

// min-length unless in similarOverrides
let minWordLength = 4;

// recursive replace or old-style 
let recursiveReplace = true;

// width of visualization bar (% of div size)
let visBandWidth = 3;

// visualisation [ rural, urban, shared, free, initial ]
let visBandColors = [ '#9CC0E5', '#F59797', '#E7EBC5', '#C3ACB8', '#F3F3F3' ];
// let visBandColors = [ '#9CC0E5', '#F59797', '#C5C6C7', '#959DAD', '#F9F9F9' ];
// let visBandColors = [ '#9CC0E5', '#F59797', '#EDDEA4', '#526760', '#F9F9F9' ];
// let visBandColors = [ '#84ACCE', '#D16666', '#D7D9DB', '#B5AEAE', '#F9F9F9' ];
// let visBandColors = [ '#84ACCE', '#D16666', '#D7D9DB', '#FFF185', '#F9F9F9' ];

// hide legends toggle 
let hidingLegends = true;

// these override lookup values
let similarOverrides = {
  avoid: ['elude', 'escape', 'evade'],
  neighbors: ['brothers', 'brethren', 'fellows'],
  rending: ['ripping', 'cleaving', 'rupturing', 'splitting', 'severing'],
  inhuman: ['grievous', 'grim', 'hard', 'heavy', 'onerous', 'oppressive', 'rough', 'rugged', 'severe', 'austere', 'inclement', 'intemperate'],
  sometimes: ['occasionally', 'intermittently', 'periodically', 'recurrently', 'infrequently', 'rarely', 'irregularly', 'sporadically', 'variously'],
  adventure: ['experience', 'exploit', 'occasion', 'ordeal', 'venture', 'expedition', 'mission'],
  unfamiliar: ['unconventional', 'pioneering', 'unaccustomed', 'unprecedented'],
  coiled: ['twisted', 'twisting', 'curling', 'curving', 'serpentine', 'corkscrewed', 'jagged', 'meandering', 'spiraled'],
  particularly: ['specifically', 'generally', 'aptly'],
  unsettled: ['unresolved', 'uncertain', 'undecided', 'rootless'],
  dip: ['blip', 'chip', 'clip', 'drip', 'grip', 'microchip', 'quip', 'roundtrip', 'ship', 'slip', 'snip', 'strip', 'trip', 'whip'],
  set: ['caressed', 'digressed', 'forget', 'progressed', 'redressed', 'regressed', 'seat']
};

// words considered un-replaceable
let stops = ["also", "over", "have", "this", "that", "just", "then", "under", "some", "their", "when", "these", "within", "after", "with", "there", "where", "while", "from", "whenever", "every", "usually", "other", "whereas"];

// ignored when found as a similar
let ignores = ["jerkies", "trite", "nary", "outta", "copras", "accomplis", "scad", "silly", "saris", "coca", "durn", "geed", "goted", "denture", "wales", "terry"];

// set true to generate a new cache file
let refreshCache = false;

// keyboard toggle options
let logging = true, verbose = false, highlights = false;

let sources = {
  rural: ['by', 'the', 'time', 'the', 'light', 'has', 'faded', ',', 'as', 'the', 'last', 'of', 'the', 'reddish', 'gold', 'illumination', 'comes', 'to', 'rest', ',', 'then', 'imperceptibly', 'spreads', 'out', 'over', 'the', 'moss', 'and', 'floor', 'of', 'the', 'woods', 'on', 'the', 'westerly', 'facing', 'lakeside', 'slopes', ',', 'you', 'or', 'I', 'will', 'have', 'set', 'out', 'on', 'several', 'of', 'yet', 'more', 'circuits', 'at', 'every', 'time', 'and', 'in', 'all', 'directions', ',', 'before', 'or', 'after', 'this', 'or', 'that', 'circadian', ',', 'usually', 'diurnal', ',', 'event', 'on', 'mildly', 'rambling', 'familiar', 'walks', ',', 'as', 'if', 'these', 'exertions', 'might', 'be', 'journeys', 'of', 'adventure', 'whereas', 'always', 'our', 'gestures', ',', 'guided', 'by', 'paths', ',', 'are', 'also', 'more', 'like', 'traces', 'of', 'universal', 'daily', 'ritual', ':', 'just', 'before', 'or', 'with', 'the', 'dawn', ',', 'after', 'a', 'morning', 'dip', ',', 'in', 'anticipation', 'of', 'breakfast', ',', 'whenever', 'the', 'fish', 'are', 'still', 'biting', ',', 'as', 'and', 'when', 'the', 'industrious', 'creatures', 'are', 'building', 'their', 'nests', 'and', 'shelters', ',', 'after', 'our', 'own', 'trials', 'of', 'work', ',', 'while', 'the', 'birds', 'still', 'sing', ',', 'in', 'quiet', 'moments', 'after', 'lunch', ',', 'most', 'particularly', 'after', 'dinner', ',', 'at', 'sunset', ',', 'to', 'escape', ',', 'to', 'avoid', 'being', 'found', ',', 'to', 'seem', 'to', 'be', 'lost', 'right', 'here', 'in', 'this', 'place', 'where', 'you', 'or', 'I', 'have', 'always', 'wanted', 'to', 'be', 'and', 'where', 'we', 'might', 'sometimes', 'now', 'or', 'then', 'have', 'discovered', 'some', 'singular', 'hidden', 'beauty', ',', 'or', 'one', 'another', ',', 'or', 'stumbled', 'and', 'injured', 'ourselves', 'beyond', 'the', 'hearing', 'and', 'call', 'of', 'other', 'voices', ',', 'or', 'met', 'with', 'other', 'danger', ',', 'animal', 'or', 'inhuman', ',', 'the', 'one', 'tearing', 'and', 'rending', 'and', 'opening', 'up', 'the', 'darkness', 'within', 'us', 'to', 'bleed', ',', 'yet', 'we', 'suppress', 'any', 'sound', 'that', 'might', 'have', 'expressed', 'the', 'terror', 'and', 'passion', 'and', 'horror', 'and', 'pain', 'so', 'that', 'I', 'or', 'you', 'may', 'continue', 'on', 'this', 'ramble', ',', 'this', 'before', 'or', 'after', 'walk', ',', 'and', 'still', 'return', ';', 'or', 'the', 'other', ',', 'the', 'quiet', 'evacuation', 'of', 'the', 'light', ',', 'the', 'way', ',', 'as', 'we', 'have', 'kept', 'on', 'walking', ',', 'it', 'falls', 'on', 'us', 'and', 'removes', 'us', 'from', 'existence', 'since', 'in', 'any', 'case', 'we', 'are', 'all', 'but', 'never', 'there', ',', 'always', 'merely', 'passing', 'through', 'and', 'by', 'and', 'over', 'the', 'moss', ',', 'under', 'the', 'limbs', 'of', 'the', 'evergreens', ',', 'beside', 'the', 'lake', ',', 'within', 'the', 'sound', 'of', 'its', 'lapping', 'waves', ',', 'annihilated', ',', 'gone', ',', 'quite', 'gone', ',', 'now', 'simply', 'gone', 'and', ',', 'in', 'being', 'or', 'walking', 'in', 'these', 'ways', ',', 'giving', 'up', 'all', 'living', 'light', 'for', 'settled', ',', 'hearth', 'held', 'fire', 'in', 'its', 'place', ',', 'returned'],
  urban: ['by', 'the', 'time', 'the', 'light', 'has', 'faded', ',', 'as', 'the', 'last', 'of', 'the', 'reddish', 'gold', 'illumination', 'comes', 'to', 'rest', ',', 'then', 'imperceptibly', 'spreads', 'out', 'over', 'the', 'dust', 'and', 'rubble', 'of', 'the', 'craters', 'on', 'the', 'easterly', 'facing', 'bankside', 'heights', ',', 'you', 'or', 'I', 'will', 'have', 'rushed', 'out', 'on', 'several', 'of', 'yet', 'more', 'circuits', 'at', 'every', 'time', 'and', 'in', 'all', 'directions', ',', 'before', 'or', 'after', 'this', 'or', 'that', 'violent', ',', 'usually', 'nocturnal', ',', 'event', 'on', 'desperately', 'hurried', 'unfamiliar', 'flights', ',', 'as', 'if', 'these', 'panics', 'might', 'be', 'movements', 'of', 'desire', 'whereas', 'always', 'our', 'gestures', ',', 'constrained', 'by', 'obstacles', ',', 'are', 'also', 'more', 'like', 'scars', 'of', 'universal', 'daily', 'terror', ':', 'just', 'before', 'or', 'with', 'the', 'dawn', ',', 'after', 'a', 'morning', 'prayer', ',', 'in', 'anticipation', 'of', 'hunger', ',', 'while', 'the', 'neighbors', 'are', 'still', 'breathing', ',', 'as', 'and', 'when', 'the', 'diligent', 'authorities', 'are', 'marshaling', 'their', 'cronies', 'and', 'thugs', ',', 'after', 'our', 'own', 'trials', 'of', 'loss', ',', 'while', 'the', 'mortars', 'still', 'fall', ',', 'in', 'quiet', 'moments', 'after', 'shock', ',', 'most', 'particularly', 'after', 'curfew', ',', 'at', 'sunset', ',', 'to', 'escape', ',', 'to', 'avoid', 'being', 'found', ',', 'to', 'seem', 'to', 'be', 'lost', 'right', 'here', 'in', 'this', 'place', 'where', 'you', 'or', 'I', 'have', 'always', 'wanted', 'to', 'be', 'and', 'where', 'we', 'might', 'sometimes', 'now', 'or', 'then', 'have', 'discovered', 'some', 'singular', 'hidden', 'beauty', ',', 'or', 'one', 'another', ',', 'or', 'stumbled', 'and', 'injured', 'ourselves', 'beyond', 'the', 'hearing', 'and', 'call', 'of', 'other', 'voices', ',', 'or', 'met', 'with', 'other', 'danger', ',', 'venal', 'or', 'military', ',', 'the', 'one', 'tearing', 'and', 'rending', 'and', 'opening', 'up', 'the', 'darkness', 'within', 'us', 'to', 'bleed', ',', 'yet', 'we', 'suppress', 'any', 'sound', 'that', 'might', 'have', 'expressed', 'the', 'terror', 'and', 'longing', 'and', 'horror', 'and', 'pain', 'so', 'that', 'I', 'or', 'you', 'may', 'continue', 'on', 'this', 'expedition', ',', 'this', 'before', 'or', 'after', 'assault', ',', 'and', 'still', 'return', ';', 'or', 'the', 'other', ',', 'the', 'quiet', 'evacuation', 'of', 'the', 'light', ',', 'the', 'way', ',', 'as', 'we', 'have', 'kept', 'on', 'struggling', ',', 'it', 'falls', 'on', 'us', 'and', 'removes', 'us', 'from', 'existence', 'since', 'in', 'any', 'case', 'we', 'are', 'all', 'but', 'never', 'there', ',', 'always', 'merely', 'passing', 'through', 'and', 'by', 'and', 'over', 'the', 'dust', ',', 'within', 'the', 'shadows', 'of', 'our', 'ruins', ',', 'beneath', 'the', 'wall', ',', 'within', 'the', 'razor', 'of', 'its', 'coiled', 'wire', ',', 'annihilated', ',', 'gone', ',', 'quite', 'gone', ',', 'now', 'simply', 'gone', 'and', ',', 'in', 'being', 'or', 'advancing', 'in', 'these', 'ways', ',', 'giving', 'up', 'all', 'living', 'light', 'for', 'unsettled', ',', 'heart', 'felt', 'fire', 'in', 'our', 'veins', ',', 'exiled'],
  pos: ['in', 'dt', 'nn', 'dt', 'jj', 'vbz', 'vbn', ',', 'in', 'dt', 'jj', 'in', 'dt', 'jj', 'jj', 'nn', 'vbz', 'to', 'nn', ',', 'rb', 'rb', 'nns', 'in', 'in', 'dt', 'nn', 'cc', 'nn', 'in', 'dt', 'nns', 'in', 'dt', 'rb', 'vbg', 'nn', 'vbz', ',', 'prp', 'cc', 'prp', 'md', 'vbp', 'vbn', 'in', 'in', 'jj', 'in', 'rb', 'jjr', 'nns', 'in', 'dt', 'nn', 'cc', 'in', 'dt', 'nns', ',', 'in', 'cc', 'in', 'dt', 'cc', 'in', 'nn', ',', 'rb', 'jj', ',', 'nn', 'in', 'rb', 'jj', 'jj', 'nns', ',', 'in', 'in', 'dt', 'nns', 'md', 'vb', 'nns', 'in', 'nn', 'in', 'rb', 'prp$', 'nns', ',', 'vbn', 'in', 'nns', ',', 'vbp', 'rb', 'jjr', 'vb', 'nns', 'in', 'jj', 'rb', 'jj', ':', 'rb', 'in', 'cc', 'in', 'dt', 'nn', ',', 'in', 'dt', 'nn', 'nn', ',', 'in', 'nn', 'in', 'nn', ',', 'wrb', 'dt', 'nns', 'vbp', 'rb', 'vbg', ',', 'in', 'cc', 'wrb', 'dt', 'jj', 'nns', 'vbp', 'vbg', 'prp$', 'nns', 'cc', 'vbz', ',', 'in', 'prp$', 'jj', 'nns', 'in', 'nn', ',', 'in', 'dt', 'nns', 'rb', 'vb', ',', 'in', 'jj', 'nns', 'in', 'nn', ',', 'rbs', 'rb', 'in', 'nn', ',', 'in', 'nn', ',', 'to', 'vb', ',', 'to', 'vb', 'vbg', 'vbd', ',', 'to', 'vb', 'to', 'vb', 'vbd', 'jj', 'rb', 'in', 'dt', 'nn', 'wrb', 'prp', 'cc', 'prp', 'vbp', 'rb', 'vbd', 'to', 'vb', 'cc', 'wrb', 'prp', 'md', 'rb', 'rb', 'cc', 'rb', 'vbp', 'vbn', 'dt', 'jj', 'vbn', 'nn', ',', 'cc', 'cd', 'dt', ',', 'cc', 'vbd', 'cc', 'vbn', 'prp', 'in', 'dt', 'vbg', 'cc', 'vb', 'in', 'jj', 'nns', ',', 'cc', 'vbd', 'in', 'jj', 'nn', ',', 'jj', 'cc', 'jj', ',', 'dt', 'cd', 'vbg', 'cc', 'nn', 'cc', 'vbg', 'in', 'dt', 'nn', 'in', 'prp', 'to', 'vb', ',', 'rb', 'prp', 'vbp', 'dt', 'jj', 'in', 'md', 'vbp', 'vbn', 'dt', 'nn', 'cc', 'nn', 'cc', 'nn', 'cc', 'nn', 'rb', 'in', 'prp', 'cc', 'prp', 'md', 'vb', 'in', 'dt', 'nn', ',', 'dt', 'in', 'cc', 'in', 'vb', ',', 'cc', 'rb', 'jj', ';', 'cc', 'dt', 'jj', ',', 'dt', 'jj', 'nn', 'in', 'dt', 'jj', ',', 'dt', 'nn', ',', 'in', 'prp', 'vbp', 'vbd', 'in', 'vbg', ',', 'prp', 'vbz', 'in', 'prp', 'cc', 'vbz', 'prp', 'in', 'nn', 'in', 'in', 'dt', 'nn', 'prp', 'vbp', 'dt', 'cc', 'rb', 'rb', ',', 'rb', 'rb', 'vbg', 'in', 'cc', 'in', 'cc', 'in', 'dt', 'nn', ',', 'in', 'dt', 'nns', 'in', 'dt', 'nns', ',', 'in', 'dt', 'nn', ',', 'in', 'dt', 'jj', 'in', 'prp$', 'nn', 'vbz', ',', 'vbd', ',', 'vbn', ',', 'rb', 'vbn', ',', 'rb', 'rb', 'vbn', 'cc', ',', 'in', 'vbg', 'cc', 'vbg', 'in', 'dt', 'nns', ',', 'vbg', 'in', 'dt', 'vbg', 'jj', 'in', 'vbd', ',', 'nn', 'vbn', 'nn', 'in', 'prp$', 'nn', ',', 'vbd']
};

let state = {
  maxLegs: walks.short,
  domain: 'rural',
  outgoing: true,
  stepMode: false,
  updating: false,
  minWordLength,
  loopId: 0,
  legs: 0,
  ignores,
  sources,
  stops,
};

let lex = RiTa.lexicon();
let repIds = replaceables();
let history = { rural: [], urban: [] };
let strictRepIds = strictReplaceables(repIds);
let domDisplay = document.querySelector('#display');

let reader, worker, wordSpacing, spans, domLegend, domStats;
let displayBounds = domDisplay.getBoundingClientRect();
let font = window.getComputedStyle(domDisplay).fontFamily;
let cpadding = window.getComputedStyle(domDisplay).padding;
let padfloat = parseFloat(cpadding.replace('px', ''));
let padding = (!padfloat || padfloat === NaN) ? 30 : padfloat;
let radius = displayBounds.width / 2;

// setup history and handlers
Object.keys(history).map(k => sources[k].map((w, i) => history[k][i] = [w]));
document.addEventListener('keyup', keyhandler);
console.log('[INFO] Keys -> (h)ighlight (i)nfo (s)tep (e)nd\n'
  + ' '.repeat(15) + '(l)og (v)erbose (r)ecursive un(d)elay');
window.onresize = () => {
  displayBounds = domDisplay.getBoundingClientRect();
  radius = displayBounds.width / 2;
  scaleToFit();
}

// create progress bars
let progressBars = createProgressBars({ color: visBandColors, trailColor: visBandColors[4], strokeWidth: visBandWidth });

// layout lines in circular display
let initMetrics = { radius: Math.max(radius, 450) };
let offset = {
  x: displayBounds.x + initMetrics.radius,
  y: displayBounds.y + initMetrics.radius
};
let opts = { offset, font, lineHeightScale, padding };
let lines = layoutCircular(sources[state.domain], initMetrics.radius, opts);
initMetrics.lineWidths = lineateCircular(domDisplay, initMetrics.radius, lines);
initMetrics.fontSize = lines[0].fontSize;

if (1) { // DEBUG-ONLY
  // walks.short = 2;
  // walks.long = 4;
  // updateDelay = 500;
  // stepsPerLeg = 4;
  // readDelay = 500;
  logging = true;
  //keyhandler({ code: 'KeyI' });
  //setTimeout(() => keyhandler({ code: 'KeyD' }, 300));
}
createLegend();
scaleToFit();
ramble();// go

/////////////////////////////////////////////////////////

function ramble() {

  let { updating, outgoing, maxLegs } = state;

  if (maxLegs / 2 !== Math.floor(maxLegs / 2)) {
    throw Error('all walks must be even length');
  }

  if (!reader) { // first time

    if (!worker) {
      worker = new Worker("similars.js");
      worker.postMessage({ event: 'init', data: { overrides: similarOverrides } })
      worker.onmessage = postReplace;
    }

    // load the word spans
    spans = document.getElementsByClassName("word");
    if (!state.stepMode) {

      log(`Opts { read: ${readDelay}ms, update: ${updateDelay}ms }`);

      // create/start the reader
      reader = new Reader(spans);
      reader.pauseThen(update, readDelay); // first-time
      reader.start();
    }
  }

  if (updating) return outgoing ? replace() : restore();
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
          log(`Pause for ${readDelay / 1000}s { domain: ${state.domain} }`);
          return reader.pauseThen(update, readDelay);
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

/* selects an index to replace (from similar lookup) in displayed text */
function replace() {
  let { domain } = state;
  let shadow = shadowTextName();
  let idx = RiTa.random(repIds.filter(id => !reader
    || !reader.selection().includes(sources[domain][id])));
  let dword = recursiveReplace ? last(history[domain][idx]) : sources[domain][idx];
  let sword = recursiveReplace ? last(history[shadow][idx]) : sources[shadow][idx];
  let data = { idx, dword, sword, state, timestamp: Date.now() };
  worker.postMessage({ event: 'lookup', data }); // do similar search
}

function postReplace(e) {

  let { idx, dword, sword, dsims, ssims, timestamp } = e.data;
  let { domain, stepMode } = state;
  if (idx < 0) {
    // TODO: write cache
    return;
  }

  let shadow = shadowTextName();
  let delayMs, pos = sources.pos[idx];
  if (dsims.length && ssims.length) {

    // pick a random similar to replace in display text
    let dnext = lengthAwareRandom(idx, dword, dsims);
    history[domain][idx].push(dnext);
    updateDOM(dnext, idx);

    let snext = lengthAwareRandom(idx, sword, ssims);
    history[shadow][idx].push(snext);
    updateState();

    let ms = Date.now() - timestamp;
    delayMs = Math.max(1, updateDelay - ms);
    if ((logging && verbose) || stepMode) console.log(`${numMods()}) @${idx} `
      + `${dword}->${dnext}(${domain.substring(0, 1)}), `
      + `${sword}->${snext}(${shadow.substring(0, 1)}) `
      + `[${pos}] elapsed=${ms} delay=${delayMs}`);
    //console.log(`${numMods()}) ${Date.now()-ts}ms`);
    //ts = Date.now(); // timing
  }
  else {
    console.warn(`[FAIL] @${idx} `
      + `${dword}->${dsims.length}, `
      + `${sword}->${ssims.length} [${pos}]`);
  }

  if (!stepMode) state.loopId = setTimeout(ramble, delayMs);
}


/* selects an index to restore (from history) in displayed text */
function restore() {

  let { domain, stepMode } = state;

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

    if ((logging && verbose) || stepMode) console.log(`${numMods()}] `
      + `@${idx} ${domain}: ${word} -> ${next} [${pos}]`);

    //console.log(`${numMods()}] ${Date.now()-ts}ms`);
    //ts = Date.now(); // perf. timing
  }
  else {
    let id = repIds.find(idx => history[domain][idx].length > 1);
    let word = sources[domain][id], hist = history[domain][id];
    console.warn('[WARN] Invalid-state, numMods:'
      + numMods() + ' idx=' + id + '/' + word + ' history=', hist);
    return stop();
  }

  if (updateState() && !state.stepMode) {
    state.loopId = setTimeout(ramble, updateDelay);
  }
}

/* total number of replacements made in display text */
function numMods() {
  return repIds.reduce((total, idx) =>
    total + history[state.domain][idx].length - 1, 0);
}

/* stop rambler and reader  */
function stop() {

  clearTimeout(state.loopId);
  state.updating = false;
  if (reader) reader.stop();

  setTimeout(_ =>
    Array.from(spans).forEach(e => {
      e.classList.remove('incoming');
      e.classList.remove('outgoing');
    }), 1000);

  domLegend.style.display = 'none';

  updateInfo();

  worker.postMessage({ event: 'getcache', data: {} });
}

function postStop(args) {
  let { cache } = args;
  if (refreshCache) { //  download cache file on stop()
    let size = Object.keys(cache).length;
    let data = `let cache=${JSON.stringify(cache, 0, 2)};`
    // data += `\nlet htmlSpans='${cachedHtml}';\n`;
    download(data, `cache-${size}.js`, 'text');
    console.log(`[INFO] wrote cache-${size}.js`);
  }
}

function replaceables() { // [] of replaceable indexes
  let repids = [], count = 0;
  sources.rural.forEach((word, idx) => {
    if (isReplaceable(word)) repids.push(idx);
  });
  sources.urban.forEach((word, idx) => {
    if (isReplaceable(word)) {
      if (!repids.includes(idx)) throw Error('Invalid state[1]: ' + idx + '/' + word);
      count++;
    }
  });
  if (repids.length !== count) throw Error('Invalid state[2]');
  return repids;
}

function isReplaceable(word) {
  return (word.length >= minWordLength || similarOverrides[word])
    && !stops.includes(word);
}

/* compute id set for strict replacements */
function strictReplaceables() {
  return repIds.filter(idx =>
    sources.rural[idx] !== sources.urban[idx]);
}

function trunc(arr, len = 100) {
  arr = Array.isArray(arr) ? (JSON.stringify(arr)
    .replace(/[""\[\]]/g, '')
    .replace(/,/g, ', '))
    : arr;
  if (arr.length <= len) return arr;
  return arr.substring(0, len) + '...';
}

function unspanify() {
  return Array.from(document.getElementsByClassName
    ("word")).map(e => e.textContent);
}

function lengthAwareRandom(widx, word, options) {
  let { domain } = state;
  let scaleRatio = radius / initMetrics.radius;
  let wordEle = document.querySelector(`#w${widx}`);
  let lineEle = wordEle.parentElement.parentElement;
  let lineIdx = parseInt((lineEle.id).slice(1));
  let originalW = initMetrics.lineWidths[lineIdx] - (2 * padding);
  let currentW = lineEle.firstChild.getBoundingClientRect().width / scaleRatio;
  let filter, msg = '', wordW = measureWidthForLine(word, lineIdx);
  let hstack = history[domain][widx];
  let last = hstack[hstack.length - 1];
  if (originalW > currentW) {
    filter = (o) => o !== last && measureWidthForLine(o, lineIdx) > wordW;
    msg += '   need longer';
  }
  else {
    filter = (o, i) => o !== last && measureWidthForLine(o, lineIdx) < wordW;
    // console.log('  ', i, `orig: ${word}(${Math.round(wordW)})`
    //   + ` check: ${o} (${Math.round(ow)})`);
    msg += '    need shorter';
  }

  let choices = options.filter(filter);
  if (!choices || !choices.length) {
    choices = options;
    msg += ' [random]';
  }

  let choice = RiTa.random(choices);
  //console.log(msg + ', replaced ' + word + `(${Math.round(wordW)})`
  // + ' with ' + choice + `(${Math.round(measureWidthForLine(choice, lineIdx))})`
  // + `,\n  h=${history[domain][widx]}, last=${last})`;

  return choice;
}

function swapDomain() {
  state.legs = 0;
  state.domain = shadowTextName();
  log(`Domain switch -> '${state.domain}'`);
  if (state.domain === 'rural') {
    document.getElementById("progress2").classList.add('shared-rural');
    document.getElementById("progress2").classList.remove('shared-urban');
  } else {
    document.getElementById("progress2").classList.remove('shared-rural');
    document.getElementById("progress2").classList.add('shared-urban');
  }
}

function shadowTextName(domain) {
  domain = domain || state.domain;
  return domain === 'rural' ? 'urban' : 'rural';
}

function updateDOM(next, idx) {
  let { outgoing } = state;
  let word = document.querySelector(`#w${idx}`);
  let line = word.parentElement.parentElement;
  word.textContent = next;
  if (highlights) word.classList.add(outgoing ? 'outgoing' : 'incoming');
  wordSpacing = adjustWordSpace(line,
    initMetrics, wordspaceMinMax, padding, radius);
}

function update(updating = true) {
  let { domain, legs, maxLegs } = state;
  log(`Start: outgoing in '${domain}' on leg ${legs + 1}/${maxLegs}`);
  state.updating = updating;
  state.maxLegs = walks.short;
  domLegend.style.display = 'block';
  ramble();
}

function log(msg) {
  if (!logging) return;
  console.log('[INFO] ' + msg);
}

function scaleToFit() {
  document.querySelector('#text-display').style.transform
    = "scale(" + radius / initMetrics.radius + ")";
  document.querySelector('#legend').style.transform
    = "scale(" + radius / initMetrics.radius + ")";
  document.querySelector("#display-container").style.marginTop
    = 0.1 * radius + "px";
}

function last(arr) {
  if (arr && arr.length) return arr[arr.length - 1];
}

