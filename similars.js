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
  let { idx, destination, sources, isReplaceable } = e.data;
  let shadow = destination === 'rural' ? 'urban' : 'rural';
  let displayWord = sources[destination][idx];
  let shadowWord = sources[shadow][idx];
  let pos = sources.pos[idx];
  let displaySims = findSimilars(displayWord, pos, sources, isReplaceable);
  let shadowSims = findSimilars(shadowWord, pos, sources, isReplaceable);
  this.postMessage({idx, displaySims, shadowSims });
};

function findSimilars(word, pos, sources, isReplaceable) {
  
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

/*function getSimilars(word, pos) {
  let limit = -1;
  let rhymes = RiTa.rhymes(word, { pos, limit });
  let sounds = RiTa.soundsLike(word, { pos, limit });
  let spells = RiTa.spellsLike(word, { pos, limit });
  let result = [...rhymes, ...sounds, ...spells];
  console.log(RiTa.VERSION, word + ':', result);
  let similars = result.slice(0, 13).join("\n");
  return { word, similars };
}*/
