// length of short/long walks (legs)
let walks = { short: 2, long: 16 };

// steps in each incoming/outgoing leg
let stepsPerLeg = 50;

// time between word replacements (ms)
let updateDelay = 500

// time on new text before updates (ms)
let preUpdateDelay = stepsPerLeg * updateDelay * 2;

// min/max CSS word-spacing (em)
let wordspaceMinMax = [-0.1, .5];

// leading for text display
let lineHeightScale = 1.28;

// min-length unless in similarOverrides
let minWordLength = 4;

// keyboard toggle options
let logging = true, verbose = false, highlights = false;

// set true to generate a new cache file
let refreshCache = false;

// progress bar color options
let redblue = ["rgb(0, 0, 0, 0.6)", "rgb(255, 97, 97, 0.6)", "rgba(178, 68, 68, 0.8)", "rgba(106, 166, 230, 0.6)", "rgba(54, 84, 116, 0.8)"];
let redgreen = ["rgb(0, 0, 0, 0.6)", "rgba(255, 97, 97, 0.6)", "rgba(178, 68, 68, 0.8)", "rgba(50, 187, 87, 0.6)", "rgb(30, 111, 52, 0.8)"];
let yellowblue = ["rgb(0, 0, 0, 0.6)", "rgba(0, 166, 233, 0.6)", "rgba(82, 158, 191, 0.8)", "rgba(245, 199, 0, 0.6)", "rgba(236, 192, 0, 0.8)"];
let progressBarColor = redblue;

// these override lookup values
let similarOverrides = {
  avoid: ['elude', 'escape', 'evade'],
  neighbors: ['brothers', 'brethren', 'fellows'],
  rending: ['ripping', 'cleaving', 'rupturing', 'splitting', 'severing'],
  inhuman: ['grievous', 'grim', 'hard', 'heavy', 'onerous', 'oppressive', 'rough', 'rugged', 'severe', 'austere', ' inclement', 'intemperate'],
  sometimes: ['occasionally', 'intermittently', 'periodically', 'recurrently', 'infrequently', 'rarely', 'irregularly', 'sporadically', 'variously'],
  adventure: ['experience', 'exploit', 'occasion', 'ordeal', 'venture', 'expedition', 'mission'],
  unfamiliar: ['unconventional', 'pioneering', 'unaccustomed', ' unprecedented'],
  coiled: ['twisted', 'twisting', 'curling', 'curving', 'serpentine', 'corkscrewed', 'jagged', 'meandering', 'spiraled'],
  particularly: ['specifically', 'generally', 'aptly'],
  unsettled: ['unresolved', 'uncertain', 'undecided', 'rootless'],
  dip: ['blip', 'chip', 'clip', 'drip', 'grip', 'microchip', 'quip', 'roundtrip', 'ship', 'slip', 'snip', 'strip', 'trip', 'whip'],
  set: ['caressed', 'digressed', 'forget', 'progressed', 'redressed', 'regressed', 'seat']
};

const stops = ["also", "over", "have", "this", "that", "just", "then", "under", "some", "their", "when", "these", "within", "after", "with", "there", "where", "while", "from", "whenever", "every", "usually", "other", "whereas"];
const ignores = ["jerkies", "nary", "outta", "copras", "accomplis", "scad", "silly", "saris", "coca", "durn", "geed", "goted", "denture", "wales", "terry"];
const sources = {
  rural: ['by', 'the', 'time', 'the', 'light', 'has', 'faded', ',', 'as', 'the', 'last', 'of', 'the', 'reddish', 'gold', 'illumination', 'comes', 'to', 'rest', ',', 'then', 'imperceptibly', 'spreads', 'out', 'over', 'the', 'moss', 'and', 'floor', 'of', 'the', 'woods', 'on', 'the', 'westerly', 'facing', 'lakeside', 'slopes', ',', 'you', 'or', 'I', 'will', 'have', 'set', 'out', 'on', 'several', 'of', 'yet', 'more', 'circuits', 'at', 'every', 'time', 'and', 'in', 'all', 'directions', ',', 'before', 'or', 'after', 'this', 'or', 'that', 'circadian', ',', 'usually', 'diurnal', ',', 'event', 'on', 'mildly', 'rambling', 'familiar', 'walks', ',', 'as', 'if', 'these', 'exertions', 'might', 'be', 'journeys', 'of', 'adventure', 'whereas', 'always', 'our', 'gestures', ',', 'guided', 'by', 'paths', ',', 'are', 'also', 'more', 'like', 'traces', 'of', 'universal', 'daily', 'ritual', ':', 'just', 'before', 'or', 'with', 'the', 'dawn', ',', 'after', 'a', 'morning', 'dip', ',', 'in', 'anticipation', 'of', 'breakfast', ',', 'whenever', 'the', 'fish', 'are', 'still', 'biting', ',', 'as', 'and', 'when', 'the', 'industrious', 'creatures', 'are', 'building', 'their', 'nests', 'and', 'shelters', ',', 'after', 'our', 'own', 'trials', 'of', 'work', ',', 'while', 'the', 'birds', 'still', 'sing', ',', 'in', 'quiet', 'moments', 'after', 'lunch', ',', 'most', 'particularly', 'after', 'dinner', ',', 'at', 'sunset', ',', 'to', 'escape', ',', 'to', 'avoid', 'being', 'found', ',', 'to', 'seem', 'to', 'be', 'lost', 'right', 'here', 'in', 'this', 'place', 'where', 'you', 'or', 'I', 'have', 'always', 'wanted', 'to', 'be', 'and', 'where', 'we', 'might', 'sometimes', 'now', 'or', 'then', 'have', 'discovered', 'some', 'singular', 'hidden', 'beauty', ',', 'or', 'one', 'another', ',', 'or', 'stumbled', 'and', 'injured', 'ourselves', 'beyond', 'the', 'hearing', 'and', 'call', 'of', 'other', 'voices', ',', 'or', 'met', 'with', 'other', 'danger', ',', 'animal', 'or', 'inhuman', ',', 'the', 'one', 'tearing', 'and', 'rending', 'and', 'opening', 'up', 'the', 'darkness', 'within', 'us', 'to', 'bleed', ',', 'yet', 'we', 'suppress', 'any', 'sound', 'that', 'might', 'have', 'expressed', 'the', 'terror', 'and', 'passion', 'and', 'horror', 'and', 'pain', 'so', 'that', 'I', 'or', 'you', 'may', 'continue', 'on', 'this', 'ramble', ',', 'this', 'before', 'or', 'after', 'walk', ',', 'and', 'still', 'return', ';', 'or', 'the', 'other', ',', 'the', 'quiet', 'evacuation', 'of', 'the', 'light', ',', 'the', 'way', ',', 'as', 'we', 'have', 'kept', 'on', 'walking', ',', 'it', 'falls', 'on', 'us', 'and', 'removes', 'us', 'from', 'existence', 'since', 'in', 'any', 'case', 'we', 'are', 'all', 'but', 'never', 'there', ',', 'always', 'merely', 'passing', 'through', 'and', 'by', 'and', 'over', 'the', 'moss', ',', 'under', 'the', 'limbs', 'of', 'the', 'evergreens', ',', 'beside', 'the', 'lake', ',', 'within', 'the', 'sound', 'of', 'its', 'lapping', 'waves', ',', 'annihilated', ',', 'gone', ',', 'quite', 'gone', ',', 'now', 'simply', 'gone', 'and', ',', 'in', 'being', 'or', 'walking', 'in', 'these', 'ways', ',', 'giving', 'up', 'all', 'living', 'light', 'for', 'settled', ',', 'hearth', 'held', 'fire', 'in', 'its', 'place', ',', 'returned'],
  urban: ['by', 'the', 'time', 'the', 'light', 'has', 'faded', ',', 'as', 'the', 'last', 'of', 'the', 'reddish', 'gold', 'illumination', 'comes', 'to', 'rest', ',', 'then', 'imperceptibly', 'spreads', 'out', 'over', 'the', 'dust', 'and', 'rubble', 'of', 'the', 'craters', 'on', 'the', 'easterly', 'facing', 'bankside', 'heights', ',', 'you', 'or', 'I', 'will', 'have', 'rushed', 'out', 'on', 'several', 'of', 'yet', 'more', 'circuits', 'at', 'every', 'time', 'and', 'in', 'all', 'directions', ',', 'before', 'or', 'after', 'this', 'or', 'that', 'violent', ',', 'usually', 'nocturnal', ',', 'event', 'on', 'desperately', 'hurried', 'unfamiliar', 'flights', ',', 'as', 'if', 'these', 'panics', 'might', 'be', 'movements', 'of', 'desire', 'whereas', 'always', 'our', 'gestures', ',', 'constrained', 'by', 'obstacles', ',', 'are', 'also', 'more', 'like', 'scars', 'of', 'universal', 'daily', 'terror', ':', 'just', 'before', 'or', 'with', 'the', 'dawn', ',', 'after', 'a', 'morning', 'prayer', ',', 'in', 'anticipation', 'of', 'hunger', ',', 'while', 'the', 'neighbors', 'are', 'still', 'breathing', ',', 'as', 'and', 'when', 'the', 'diligent', 'authorities', 'are', 'marshaling', 'their', 'cronies', 'and', 'thugs', ',', 'after', 'our', 'own', 'trials', 'of', 'loss', ',', 'while', 'the', 'mortars', 'still', 'fall', ',', 'in', 'quiet', 'moments', 'after', 'shock', ',', 'most', 'particularly', 'after', 'curfew', ',', 'at', 'sunset', ',', 'to', 'escape', ',', 'to', 'avoid', 'being', 'found', ',', 'to', 'seem', 'to', 'be', 'lost', 'right', 'here', 'in', 'this', 'place', 'where', 'you', 'or', 'I', 'have', 'always', 'wanted', 'to', 'be', 'and', 'where', 'we', 'might', 'sometimes', 'now', 'or', 'then', 'have', 'discovered', 'some', 'singular', 'hidden', 'beauty', ',', 'or', 'one', 'another', ',', 'or', 'stumbled', 'and', 'injured', 'ourselves', 'beyond', 'the', 'hearing', 'and', 'call', 'of', 'other', 'voices', ',', 'or', 'met', 'with', 'other', 'danger', ',', 'venal', 'or', 'military', ',', 'the', 'one', 'tearing', 'and', 'rending', 'and', 'opening', 'up', 'the', 'darkness', 'within', 'us', 'to', 'bleed', ',', 'yet', 'we', 'suppress', 'any', 'sound', 'that', 'might', 'have', 'expressed', 'the', 'terror', 'and', 'longing', 'and', 'horror', 'and', 'pain', 'so', 'that', 'I', 'or', 'you', 'may', 'continue', 'on', 'this', 'expedition', ',', 'this', 'before', 'or', 'after', 'assault', ',', 'and', 'still', 'return', ';', 'or', 'the', 'other', ',', 'the', 'quiet', 'evacuation', 'of', 'the', 'light', ',', 'the', 'way', ',', 'as', 'we', 'have', 'kept', 'on', 'struggling', ',', 'it', 'falls', 'on', 'us', 'and', 'removes', 'us', 'from', 'existence', 'since', 'in', 'any', 'case', 'we', 'are', 'all', 'but', 'never', 'there', ',', 'always', 'merely', 'passing', 'through', 'and', 'by', 'and', 'over', 'the', 'dust', ',', 'within', 'the', 'shadows', 'of', 'our', 'ruins', ',', 'beneath', 'the', 'wall', ',', 'within', 'the', 'razor', 'of', 'its', 'coiled', 'wire', ',', 'annihilated', ',', 'gone', ',', 'quite', 'gone', ',', 'now', 'simply', 'gone', 'and', ',', 'in', 'being', 'or', 'advancing', 'in', 'these', 'ways', ',', 'giving', 'up', 'all', 'living', 'light', 'for', 'unsettled', ',', 'heart', 'felt', 'fire', 'in', 'our', 'veins', ',', 'exiled'],
  pos: ['in', 'dt', 'nn', 'dt', 'jj', 'vbz', 'vbn', ',', 'in', 'dt', 'jj', 'in', 'dt', 'jj', 'jj', 'nn', 'vbz', 'to', 'nn', ',', 'rb', 'rb', 'nns', 'in', 'in', 'dt', 'nn', 'cc', 'nn', 'in', 'dt', 'nns', 'in', 'dt', 'rb', 'vbg', 'nn', 'vbz', ',', 'prp', 'cc', 'prp', 'md', 'vbp', 'vbn', 'in', 'in', 'jj', 'in', 'rb', 'jjr', 'nns', 'in', 'dt', 'nn', 'cc', 'in', 'dt', 'nns', ',', 'in', 'cc', 'in', 'dt', 'cc', 'in', 'nn', ',', 'rb', 'jj', ',', 'nn', 'in', 'rb', 'jj', 'jj', 'nns', ',', 'in', 'in', 'dt', 'nns', 'md', 'vb', 'nns', 'in', 'nn', 'in', 'rb', 'prp$', 'nns', ',', 'vbn', 'in', 'nns', ',', 'vbp', 'rb', 'jjr', 'vb', 'nns', 'in', 'jj', 'rb', 'jj', ':', 'rb', 'in', 'cc', 'in', 'dt', 'nn', ',', 'in', 'dt', 'nn', 'nn', ',', 'in', 'nn', 'in', 'nn', ',', 'wrb', 'dt', 'nns', 'vbp', 'rb', 'vbg', ',', 'in', 'cc', 'wrb', 'dt', 'jj', 'nns', 'vbp', 'vbg', 'prp$', 'nns', 'cc', 'vbz', ',', 'in', 'prp$', 'jj', 'nns', 'in', 'nn', ',', 'in', 'dt', 'nns', 'rb', 'vb', ',', 'in', 'jj', 'nns', 'in', 'nn', ',', 'rbs', 'rb', 'in', 'nn', ',', 'in', 'nn', ',', 'to', 'vb', ',', 'to', 'vb', 'vbg', 'vbd', ',', 'to', 'vb', 'to', 'vb', 'vbd', 'jj', 'rb', 'in', 'dt', 'nn', 'wrb', 'prp', 'cc', 'prp', 'vbp', 'rb', 'vbd', 'to', 'vb', 'cc', 'wrb', 'prp', 'md', 'rb', 'rb', 'cc', 'rb', 'vbp', 'vbn', 'dt', 'jj', 'vbn', 'nn', ',', 'cc', 'cd', 'dt', ',', 'cc', 'vbd', 'cc', 'vbn', 'prp', 'in', 'dt', 'vbg', 'cc', 'vb', 'in', 'jj', 'nns', ',', 'cc', 'vbd', 'in', 'jj', 'nn', ',', 'jj', 'cc', 'jj', ',', 'dt', 'cd', 'vbg', 'cc', 'nn', 'cc', 'vbg', 'in', 'dt', 'nn', 'in', 'prp', 'to', 'vb', ',', 'rb', 'prp', 'vbp', 'dt', 'jj', 'in', 'md', 'vbp', 'vbn', 'dt', 'nn', 'cc', 'nn', 'cc', 'nn', 'cc', 'nn', 'rb', 'in', 'prp', 'cc', 'prp', 'md', 'vb', 'in', 'dt', 'nn', ',', 'dt', 'in', 'cc', 'in', 'vb', ',', 'cc', 'rb', 'jj', ';', 'cc', 'dt', 'jj', ',', 'dt', 'jj', 'nn', 'in', 'dt', 'jj', ',', 'dt', 'nn', ',', 'in', 'prp', 'vbp', 'vbd', 'in', 'vbg', ',', 'prp', 'vbz', 'in', 'prp', 'cc', 'vbz', 'prp', 'in', 'nn', 'in', 'in', 'dt', 'nn', 'prp', 'vbp', 'dt', 'cc', 'rb', 'rb', ',', 'rb', 'rb', 'vbg', 'in', 'cc', 'in', 'cc', 'in', 'dt', 'nn', ',', 'in', 'dt', 'nns', 'in', 'dt', 'nns', ',', 'in', 'dt', 'nn', ',', 'in', 'dt', 'jj', 'in', 'prp$', 'nn', 'vbz', ',', 'vbd', ',', 'vbn', ',', 'rb', 'vbn', ',', 'rb', 'rb', 'vbn', 'cc', ',', 'in', 'vbg', 'cc', 'vbg', 'in', 'dt', 'nns', ',', 'vbg', 'in', 'dt', 'vbg', 'jj', 'in', 'vbd', ',', 'nn', 'vbn', 'nn', 'in', 'prp$', 'nn', ',', 'vbd']
};

const similarCache = (!refreshCache && typeof precache !== 'undefined') ? precache : {};
Object.entries(similarOverrides).forEach(([k, v]) => similarCache[k] = v); // override

if (false || refreshCache) { // DBUG
  walks.short = 2;
  walks.long = 12;
  stepsPerLeg = 4;
  updateDelay = 1;
  preUpdateDelay = 1;
  logging = true;
  //verbose = true;
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

let lex = RiTa.lexicon();
let repIds = replaceables();
let history = { rural: [], urban: [] };
let strictRepIds = strictReplaceables(repIds);
let domStats = document.querySelector('#stats');
let domDisplay = document.querySelector('#display');

let displaySims, shadowSims, cachedHtml, wordSpacing, spans;
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
let progressBars = setupProgress({ color: progressBarColor });

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

  if (!state.reader) { // first time

    if (similarCache) {
      console.info('[INFO] Using cached similars'
        + ` [${Object.keys(similarCache).length}]`);
    }
    else {
      console.info('[INFO] No cache, doing live lookups');
    }

    // load the word spans
    spans = document.getElementsByClassName("word");
    if (!state.stepMode) {

      // create/start the reader
      state.reader = new Reader(spans);
      log(`Delay: { preUpdate: ${preUpdateDelay / 1000}s,`
        + ` update: ${updateDelay}ms }`);
      log(`Pause for ${preUpdateDelay / 1000}s { domain: ${domain} }`);
      state.reader.pauseForThen(preUpdateDelay, update); // first-time
      state.reader.start();
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
          log(`Pause for ${preUpdateDelay / 1000}s { domain: ${state.domain} }`);
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

function findSimilars(word, pos) {

  let limit = -1;
  if (word in similarCache) {
    return similarCache[word]; // from cache
  }
  else {
    let rhymes = RiTa.rhymes(word, { pos, limit });
    let sounds = RiTa.soundsLike(word, { pos, limit });
    let spells = RiTa.spellsLike(word, { pos, limit });
    let sims = new Set([...rhymes, ...sounds, ...spells]);

    sims = [...sims].filter(sim =>
      !ignores.includes(sim)
      && !word.includes(sim)
      && !sim.includes(word)
      && isReplaceable(word));

    if (sims.length > 1) {
      similarCache[word] = sims; // to cache
      console.log('[CACHE] ' + word + '/' + pos + '('
        + Object.keys(similarCache).length + '): ' + sims);
      return sims;
    }
  }

  console.warn('no similars for: "' + word + '"/' + pos
    + ((sources.rural.includes(word) || sources.urban.includes(word))
      ? ' *** [In Source]' : ''));

  return [];
}

/* selects an index to replace (from similar lookup) in displayed text */
function replace() {

  let { domain, reader } = state;

  // do similar search
  let idx = RiTa.random(repIds.filter(id => !reader
    || !reader.selection().includes(sources[domain][id])));
  //idx = 4;

  let startMs = Date.now();
  let shadow = domain === 'rural' ? 'urban' : 'rural';
  let displayWord = sources[domain][idx];
  let shadowWord = sources[shadow][idx];
  let pos = sources.pos[idx];
  let delayMs = 1;

  let shadowSims = findSimilars(shadowWord, pos);
  let displaySims = findSimilars(displayWord, pos);

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

    if (logging && verbose) console.log(`${numMods()}) @${idx} ${displayWord}`
      + `->${displayNext}(${domain.substring(0, 1)}), ${shadowWord}->${shadowNext}`
      + `(${shadow.substring(0, 1)}) [${pos}] ${ms}ms`);
  }
  else {
    console.warn(`[FAIL] @${idx} `
      + `${displayWord}->${displaySims.length}, ${shadowWord}`
      + `->${shadowSims.length} [${pos}] in ${Date.now() - startMs} ms`);
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

  if (logging) console.log('[INFO] Stopped');

  updateInfo();

  if (refreshCache) { //  download cache file on stop()
    let size = Object.keys(similarCache).length;
    let data = `let precache=${JSON.stringify(similarCache, 0, 2)};`
    // data += `\nlet htmlSpans='${cachedHtml}';\n`;
    download(data, `preload-${size}.js`, 'text');
    console.log(`[INFO] wrote preload-${size}.js`);
  }
}

/* update stats in debug panel */
function updateInfo() {
  let { updating, domain, outgoing, legs, maxLegs } = state;

  let displayWords = unspanify(); // get words

  // compare visible text to each source text
  let affinities = [
    affinity(sources.urban, displayWords, repIds),        // progress bar #1
    affinity(sources.urban, displayWords, strictRepIds),  // progress bar #2
    affinity(sources.rural, displayWords, repIds),        // progress bar #3
    affinity(sources.rural, displayWords, strictRepIds),  // progress bar #4
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
    if (i) p.animate((updating ? affinities[i - 1] : 0) / 100,
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
      if (!repids.includes(idx)) throw Error('Invalid state[1]: ' + idx + '/' + word);
      count++;
    }
  });
  if (repids.length !== count) throw Error('Invalid state[2]');

  return repids;
}

function isReplaceable(word) {
  return (word.length >= minWordLength || similarCache[word])
    && !stops.includes(word);
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
  let { domain } = state;
  let scaleRatio = radius / initialMetrics.radius;
  let wordEle = document.querySelector(`#w${widx}`);
  let lineEle = wordEle.parentElement.parentElement;
  let lineIdx = parseInt((lineEle.id).slice(1));
  let originalW = initialMetrics.lineWidths[lineIdx] - (2 * padding);
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
  state.domain = (state.domain === 'rural') ? 'urban' : 'rural';
  log(`Domain switch -> '${state.domain}'`);
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
    console.log('[INFO] logging: ' + logging);
  }
  else if (e.code === 'KeyV') {
    verbose = !verbose;
    console.log('[INFO] verbose: ' + verbose);
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
    console.log('[INFO] stepMode: ' + stepMode);
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
  <p><svg class="rural-legend" style="fill: ${progressBarColor[4]}">
  <rect id="box" x="0" y="0" width="20" height="20"/>
  </svg> rural</p>
  <p><svg class="urban-legend" style="fill: ${progressBarColor[2]}">
  <rect id="box" x="0" y="0" width="20" height="20"/>
  </svg> urban</p>
  `;
  legendDiv.append(legendContent);
  legendDiv.style.fontSize = (initialMetrics.fontSize || 20.5) + 'px';
  document.querySelector("#display").append(legendDiv)
}

// Downloads data to a local file (tmp)
function download(data, filename, type = 'json') {
  if (typeof data !== 'string') data = JSON.stringify(data);
  let file = new Blob([data], { type });
  let a = document.createElement("a"),
    url = URL.createObjectURL(file);
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(function () {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 0);
}

function setupProgress(opts = {}) {
  const pbars = [];
  let progress = document.querySelectorAll(".progress");
  if (opts.color && opts.color.length !== progress.length) {
    throw Error('opts.color.length !== ' + progress.length);
  }
  progress.forEach((t, i) => {
    let pbar = new ProgressBar.Circle(t, {
      duration: opts.duration || 3000,
      // keep the absolute width same, see css
      strokeWidth: opts.strokeWidth || (i > 0 ? (98 / (92 + 2 * ((i - 1) % 2 == 0 ? 2 : 1))) : 0.15),
      easing: opts.easing || 'easeOut',
      trailColor: opts.trailColor || 'rgba(0,0,0,0)',
      color: opts.color && opts.color[i] ? opts.color[i] : "#ddd"
    });
    pbar.set(i > 0 ? 0 : 1);
    pbars.push(pbar);
  });
  return pbars;
}