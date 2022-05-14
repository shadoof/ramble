let RiTa = require('rita');

const stops = ["also", "over", "have", "this", "that", "just", "then", "under", "some", "their", "when", "these", "within", "after", "with", "there", "where", "while", "from", "whenever", "every", "usually", "other", "whereas", "rushed", "prayer"];
const ignores = ["jerkies", "nary", "outta", "copras", "accomplis", "scad", "silly", "saris", "coca", "durn", "geed", "goted", "denture", "wales", /* added: JHC */ "terry"];
const minWordLength = 4;

const sources = {
  rural: ['by', 'the', 'time', 'the', 'light', 'has', 'faded', ',', 'as', 'the', 'last', 'of', 'the', 'reddish', 'gold', 'illumination', 'comes', 'to', 'rest', ',', 'then', 'imperceptibly', 'spreads', 'out', 'over', 'the', 'moss', 'and', 'floor', 'of', 'the', 'woods', 'on', 'the', 'westerly', 'facing', 'lakeside', 'slopes', ',', 'you', 'or', 'I', 'will', 'have', 'set', 'out', 'on', 'several', 'of', 'yet', 'more', 'circuits', 'at', 'every', 'time', 'and', 'in', 'all', 'directions', ',', 'before', 'or', 'after', 'this', 'or', 'that', 'circadian', ',', 'usually', 'diurnal', ',', 'event', 'on', 'mildly', 'rambling', 'familiar', 'walks', ',', 'as', 'if', 'these', 'exertions', 'might', 'be', 'journeys', 'of', 'adventure', 'whereas', 'always', 'our', 'gestures', ',', 'guided', 'by', 'paths', ',', 'are', 'also', 'more', 'like', 'traces', 'of', 'universal', 'daily', 'ritual', ':', 'just', 'before', 'or', 'with', 'the', 'dawn', ',', 'after', 'a', 'morning', 'dip', ',', 'in', 'anticipation', 'of', 'breakfast', ',', 'whenever', 'the', 'fish', 'are', 'still', 'biting', ',', 'as', 'and', 'when', 'the', 'industrious', 'creatures', 'are', 'building', 'their', 'nests', 'and', 'shelters', ',', 'after', 'our', 'own', 'trials', 'of', 'work', ',', 'while', 'the', 'birds', 'still', 'sing', ',', 'in', 'quiet', 'moments', 'after', 'lunch', ',', 'most', 'particularly', 'after', 'dinner', ',', 'at', 'sunset', ',', 'to', 'escape', ',', 'to', 'avoid', 'being', 'found', ',', 'to', 'seem', 'to', 'be', 'lost', 'right', 'here', 'in', 'this', 'place', 'where', 'you', 'or', 'I', 'have', 'always', 'wanted', 'to', 'be', 'and', 'where', 'we', 'might', 'sometimes', 'now', 'or', 'then', 'have', 'discovered', 'some', 'singular', 'hidden', 'beauty', ',', 'or', 'one', 'another', ',', 'or', 'stumbled', 'and', 'injured', 'ourselves', 'beyond', 'the', 'hearing', 'and', 'call', 'of', 'other', 'voices', ',', 'or', 'met', 'with', 'other', 'danger', ',', 'animal', 'or', 'inhuman', ',', 'the', 'one', 'tearing', 'and', 'rending', 'and', 'opening', 'up', 'the', 'darkness', 'within', 'us', 'to', 'bleed', ',', 'yet', 'we', 'suppress', 'any', 'sound', 'that', 'might', 'have', 'expressed', 'the', 'terror', 'and', 'passion', 'and', 'horror', 'and', 'pain', 'so', 'that', 'I', 'or', 'you', 'may', 'continue', 'on', 'this', 'ramble', ',', 'this', 'before', 'or', 'after', 'walk', ',', 'and', 'still', 'return', ';', 'or', 'the', 'other', ',', 'the', 'quiet', 'evacuation', 'of', 'the', 'light', ',', 'the', 'way', ',', 'as', 'we', 'have', 'kept', 'on', 'walking', ',', 'it', 'falls', 'on', 'us', 'and', 'removes', 'us', 'from', 'existence', 'since', 'in', 'any', 'case', 'we', 'are', 'all', 'but', 'never', 'there', ',', 'always', 'merely', 'passing', 'through', 'and', 'by', 'and', 'over', 'the', 'moss', ',', 'under', 'the', 'limbs', 'of', 'the', 'evergreens', ',', 'beside', 'the', 'lake', ',', 'within', 'the', 'sound', 'of', 'its', 'lapping', 'waves', ',', 'annihilated', ',', 'gone', ',', 'quite', 'gone', ',', 'now', 'simply', 'gone', 'and', ',', 'in', 'being', 'or', 'walking', 'in', 'these', 'ways', ',', 'giving', 'up', 'all', 'living', 'light', 'for', 'settled', ',', 'hearth', 'held', 'fire', 'in', 'its', 'place', ',', 'returned'],
  urban: ['by', 'the', 'time', 'the', 'light', 'has', 'faded', ',', 'as', 'the', 'last', 'of', 'the', 'reddish', 'gold', 'illumination', 'comes', 'to', 'rest', ',', 'then', 'imperceptibly', 'spreads', 'out', 'over', 'the', 'dust', 'and', 'rubble', 'of', 'the', 'craters', 'on', 'the', 'easterly', 'facing', 'bankside', 'heights', ',', 'you', 'or', 'I', 'will', 'have', 'rushed', 'out', 'on', 'several', 'of', 'yet', 'more', 'circuits', 'at', 'every', 'time', 'and', 'in', 'all', 'directions', ',', 'before', 'or', 'after', 'this', 'or', 'that', 'violent', ',', 'usually', 'nocturnal', ',', 'event', 'on', 'desperately', 'hurried', 'unfamiliar', 'flights', ',', 'as', 'if', 'these', 'panics', 'might', 'be', 'movements', 'of', 'desire', 'whereas', 'always', 'our', 'gestures', ',', 'constrained', 'by', 'obstacles', ',', 'are', 'also', 'more', 'like', 'scars', 'of', 'universal', 'daily', 'terror', ':', 'just', 'before', 'or', 'with', 'the', 'dawn', ',', 'after', 'a', 'morning', 'prayer', ',', 'in', 'anticipation', 'of', 'hunger', ',', 'while', 'the', 'neighbors', 'are', 'still', 'breathing', ',', 'as', 'and', 'when', 'the', 'diligent', 'authorities', 'are', 'marshaling', 'their', 'cronies', 'and', 'thugs', ',', 'after', 'our', 'own', 'trials', 'of', 'loss', ',', 'while', 'the', 'mortars', 'still', 'fall', ',', 'in', 'quiet', 'moments', 'after', 'shock', ',', 'most', 'particularly', 'after', 'curfew', ',', 'at', 'sunset', ',', 'to', 'escape', ',', 'to', 'avoid', 'being', 'found', ',', 'to', 'seem', 'to', 'be', 'lost', 'right', 'here', 'in', 'this', 'place', 'where', 'you', 'or', 'I', 'have', 'always', 'wanted', 'to', 'be', 'and', 'where', 'we', 'might', 'sometimes', 'now', 'or', 'then', 'have', 'discovered', 'some', 'singular', 'hidden', 'beauty', ',', 'or', 'one', 'another', ',', 'or', 'stumbled', 'and', 'injured', 'ourselves', 'beyond', 'the', 'hearing', 'and', 'call', 'of', 'other', 'voices', ',', 'or', 'met', 'with', 'other', 'danger', ',', 'venal', 'or', 'military', ',', 'the', 'one', 'tearing', 'and', 'rending', 'and', 'opening', 'up', 'the', 'darkness', 'within', 'us', 'to', 'bleed', ',', 'yet', 'we', 'suppress', 'any', 'sound', 'that', 'might', 'have', 'expressed', 'the', 'terror', 'and', 'longing', 'and', 'horror', 'and', 'pain', 'so', 'that', 'I', 'or', 'you', 'may', 'continue', 'on', 'this', 'expedition', ',', 'this', 'before', 'or', 'after', 'assault', ',', 'and', 'still', 'return', ';', 'or', 'the', 'other', ',', 'the', 'quiet', 'evacuation', 'of', 'the', 'light', ',', 'the', 'way', ',', 'as', 'we', 'have', 'kept', 'on', 'struggling', ',', 'it', 'falls', 'on', 'us', 'and', 'removes', 'us', 'from', 'existence', 'since', 'in', 'any', 'case', 'we', 'are', 'all', 'but', 'never', 'there', ',', 'always', 'merely', 'passing', 'through', 'and', 'by', 'and', 'over', 'the', 'dust', ',', 'within', 'the', 'shadows', 'of', 'our', 'ruins', ',', 'beneath', 'the', 'wall', ',', 'within', 'the', 'razor', 'of', 'its', 'coiled', 'wire', ',', 'annihilated', ',', 'gone', ',', 'quite', 'gone', ',', 'now', 'simply', 'gone', 'and', ',', 'in', 'being', 'or', 'advancing', 'in', 'these', 'ways', ',', 'giving', 'up', 'all', 'living', 'light', 'for', 'unsettled', ',', 'heart', 'felt', 'fire', 'in', 'our', 'veins', ',', 'exiled'],
  pos: ['in', 'dt', 'nn', 'dt', 'jj', 'vbz', 'vbn', ',', 'in', 'dt', 'jj', 'in', 'dt', 'jj', 'jj', 'nn', 'vbz', 'to', 'nn', ',', 'rb', 'rb', 'nns', 'in', 'in', 'dt', 'nn', 'cc', 'nn', 'in', 'dt', 'nns', 'in', 'dt', 'rb', 'vbg', 'nn', 'vbz', ',', 'prp', 'cc', 'prp', 'md', 'vbp', 'vbn', 'in', 'in', 'jj', 'in', 'rb', 'jjr', 'nns', 'in', 'dt', 'nn', 'cc', 'in', 'dt', 'nns', ',', 'in', 'cc', 'in', 'dt', 'cc', 'in', 'nn', ',', 'rb', 'jj', ',', 'nn', 'in', 'rb', 'jj', 'jj', 'nns', ',', 'in', 'in', 'dt', 'nns', 'md', 'vb', 'nns', 'in', 'nn', 'in', 'rb', 'prp$', 'nns', ',', 'vbn', 'in', 'nns', ',', 'vbp', 'rb', 'jjr', 'vb', 'nns', 'in', 'jj', 'rb', 'jj', ':', 'rb', 'in', 'cc', 'in', 'dt', 'nn', ',', 'in', 'dt', 'nn', 'nn', ',', 'in', 'nn', 'in', 'nn', ',', 'wrb', 'dt', 'nns', 'vbp', 'rb', 'vbg', ',', 'in', 'cc', 'wrb', 'dt', 'jj', 'nns', 'vbp', 'vbg', 'prp$', 'nns', 'cc', 'vbz', ',', 'in', 'prp$', 'jj', 'nns', 'in', 'nn', ',', 'in', 'dt', 'nns', 'rb', 'vb', ',', 'in', 'jj', 'nns', 'in', 'nn', ',', 'rbs', 'rb', 'in', 'nn', ',', 'in', 'nn', ',', 'to', 'vb', ',', 'to', 'vb', 'vbg', 'vbd', ',', 'to', 'vb', 'to', 'vb', 'vbd', 'jj', 'rb', 'in', 'dt', 'nn', 'wrb', 'prp', 'cc', 'prp', 'vbp', 'rb', 'vbd', 'to', 'vb', 'cc', 'wrb', 'prp', 'md', 'rb', 'rb', 'cc', 'rb', 'vbp', 'vbn', 'dt', 'jj', 'vbn', 'nn', ',', 'cc', 'cd', 'dt', ',', 'cc', 'vbd', 'cc', 'vbn', 'prp', 'in', 'dt', 'vbg', 'cc', 'vb', 'in', 'jj', 'nns', ',', 'cc', 'vbd', 'in', 'jj', 'nn', ',', 'jj', 'cc', 'jj', ',', 'dt', 'cd', 'vbg', 'cc', 'nn', 'cc', 'vbg', 'in', 'dt', 'nn', 'in', 'prp', 'to', 'vb', ',', 'rb', 'prp', 'vbp', 'dt', 'jj', 'in', 'md', 'vbp', 'vbn', 'dt', 'nn', 'cc', 'nn', 'cc', 'nn', 'cc', 'nn', 'rb', 'in', 'prp', 'cc', 'prp', 'md', 'vb', 'in', 'dt', 'nn', ',', 'dt', 'in', 'cc', 'in', 'vb', ',', 'cc', 'rb', 'jj', ';', 'cc', 'dt', 'jj', ',', 'dt', 'jj', 'nn', 'in', 'dt', 'jj', ',', 'dt', 'nn', ',', 'in', 'prp', 'vbp', 'vbd', 'in', 'vbg', ',', 'prp', 'vbz', 'in', 'prp', 'cc', 'vbz', 'prp', 'in', 'nn', 'in', 'in', 'dt', 'nn', 'prp', 'vbp', 'dt', 'cc', 'rb', 'rb', ',', 'rb', 'rb', 'vbg', 'in', 'cc', 'in', 'cc', 'in', 'dt', 'nn', ',', 'in', 'dt', 'nns', 'in', 'dt', 'nns', ',', 'in', 'dt', 'nn', ',', 'in', 'dt', 'jj', 'in', 'prp$', 'nn', 'vbz', ',', 'vbd', ',', 'vbn', ',', 'rb', 'vbn', ',', 'rb', 'rb', 'vbn', 'cc', ',', 'in', 'vbg', 'cc', 'vbg', 'in', 'dt', 'nns', ',', 'vbg', 'in', 'dt', 'vbg', 'jj', 'in', 'vbd', ',', 'nn', 'vbn', 'nn', 'in', 'prp$', 'nn', ',', 'vbd']
};

let overrides = {
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

let state = { sources, ignores }, similarCache = {};

function findSimilars(idx, word, pos, state) {

  let { ignores, sources } = state;
  //console.log('findSimilars:', ignores, sources);
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
      && isReplaceable(word, state));

    if (sims.length > 1) {
      let elapsed = Date.now() - timestamp;
      similarCache[word] = sims; // to cache
      //console.log('[CACHE] (' + elapsed + 'ms) ' + word + '/' + pos
      //+ ': ' + trunc(sims) + ' [' + Object.keys(similarCache).length + ']');
      return sims;
    }
  }
  return [];
}

function findSimilarsX(word, pos) {

  let limit = -1;

  let rhymes = RiTa.rhymes(word, { pos, limit });
  let sounds = RiTa.soundsLike(word, { pos, limit });
  let spells = RiTa.spellsLike(word, { pos, limit });
  let sims = new Set([...rhymes, ...sounds, ...spells]);

  sims = [...sims].filter(sim =>
    sim.length >= minWordLength
    && !word.includes(sim)
    && !sim.includes(word)
    && !stops.includes(sim)
    && !ignores.includes(sim));

  return sims;
}

function quotify(arr) { 
  return JSON.stringify(arr).replace(/["]/g, "'");//arr.map((a,i) => {" '" + a + "',").join('');
}

function isReplaceable(word, state) {
  //console.log(state);
  let { stops, minWordLength } = state;
  return (word.length >= minWordLength || overrides[word])
    && !stops.includes(word);
}

////////////////////////////////////////////////////////
let missing = ["animal/jj", "sunset/nn", "most/rbs", "circadian/nn", "simply/rb", "will/md",
  "familiar/jj", "mildly/rb", "marshaling/vbg", "singular/jj", "since/in", "beyond/in", 
];

missing.forEach((w, i) => {
  let [word,pos] = w.split('/');
  lookupWord(word, pos);
});

function lookupWord(word, pos) {
  let idx, counter;//, word = 'animal';
  let uidx = sources.urban.indexOf(word);
  let ridx = sources.rural.indexOf(word);
  if (uidx > -1) {
    idx = uidx;
    counter = sources.rural[idx];
  }
  else if (ridx > -1) {
    idx = ridx;
    counter = sources.urban[idx];
  }

  if (typeof idx === 'undefined') {
    console.log('remove '+word+'/'+pos);
    return;
  }
  if (pos && pos !== sources.pos[idx]) {
    throw Error(word + " '" + pos + '\'!=\'' + sources.pos[idx]+"'");
  }

  let sims = findSimilars(idx, word, pos, state);
  let csims = findSimilars(idx, counter, pos, state);
  // console.log(idx, word + '/' + counter, pos, word + ': '
  //   + quotify(sims), word !== counter ? ('' + counter + ': ' + quotify(csims)) : '');
  console.log('{ word: "'+word+'", pos: "'+pos+'" }'+(word !== counter ?', { word: "'+counter+'", pos: "'+pos+'"}':'')+',');
}