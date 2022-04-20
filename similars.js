importScripts('lib/rita.js');
importScripts('shared.js');

const lex = RiTa.lexicon();

// if (precache) {
//   console.info('[INFO] Using cached similars'
//     + ` [${Object.keys(precache).length}]`);
// }

const similarCache = precache || {
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
};

this.onmessage = function (e) {
  let { idx, domain } = e.data;
  if (!domain) {
    this.postMessage({ idx: -1, displaySims: [], shadowSims: [], similarCache });
    return;
  }
  let shadow = domain === 'rural' ? 'urban' : 'rural';
  let displayWord = sources[domain][idx];
  let shadowWord = sources[shadow][idx];
  let pos = sources.pos[idx];
  let shadowSims = findSimilars(shadowWord, pos, sources); // ??
  let displaySims = findSimilars(displayWord, pos, sources);
  this.postMessage({ idx, displaySims, shadowSims });
};

function findSimilars(word, pos, sources) {

  let sims, limit = -1;
  if (word in similarCache) {
    return similarCache[word]; // from cache
  }
  else {
    let rhymes = RiTa.rhymes(word, { pos, limit });
    let sounds = RiTa.soundsLike(word, { pos, limit });
    let spells = RiTa.spellsLike(word, { pos, limit });
    sims = [...rhymes, ...sounds, ...spells];

    sims = sims.filter(sim =>
      sim.length >= minWordLength
      && !word.includes(sim)
      && !sim.includes(word)
      && !stops.includes(sim)
      && !ignores.includes(sim));

    if (sims.length > 1) {
      console.log('[CACHE] ' + word + '/' + pos + ': ' + sims);
      similarCache[word] = sims; // to cache
      return sims;
    }
  }

  console.warn('no similars for: "' + word + '"/' + pos
    + ((sources.rural.includes(word) || sources.urban.includes(word))
      ? ' *** [In Source]' : ''));

  return [];
}