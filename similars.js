importScripts('lib/rita.js');

const lex = RiTa.lexicon();

const similarCache = {
  avoid: ['elude', 'escape', 'evade'],
  neighbors: ['brothers', 'brethren', 'fellows'],
  inhuman: ['grievous', 'grim', 'hard', 'heavy', 'onerous', 'oppressive', 'rough', 'rugged', 'severe', 'austere', ' inclement', 'intemperate'],
  sometimes: ['occasionally', 'intermittently', 'periodically', 'recurrently', 'infrequently', 'rarely', 'irregularly', 'sporadically', 'variously'],
  adventure: ['experience', 'exploit', 'occasion', 'ordeal', 'venture', 'expedition', 'mission'],
  unfamiliar: ['unconventional', 'pioneering', 'unaccustomed', ' unprecedented'],
};

const ignores = ["jerkies", "nary", "outta", "copras", "accomplis", "scad", "silly", "saris", "coca", "durn", "geed", "goted", "denture", "wales"];

this.onmessage = function (e) {

  this.postMessage(findSimilars(e.data));
};

function findSimilars(opts) {
  let { word, pos, isReplaceable, sources } = opts;
  let sims, limit = -1;
  if (word in similarCache) {
    sims = similarCache[word]; // cache
  }
  else {
    let rhymes = RiTa.rhymes(word, { pos, limit });
    let sounds = RiTa.soundsLike(word, { pos, limit });
    let spells = RiTa.spellsLike(word, { pos, limit });
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
}

function getSimilars(word, pos) {
  let limit = -1;
  let rhymes = RiTa.rhymes(word, { pos, limit });
  let sounds = RiTa.soundsLike(word, { pos, limit });
  let spells = RiTa.spellsLike(word, { pos, limit });
  let result = [...rhymes, ...sounds, ...spells];
  console.log(RiTa.VERSION, word + ':', result);
  let similars = result.slice(0, 13).join("\n");
  return { word, similars };
}
