let RiTa = require('rita');

let repIds, cache;

const stops = ["also", "over", "have", "this", "that", "just", "then", "under", "some", "their", "when", "these", "within", "after", "with", "there", "where", "while", "from", "whenever", "every", "usually", "other", "whereas", "rushed", "prayer"];
const ignores = ["jerkies", "nary", "outta", "copras", "accomplis", "scad", "silly", "saris", "coca", "durn", "geed", "goted", "denture", "wales", /* added: JHC */ "terry"];
const minWordLength = 4;

const sources = {
  rural: ['by', 'the', 'time', 'the', 'light', 'has', 'faded', ',', 'as', 'the', 'last', 'of', 'the', 'reddish', 'gold', 'illumination', 'comes', 'to', 'rest', ',', 'then', 'imperceptibly', 'spreads', 'out', 'over', 'the', 'moss', 'and', 'floor', 'of', 'the', 'woods', 'on', 'the', 'westerly', 'facing', 'lakeside', 'slopes', ',', 'you', 'or', 'I', 'will', 'have', 'set', 'out', 'on', 'several', 'of', 'yet', 'more', 'circuits', 'at', 'every', 'time', 'and', 'in', 'all', 'directions', ',', 'before', 'or', 'after', 'this', 'or', 'that', 'circadian', ',', 'usually', 'diurnal', ',', 'event', 'on', 'mildly', 'rambling', 'familiar', 'walks', ',', 'as', 'if', 'these', 'exertions', 'might', 'be', 'journeys', 'of', 'adventure', 'whereas', 'always', 'our', 'gestures', ',', 'guided', 'by', 'paths', ',', 'are', 'also', 'more', 'like', 'traces', 'of', 'universal', 'daily', 'ritual', ':', 'just', 'before', 'or', 'with', 'the', 'dawn', ',', 'after', 'a', 'morning', 'dip', ',', 'in', 'anticipation', 'of', 'breakfast', ',', 'whenever', 'the', 'fish', 'are', 'still', 'biting', ',', 'as', 'and', 'when', 'the', 'industrious', 'creatures', 'are', 'building', 'their', 'nests', 'and', 'shelters', ',', 'after', 'our', 'own', 'trials', 'of', 'work', ',', 'while', 'the', 'birds', 'still', 'sing', ',', 'in', 'quiet', 'moments', 'after', 'lunch', ',', 'most', 'particularly', 'after', 'dinner', ',', 'at', 'sunset', ',', 'to', 'escape', ',', 'to', 'avoid', 'being', 'found', ',', 'to', 'seem', 'to', 'be', 'lost', 'right', 'here', 'in', 'this', 'place', 'where', 'you', 'or', 'I', 'have', 'always', 'wanted', 'to', 'be', 'and', 'where', 'we', 'might', 'sometimes', 'now', 'or', 'then', 'have', 'discovered', 'some', 'singular', 'hidden', 'beauty', ',', 'or', 'one', 'another', ',', 'or', 'stumbled', 'and', 'injured', 'ourselves', 'beyond', 'the', 'hearing', 'and', 'call', 'of', 'other', 'voices', ',', 'or', 'met', 'with', 'other', 'danger', ',', 'animal', 'or', 'inhuman', ',', 'the', 'one', 'tearing', 'and', 'rending', 'and', 'opening', 'up', 'the', 'darkness', 'within', 'us', 'to', 'bleed', ',', 'yet', 'we', 'suppress', 'any', 'sound', 'that', 'might', 'have', 'expressed', 'the', 'terror', 'and', 'passion', 'and', 'horror', 'and', 'pain', 'so', 'that', 'I', 'or', 'you', 'may', 'continue', 'on', 'this', 'ramble', ',', 'this', 'before', 'or', 'after', 'walk', ',', 'and', 'still', 'return', ';', 'or', 'the', 'other', ',', 'the', 'quiet', 'evacuation', 'of', 'the', 'light', ',', 'the', 'way', ',', 'as', 'we', 'have', 'kept', 'on', 'walking', ',', 'it', 'falls', 'on', 'us', 'and', 'removes', 'us', 'from', 'existence', 'since', 'in', 'any', 'case', 'we', 'are', 'all', 'but', 'never', 'there', ',', 'always', 'merely', 'passing', 'through', 'and', 'by', 'and', 'over', 'the', 'moss', ',', 'under', 'the', 'limbs', 'of', 'the', 'evergreens', ',', 'beside', 'the', 'lake', ',', 'within', 'the', 'sound', 'of', 'its', 'lapping', 'waves', ',', 'annihilated', ',', 'gone', ',', 'quite', 'gone', ',', 'now', 'simply', 'gone', 'and', ',', 'in', 'being', 'or', 'walking', 'in', 'these', 'ways', ',', 'giving', 'up', 'all', 'living', 'light', 'for', 'settled', ',', 'hearth', 'held', 'fire', 'in', 'its', 'place', ',', 'returned'],
  urban: ['by', 'the', 'time', 'the', 'light', 'has', 'faded', ',', 'as', 'the', 'last', 'of', 'the', 'reddish', 'gold', 'illumination', 'comes', 'to', 'rest', ',', 'then', 'imperceptibly', 'spreads', 'out', 'over', 'the', 'dust', 'and', 'rubble', 'of', 'the', 'craters', 'on', 'the', 'easterly', 'facing', 'bankside', 'heights', ',', 'you', 'or', 'I', 'will', 'have', 'rushed', 'out', 'on', 'several', 'of', 'yet', 'more', 'circuits', 'at', 'every', 'time', 'and', 'in', 'all', 'directions', ',', 'before', 'or', 'after', 'this', 'or', 'that', 'violent', ',', 'usually', 'nocturnal', ',', 'event', 'on', 'desperately', 'hurried', 'unfamiliar', 'flights', ',', 'as', 'if', 'these', 'panics', 'might', 'be', 'movements', 'of', 'desire', 'whereas', 'always', 'our', 'gestures', ',', 'constrained', 'by', 'obstacles', ',', 'are', 'also', 'more', 'like', 'scars', 'of', 'universal', 'daily', 'terror', ':', 'just', 'before', 'or', 'with', 'the', 'dawn', ',', 'after', 'a', 'morning', 'prayer', ',', 'in', 'anticipation', 'of', 'hunger', ',', 'while', 'the', 'neighbors', 'are', 'still', 'breathing', ',', 'as', 'and', 'when', 'the', 'diligent', 'authorities', 'are', 'marshaling', 'their', 'cronies', 'and', 'thugs', ',', 'after', 'our', 'own', 'trials', 'of', 'loss', ',', 'while', 'the', 'mortars', 'still', 'fall', ',', 'in', 'quiet', 'moments', 'after', 'shock', ',', 'most', 'particularly', 'after', 'curfew', ',', 'at', 'sunset', ',', 'to', 'escape', ',', 'to', 'avoid', 'being', 'found', ',', 'to', 'seem', 'to', 'be', 'lost', 'right', 'here', 'in', 'this', 'place', 'where', 'you', 'or', 'I', 'have', 'always', 'wanted', 'to', 'be', 'and', 'where', 'we', 'might', 'sometimes', 'now', 'or', 'then', 'have', 'discovered', 'some', 'singular', 'hidden', 'beauty', ',', 'or', 'one', 'another', ',', 'or', 'stumbled', 'and', 'injured', 'ourselves', 'beyond', 'the', 'hearing', 'and', 'call', 'of', 'other', 'voices', ',', 'or', 'met', 'with', 'other', 'danger', ',', 'venal', 'or', 'military', ',', 'the', 'one', 'tearing', 'and', 'rending', 'and', 'opening', 'up', 'the', 'darkness', 'within', 'us', 'to', 'bleed', ',', 'yet', 'we', 'suppress', 'any', 'sound', 'that', 'might', 'have', 'expressed', 'the', 'terror', 'and', 'longing', 'and', 'horror', 'and', 'pain', 'so', 'that', 'I', 'or', 'you', 'may', 'continue', 'on', 'this', 'expedition', ',', 'this', 'before', 'or', 'after', 'assault', ',', 'and', 'still', 'return', ';', 'or', 'the', 'other', ',', 'the', 'quiet', 'evacuation', 'of', 'the', 'light', ',', 'the', 'way', ',', 'as', 'we', 'have', 'kept', 'on', 'struggling', ',', 'it', 'falls', 'on', 'us', 'and', 'removes', 'us', 'from', 'existence', 'since', 'in', 'any', 'case', 'we', 'are', 'all', 'but', 'never', 'there', ',', 'always', 'merely', 'passing', 'through', 'and', 'by', 'and', 'over', 'the', 'dust', ',', 'within', 'the', 'shadows', 'of', 'our', 'ruins', ',', 'beneath', 'the', 'wall', ',', 'within', 'the', 'razor', 'of', 'its', 'coiled', 'wire', ',', 'annihilated', ',', 'gone', ',', 'quite', 'gone', ',', 'now', 'simply', 'gone', 'and', ',', 'in', 'being', 'or', 'advancing', 'in', 'these', 'ways', ',', 'giving', 'up', 'all', 'living', 'light', 'for', 'unsettled', ',', 'heart', 'felt', 'fire', 'in', 'our', 'veins', ',', 'exiled'],
  pos: ['in', 'dt', 'nn', 'dt', 'jj', 'vbz', 'vbn', ',', 'in', 'dt', 'jj', 'in', 'dt', 'jj', 'jj', 'nn', 'vbz', 'to', 'nn', ',', 'rb', 'rb', 'nns', 'in', 'in', 'dt', 'nn', 'cc', 'nn', 'in', 'dt', 'nns', 'in', 'dt', 'rb', 'vbg', 'nn', 'vbz', ',', 'prp', 'cc', 'prp', 'md', 'vbp', 'vbn', 'in', 'in', 'jj', 'in', 'rb', 'jjr', 'nns', 'in', 'dt', 'nn', 'cc', 'in', 'dt', 'nns', ',', 'in', 'cc', 'in', 'dt', 'cc', 'in', 'nn', ',', 'rb', 'jj', ',', 'nn', 'in', 'rb', 'jj', 'jj', 'nns', ',', 'in', 'in', 'dt', 'nns', 'md', 'vb', 'nns', 'in', 'nn', 'in', 'rb', 'prp$', 'nns', ',', 'vbn', 'in', 'nns', ',', 'vbp', 'rb', 'jjr', 'vb', 'nns', 'in', 'jj', 'rb', 'jj', ':', 'rb', 'in', 'cc', 'in', 'dt', 'nn', ',', 'in', 'dt', 'nn', 'nn', ',', 'in', 'nn', 'in', 'nn', ',', 'wrb', 'dt', 'nns', 'vbp', 'rb', 'vbg', ',', 'in', 'cc', 'wrb', 'dt', 'jj', 'nns', 'vbp', 'vbg', 'prp$', 'nns', 'cc', 'vbz', ',', 'in', 'prp$', 'jj', 'nns', 'in', 'nn', ',', 'in', 'dt', 'nns', 'rb', 'vb', ',', 'in', 'jj', 'nns', 'in', 'nn', ',', 'rbs', 'rb', 'in', 'nn', ',', 'in', 'nn', ',', 'to', 'vb', ',', 'to', 'vb', 'vbg', 'vbd', ',', 'to', 'vb', 'to', 'vb', 'vbd', 'jj', 'rb', 'in', 'dt', 'nn', 'wrb', 'prp', 'cc', 'prp', 'vbp', 'rb', 'vbd', 'to', 'vb', 'cc', 'wrb', 'prp', 'md', 'rb', 'rb', 'cc', 'rb', 'vbp', 'vbn', 'dt', 'jj', 'vbn', 'nn', ',', 'cc', 'cd', 'dt', ',', 'cc', 'vbd', 'cc', 'vbn', 'prp', 'in', 'dt', 'vbg', 'cc', 'vb', 'in', 'jj', 'nns', ',', 'cc', 'vbd', 'in', 'jj', 'nn', ',', 'jj', 'cc', 'jj', ',', 'dt', 'cd', 'vbg', 'cc', 'nn', 'cc', 'vbg', 'in', 'dt', 'nn', 'in', 'prp', 'to', 'vb', ',', 'rb', 'prp', 'vbp', 'dt', 'jj', 'in', 'md', 'vbp', 'vbn', 'dt', 'nn', 'cc', 'nn', 'cc', 'nn', 'cc', 'nn', 'rb', 'in', 'prp', 'cc', 'prp', 'md', 'vb', 'in', 'dt', 'nn', ',', 'dt', 'in', 'cc', 'in', 'vb', ',', 'cc', 'rb', 'jj', ';', 'cc', 'dt', 'jj', ',', 'dt', 'jj', 'nn', 'in', 'dt', 'jj', ',', 'dt', 'nn', ',', 'in', 'prp', 'vbp', 'vbd', 'in', 'vbg', ',', 'prp', 'vbz', 'in', 'prp', 'cc', 'vbz', 'prp', 'in', 'nn', 'in', 'in', 'dt', 'nn', 'prp', 'vbp', 'dt', 'cc', 'rb', 'rb', ',', 'rb', 'rb', 'vbg', 'in', 'cc', 'in', 'cc', 'in', 'dt', 'nn', ',', 'in', 'dt', 'nns', 'in', 'dt', 'nns', ',', 'in', 'dt', 'nn', ',', 'in', 'dt', 'jj', 'in', 'prp$', 'nn', 'vbz', ',', 'vbd', ',', 'vbn', ',', 'rb', 'vbn', ',', 'rb', 'rb', 'vbn', 'cc', ',', 'in', 'vbg', 'cc', 'vbg', 'in', 'dt', 'nns', ',', 'vbg', 'in', 'dt', 'vbg', 'jj', 'in', 'vbd', ',', 'nn', 'vbn', 'nn', 'in', 'prp$', 'nn', ',', 'vbd']
};

function findSimilars(word, pos) {

  let limit = -1;

  let rhymes = RiTa.rhymes(word, { pos, limit });
  let sounds = RiTa.soundsLike(word, { pos, limit });
  let spells = RiTa.spellsLike(word, { pos, limit });
  let sims = new Set([...rhymes, ...sounds, ...spells]);

  sims = [...sims].filter(sim =>
    !ignores.includes(sim)
    && !word.includes(sim)
    && !sim.includes(word)
    && isReplaceable(word));

  return sims.length ? sims : false;
}

function quotify(arr) {
  return JSON.stringify(arr).replace(/["]/g, "'");
}

function getIdx(word) { // remove?
  let uidx = sources.urban.indexOf(word);
  if (uidx > -1) return uidx;
  return sources.rural.indexOf(word);
}

const similarOverrides = {

  avoid: { sims: ["elude", "escape", "evade"], pos: "vb" },
  neighbors: { sims: ["brothers", "brethren", "fellows"], pos: "nns" },
  rending: { sims: ["ripping", "cleaving", "rupturing", "splitting", "severing"], pos: "nn" },
  inhuman: { sims: ["grievous", "grim", "hard", "heavy", "onerous", "oppressive", "rough", "rugged", "severe", "austere", "inclement", "intemperate"], pos: "jj" },
  sometimes: { sims: ["occasionally", "intermittently", "periodically", "recurrently", "infrequently", "rarely", "irregularly", "sporadically", "variously"], pos: "rb" },
  adventure: { sims: ["experience", "exploit", "occasion", "ordeal", "venture", "expedition", "mission"], pos: "nn" },
  unfamiliar: { sims: ["unconventional", "pioneering", "unaccustomed", "unprecedented"], pos: "jj" },
  coiled: { sims: ["twisted", "twisting", "curling", "curving", "serpentine", "corkscrewed", "jagged", "meandering", "spiraled"], pos: "nn" },
  particularly: { sims: ["specifically", "generally", "aptly"], pos: "rb" },
  unsettled: { sims: ["unresolved", "uncertain", "undecided", "rootless"], pos: "vbd" },
  dip: { sims: ["blip", "chip", "clip", "drip", "grip", "microchip", "quip", "roundtrip", "ship", "slip", "snip", "strip", "trip", "whip"], pos: "nn" },
  set: { sims: ["caressed", "digressed", "forget", "progressed", "redressed", "regressed", "seat"], pos: "vbn" },
};

// let s = '';
// Object.entries(similarOverrides).forEach(([k, v]) => {
//   let idx = getIdx(k)
//   s += '\n' + k + ': { sims: ' + JSON.stringify(v.sims) + ', pos: "' + sources.pos[idx] + '" },';
// });
// console.log(s);
// process.exit(1);

function isReplaceable(word) {
  return (word.length >= minWordLength || cache[word]) && !stops.includes(word);
}

function replaceables() { // [] of replaceable indexes
  let repids = [], count = 0;
  sources.rural.forEach((word, idx) => {
    if (isReplaceable(word)) {
      let urban = sources.urban[idx];
      if (!isReplaceable(word)) {
        throw Error('Invalid state[1]: ' + idx + ') ' + word + '/' + urban);
      }
      repids.push(idx);
      //console.log(idx, word + '/' + urban);
    }
  });
  return repids;
}

function cacheSize() {
  return Object.keys(cache).length;
}

////////////////////////////////////////////////////////////////////////

function init() {
  let cachePath = './gencache-l1.json';
  try {
    cache = require(cachePath);
  }
  catch (e) {
    console.warn(cachePath + ' not found', 'cwd: ' + process.cwd(), e);
    cache = {};
  }

  let initialSz = cacheSize();
  Object.entries(similarOverrides).forEach(([k, v]) => cache[k] = v); // overrides
  console.log('\n[INFO] Cache: ' + initialSz + '/' + cacheSize() + ' entries');

  repIds = replaceables();
  console.log('[INFO] ' + repIds.length + ' Replaceable words');
}

function writeMisses(missing, level) {
  try {
    let fname = './missing-l' + level + '.json';
    require('fs').writeFileSync(fname, JSON.stringify(cache));
    console.log('Writing: ' + fname + ' with ' + missing.length + ' entries');
  } catch (err) {
    console.error(err);
  }
}

function writeCache(level) {
  try {
    let fname = './gencache-l' + level + '.json';
    require('fs').writeFileSync(fname, JSON.stringify(cache));
    console.log('Writing: ' + fname + ' with ' + cacheSize() + ' entries');
  } catch (err) {
    console.error(err);
  }
}

function doLevel1() {
  if (cacheSize() < 181) {
    console.log('[INFO] Level1 ~' + (181 - cacheSize()) + ' new words');
    let missing = [];
    repIds.forEach(idx => {
      let urbanW = sources.urban[idx];
      let ruralW = sources.rural[idx];
      let pos = sources.pos[idx];
      if (idx === 54) {
        console.log();
      }
      let rsims = [], usims = [];
      if (cache[urbanW]) {
        usims = cache[urbanW].sims;
      }
      else {
        usims = findSimilars(urbanW, pos);
      }
      if (usims.length) cache[urbanW] = { sims: usims, pos: pos };
      if (urbanW === ruralW) {
        rsims = usims;
      }
      else {
        if (cache[ruralW]) {
          rsims = cache[ruralW].sims;
        }
        else {
          rsims = findSimilars(ruralW, pos);
        }
        if (rsims.length) cache[ruralW] = { sims: rsims, pos: pos };
      }
      if (!usims.length) missing.push(urbanW);
      if (!rsims.length) missing.push(ruralW);
      if (!usims.length && !rsims.length) {
        throw Error(idx + ' ' + ruralW + '/' + urbanW);
      }
      let sz = Object.keys(cache).length;
      if (sz % 10 === 9) console.log('[CACHE] ' + ruralW + '/' + urbanW
        + ': ' + rsims.length + '/' + usims.length + ' [' + sz + ']');
      //console.log(idx, urban+': '+usims);
      //console.log(idx, rural+': '+rsims+'\n');
    });
    missing = missing.filter(w => !Object.keys(cache).includes(w));
    if (missing.length) throw Error(missing);

    writeCache(1);
  }
  else {
    console.log('[INFO] Skipping Level 1...');
  }

}

function doLevel2() {
  let total = Object.keys(cache).reduce((acc, cur) => acc + cache[cur].sims.length, 0);
  console.log('[INFO] Level 2 ' + total + ' new words');
  let todo = Object.values(cache);
  todo.forEach(({ sims, pos }) => {
    sims.forEach(word => {
      if (!/[a-z]+/.test(word)) throw Error('Invalid word: "' + word + '"');
    });
  });

  let missing = [];
  for (let i = 0; i < todo.length; i++) {
    let { sims: words, pos } = todo[i];
    words.forEach(word => {
      if (!cache[word]) {
        let sims = findSimilars(word, pos);
        if (sims.length > 1) {
          cache[word] = { sims, pos };
          console.log('[ADDING] ' + word + '(' + pos + '): #sims='
            + sims.length + ' [' + cacheSize() + ']');
        }
        else {
          console.log('[MISSING] ' + word + '(' + pos + '): #sims='
            + (sims ? sims.length : 0) + ' [' + cacheSize() + ']');
          missing.push(word);
        }
      }
      else {
        console.log('[EXISTS] ' + word + '(' + pos + ')');
      }
    });
  }

  sz = Object.keys(cache).length;
  console.log('Completed level 2: ' + Object.keys(cache).length + ' entries');
  writeCache(2);
  writeMisses(missing, 2);
}

////////////////////////////////////////////////////////////////////////

init();
doLevel1();
doLevel2();