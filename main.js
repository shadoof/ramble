// length of short/long walks (legs)
let walks = { short: 2, long: 16 };

// steps in each incoming/outgoing leg
let stepsPerLeg = 50;

// time between word replacements (ms)
let updateDelay = 800

// time on new text before updates (ms) 
let readDelay = stepsPerLeg * updateDelay * 2;

// min/max/start CSS word-spacing (em)
let minWordSpace = -0.1, maxWordSpace = 0.5, initialWordSpace = 0.1;

// leading for text display
let lineHeightScale = 1.28;

// min-length unless in similarOverrides
let minWordLength = 4;

// width of visualization bar (% of div size)
let visBandWidth = 3;

// adjust word-spacing for initial text circle
let adjustInitialWordspacing = true;

// visualisation [ rural, urban, shared, free, initial ]
let visBandColors = ['#9CC0E5', '#F59797', '#E7EBC5', '#C3ACB8', '#F3F3F3'];
// let visBandColors = [ '#9CC0E5', '#F59797', '#C5C6C7', '#959DAD', '#F9F9F9' ];
// let visBandColors = [ '#9CC0E5', '#F59797', '#EDDEA4', '#526760', '#F9F9F9' ];
// let visBandColors = [ '#84ACCE', '#D16666', '#D7D9DB', '#B5AEAE', '#F9F9F9' ];
// let visBandColors = [ '#84ACCE', '#D16666', '#D7D9DB', '#FFF185', '#F9F9F9' ];

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
  set: ['caressed', 'digressed', 'forget', 'progressed', 'redressed', 'regressed', 'seat'],
  sunset: ['dawning', 'daybreak', 'daylight', 'morning', 'sunrise', 'sunup', 'daytime', 'forenoon', 'crepuscule', 'dusk', 'evening', 'gloaming', 'night', 'nightfall', 'sundown', 'twilight', 'subset', 'inset', 'alphabet', 'mindset', 'quintet'],
};

// words considered un-replaceable
let stops = ["also", "over", "have", "this", "that", "just", "then", "under", "some", "their", "when", "these", "within", "after", "with", "there", "where", "while", "from", "whenever", "every", "usually", "other", "whereas"];

// ignored when found as a similar
let ignores = ["jerkies", "trite", "nary", "outta", "copras", "accomplis", "scad", "silly", "saris", "coca", "durn", "geed", "goted", "denture", "wales", "terry"];

// set true to generate a new cache file
let refreshCache = false;

// keyboard toggle options
let logging = true, verbose = false, highlights = false, hideLegend = true, highlightWs = false;

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
let repids = replaceables();
let history = { rural: [], urban: [] };
let similarConstraints = Array(replaceables.length).fill(0);

let domStats = document.querySelector('#stats');
let domDisplay = document.querySelector('#display');
let measureDiv = document.querySelector('#measure-line');
let displayContainer = document.querySelector("#display-container");
let measureCanvas = document.querySelector("#measure-ctx");
let measureCtx = measureCanvas.getContext('2d');
let displayBounds = domDisplay.getBoundingClientRect();

let reader, worker, spans, initialMetrics, scaleRatio;
let fontFamily = window.getComputedStyle(domDisplay).fontFamily;
let cpadding = window.getComputedStyle(domDisplay).padding;
let padfloat = parseFloat(cpadding.replace('px', ''));
let padding = (padfloat && padfloat !== NaN) ? padfloat : 50;
let radius = displayBounds.width / 2, dbug = 1;

if (dbug) {
  highlightWs = true;
  highlights = true;
  logging = verbose = true;
  readDelay = 1;
}
doLayout();
ramble();// go

/////////////////////////////////////////////////////////

// look at each similar, ignore those that, with min or max word-spacing
// would result in line more than 5% off the target-width
function contextualRandom(wordIdx, oldWord, similars, opts) {

  let dbug = false;
  let isShadow = opts && opts.isShadow;
  if (isShadow) return RiTa.random(similars);

  if (dbug) updateDelay = 10000000;

  let wordEle = document.querySelector(`#w${wordIdx}`);
  let lineEle = wordEle.parentElement.parentElement;
  let lineIdx = parseInt((lineEle.id).slice(1));
  let text = lineEle.textContent;

  // find target width and min/max allowable
  let targetWidth = initialMetrics.lineWidths[lineIdx];
  let minAllowedWidth = targetWidth * .95;
  let maxAllowedWidth = targetWidth * 1.05;

  // get current line and word widths
  let { font, wordSpacing } = window.getComputedStyle(lineEle)
  let currentLineWidth = measureWidthCtx(text, font, wordSpacing);

  if (dbug) console.log('lineIdx=' + lineIdx + ' text: "' + text
    + '"\nminAllowed=' + minAllowedWidth + ' target=' + targetWidth
    + ' current=' + currentLineWidth + ' maxAllowed=' + maxAllowedWidth);

  if (currentLineWidth > maxAllowedWidth) throw Error
    ('original(#' + lineIdx + ') too long: ' + currentLineWidth);

  if (currentLineWidth < minAllowedWidth) throw Error
    ('original(#' + lineIdx + ') too short: ' + currentLineWidth);

  //console.time('Execution Time Ctx');
  similars.forEach(sim => {
    let res = estWidthChangePercentage(sim, wordIdx, ['max', 'min', 'opt']);
    if (dbug) console.log("@" + lineIdx + '.' + wordIdx + " word: "
      + oldWord + ", option: " + sim + ", result: ", res);
  });
  //console.timeEnd('Execution Time Ctx');

  if (0) {
    console.time('Execution Time Dom');
    similars.forEach(sim => {
      let res = widthChangePercentage(sim, wordIdx, ['max', 'min', 'opt']);
      if (dbug) console.log("@" + lineIdx + '.' + wordIdx + " word: "
        + oldWord + ", option: " + sim + ", result-DOM: ", res);
    })
    console.timeEnd('Execution Time Dom');
  }

  return RiTa.random(similars);
}

function doLayout() {

  // setup history and handlers
  Object.keys(history).map(k => sources[k].map((w, i) => history[k][i] = [w]));
  document.addEventListener('keyup', keyhandler);
  console.log('[INFO] Keys -> (h)ighlight (i)nfo (s)tep (l)og (v)erbose\n'
    + ' '.repeat(15) + 'un(d)elay (c)olor-key (w)s-classes (e)nd');

  // init resize handler
  window.onresize = () => {
    displayBounds = domDisplay.getBoundingClientRect();
    radius = displayBounds.width / 2;
    scaleToFit();
  }

  // layout lines in circular display
  let initRadius = Math.max(radius, 450);
  let offset = { x: displayBounds.x + initRadius, y: displayBounds.y + initRadius };
  let opts = { offset, fontFamily, lineHeightScale, wordSpace: initialWordSpace, padding };
  let lines = layoutCircularLines(sources[state.domain], initRadius, opts);
  initialMetrics = createCircularDOM(domDisplay, initRadius, lines);

  // create progress bars
  progressBars = createProgressBars({
    color: visBandColors,
    trailColor: visBandColors[4],
    strokeWidth: visBandWidth
  });

  adjustAllWordSpacing(adjustInitialWordspacing);
  //initialMetrics.contentWidths = getInitialContentWidths(lines.length);
  //initialMetrics.contentWidthsCtx = getInitialContentWidths(lines.length, true);
  scaleToFit(); // size to window 
}

function adjustAllWordSpacing(isDynamic) {
  document.querySelectorAll('.line').forEach((l, i) => {
    if (isDynamic) {
      adjustWordSpace(l, initialMetrics.lineWidths[i])
    }
    else {
      ["max-word-spacing", "min-word-spacing"].forEach
        (cl => l.firstChild && l.firstChild.classList.remove(cl));
    }
  });
}

function ramble() {

  let { updating, outgoing, maxLegs } = state;

  if (maxLegs / 2 !== Math.floor(maxLegs / 2)) {
    throw Error('all walks must be even length');
  }

  if (!reader) { // first time

    log(`opts { read: ${readDelay}ms, update: ${updateDelay}ms }`);

    if (!worker) {
      worker = new Worker("similars.js");
      worker.postMessage({ event: 'init', data: { overrides: similarOverrides } })
      worker.onmessage = postReplace;
    }

    // load the word spans
    spans = document.getElementsByClassName("word");

    // create/start the reader
    reader = new Reader(spans);
    reader.pauseThen(update, readDelay); // first-time
    reader.start();
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
  let idx = RiTa.random(repids.filter(id => !reader
    || !reader.selection().includes(sources[domain][id])));
  //idx = 261; //updateDelay = 10000000; // tmp-remove
  let dword = last(history[domain][idx]);
  let sword = last(history[shadow][idx]);
  let data = { idx, dword, sword, state, timestamp: Date.now() };

  let lidx = lineIdFromWordId(idx); // tmp-remove
  let le = document.getElementById('l' + lidx);
  le.firstChild.classList.add("min-word-spacing");

  worker.postMessage({ event: 'lookup', data }); // do similar search
}

function postReplace(e) {

  let { idx, dword, sword, dsims, ssims, timestamp } = e.data;
  let { domain, stepMode } = state;
  if (idx < 0) { return; }// TODO: write cache here

  let shadow = shadowTextName();
  let delayMs, pos = sources.pos[idx];
  if (dsims.length && ssims.length) {

    // pick a random similar to replace in display text
    let dnext = contextualRandom(idx, dword, dsims);
    history[domain][idx].push(dnext);
    let adjustedWs = updateDOM(dnext, idx);

    // pick a random similar to store in shadow text
    let snext = contextualRandom(idx, sword, ssims, { isShadow: true });
    history[shadow][idx].push(snext);
    updateState();

    let ms = Date.now() - timestamp;
    delayMs = Math.max(1, updateDelay - ms);
    if ((logging && verbose) || stepMode) {
      console.log(`${numMods()}) @${lineIdFromWordId(idx)}.${idx} `
        + `${dword}->${dnext}(${domain.substring(0, 1)}), `
        + `${sword}->${snext}(${shadow.substring(0, 1)}) `
        + `[${pos}] elapsed=${ms} delay=${delayMs} ws=${adjustedWs.toFixed(3)}`);
    }
  }
  else {
    console.log(`[FAIL] @${lineIdFromWordId(idx)}.${idx} `
      + `${dword}->${dsims.length}, ${sword}->${ssims.length} [${pos}]`);
  }

  if (!stepMode) state.loopId = setTimeout(ramble, delayMs);
}

/* selects an index to restore (from history) in displayed text */
function restore() {

  let { domain, stepMode } = state;

  let displayWords = unspanify();

  // get all possible restorations
  let choices = repids
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

    updateDOM(next, idx); // do replacement

    if ((logging && verbose) || stepMode) {
      console.log(`${numMods()}] @${lineIdFromWordId(idx)}.${idx} `
        + `${domain}: ${word} -> ${next} [${pos}]`);
    }
  }
  else {
    let id = repids.find(idx => history[domain][idx].length > 1);
    let word = sources[domain][id], hist = history[domain][id];
    console.log('[WARN] Invalid-state, numMods:'
      + numMods() + ' idx=' + id + '/' + word + ' history=', hist);
    displayWords.forEach((w, i) => console.log(i, w, JSON.stringify(history[domain][i])));
    return stop();
  }

  if (updateState() && !state.stepMode) {
    state.loopId = setTimeout(ramble, updateDelay);
  }
}

/* total number of replacements made in display text */
function numMods() {
  return repids.reduce((total, idx) =>
    total + history[state.domain][idx].length - 1, 0);
}

/* stop rambler and reader  */
function stop() {

  clearTimeout(state.loopId);
  state.updating = false;
  reader && reader.stop();

  spans && setTimeout(_ =>
    Array.from(spans).forEach(e => {
      e.classList.remove('incoming');
      e.classList.remove('outgoing');
    }), 1000);

  domLegend.style.display = 'none';

  updateInfo();

  worker && worker.postMessage({ event: 'getcache', data: {} });
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

/* compute id set for strict replacements (unused) */
function strictReplaceables() {
  return repids.filter(idx =>
    sources.rural[idx] !== sources.urban[idx]);
}

function unspanify() {
  return Array.from(document.getElementsByClassName
    ("word")).map(e => e.textContent);
}

function swapDomain() {
  state.legs = 0;
  state.domain = shadowTextName();
  log(`Domain switch -> '${state.domain}'`);
  if (state.domain === 'rural') {
    let p = document.getElementById("progress2");
    p.classList.add('shared-rural');
    p.classList.remove('shared-urban');
    progressBarsBaseMatrix[2] = [-1, 0, 0, 1, initialMetrics.radius * 2, 0];
    updateProgressBar(p, 2, progressBarsBaseMatrix, radius / initialMetrics.radius);
  } else {
    let p = document.getElementById("progress2");
    p.classList.remove('shared-rural');
    p.classList.add('shared-urban');
    progressBarsBaseMatrix[2] = [1, 0, 0, 1, 0, 0];
    updateProgressBar(p, 2, progressBarsBaseMatrix, radius / initialMetrics.radius);
  }
}

function updateDOM(next, idx) {

  let { outgoing } = state;

  let wordEle = document.querySelector(`#w${idx}`);
  let lineEle = wordEle.parentElement.parentElement;
  let lineIdx = parseFloat(lineEle.id.slice(1));
  wordEle.textContent = next;

  if (highlights) wordEle.classList.add(outgoing ? 'outgoing' : 'incoming');
  let wordSpace = adjustWordSpace(lineEle, initialMetrics.lineWidths[lineIdx]);

  if (0) console.log('@' + lineIdx + '.' + idx + ' wordSpace=' + wordSpace
    + '/' + wordSpace * initialMetrics.fontSize + 'em');

  return wordSpace;
}

function update(updating = true) {
  let { domain, legs, maxLegs } = state;
  log(`Start: outgoing in '${domain}' on leg ${legs + 1}/${maxLegs}`);
  state.updating = updating;
  state.maxLegs = walks.short;
  domLegend.style.display = 'block';
  ramble();
}

function scaleToFit() {
  scaleRatio = radius / initialMetrics.radius;
  initialMetrics.textDisplay.style.transform = "scale(" + scaleRatio + ")";
  domLegend.style.transform = "scale(" + scaleRatio + ")";
  document.querySelectorAll(".progress").forEach((p, i) => {
    updateProgressBar(p, i, progressBarsBaseMatrix, scaleRatio);
  });

  displayContainer.style.marginTop = 0.1 * radius + "px";
  if (!dbug) displayContainer.addEventListener("mousemove", hideCursor);
  progressBounds = document.getElementById("progress4")
    .getBoundingClientRect();

  // update measure ctx
  measureCtx.font = window.getComputedStyle(document.getElementById("l0")).font;
  log(`opts { scale: ${scaleRatio} font: ${measureCtx.font.replace(/,.*/, '')} }`);
  //console.log(measureCtx.font);
}

function trunc(arr, len = 100) {
  arr = Array.isArray(arr) ? (JSON.stringify(arr)
    .replace(/[""\[\]]/g, '')
    .replace(/,/g, ', '))
    : arr;
  if (arr.length <= len) return arr;
  return arr.substring(0, len) + '...';
}

function shadowTextName(domain) {
  domain = domain || state.domain;
  return domain === 'rural' ? 'urban' : 'rural';
}

function lineIdFromWordId(idx) {
  let wordEle = document.getElementById("w" + idx);
  let lineEle = wordEle.parentElement.parentElement;
  return parseInt(lineEle.id.slice(1));
}

function lineIdFromWordEle(wordEle) {
  let lineEle = wordEle.parentElement.parentElement;
  return parseInt(lineEle.id.slice(1));
}

function between(actual, min, max, range = (max - min) / 10) {
  let c1 = actual >= (min - Math.abs(range))
  let c2 = actual <= (max + Math.abs(range));
  return c1 && c2;
}

function last(arr) {
  if (arr && arr.length) return arr[arr.length - 1];
}

function log(msg) {
  logging && console.log('[INFO] ' + msg);
}

function clamp(num, min, max) {
  return Math.min(Math.max(num, min), max);
}

let lastSelected = function (wordIdx) {
  let hstack = history[state.domain][wordIdx];
  let lastIndex = hstack.length > 1 ? hstack.length - 2 : hstack.length - 1;
  return hstack[lastIndex];
}
