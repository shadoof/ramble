importScripts('lib/rita.js');
importScripts('shared.js');

// const rural = "by the time the light has faded, as the last of the reddish gold illumination comes to rest, then imperceptibly spreads out over the moss and floor of the woods on the westerly facing lakeside slopes, you or I will have set out on several of yet more circuits at every time and in all directions, before or after this or that circadian, usually diurnal, event on mildly rambling familiar walks, as if these exertions might be journeys of adventure whereas always our gestures, guided by paths, are also more like traces of universal daily ritual: just before or with the dawn, after a morning dip, in anticipation of breakfast, whenever the fish are still biting, as and when the industrious creatures are building their nests and shelters, after our own trials of work, while the birds still sing, in quiet moments after lunch, most particularly after dinner, at sunset, to escape, to avoid being found, to seem to be lost right here in this place where you or I have always wanted to be and where we might sometimes now or then have discovered some singular hidden beauty, or one another, or stumbled and injured ourselves beyond the hearing and call of other voices, or met with other danger, animal or inhuman, the one tearing and rending and opening up the darkness within us to bleed, yet we suppress any sound that might have expressed the terror and passion and horror and pain so that I or you may continue on this ramble, this before or after walk, and still return; or the other, the quiet evacuation of the light, the way, as we have kept on walking, it falls on us and removes us from existence since in any case we are all but never there, always merely passing through and by and over the moss, under the limbs of the evergreens, beside the lake, within the sound of its lapping waves, annihilated, gone, quite gone, now simply gone and, in being or walking in these ways, giving up all living light for settled, hearth held fire in its place, returned";
// const urban = "by the time the light has faded, as the last of the reddish gold illumination comes to rest, then imperceptibly spreads out over the dust and rubble of the craters on the easterly facing bankside heights, you or I will have rushed out on several of yet more circuits at every time and in all directions, before or after this or that violent, usually nocturnal, event on desperately hurried unfamiliar flights, as if these panics might be movements of desire whereas always our gestures, constrained by obstacles, are also more like scars of universal daily terror: just before or with the dawn, after a morning prayer, in anticipation of hunger, while the neighbors are still breathing, as and when the diligent authorities are marshaling their cronies and thugs, after our own trials of loss, while the mortars still fall, in quiet moments after shock, most particularly after curfew, at sunset, to escape, to avoid being found, to seem to be lost right here in this place where you or I have always wanted to be and where we might sometimes now or then have discovered some singular hidden beauty, or one another, or stumbled and injured ourselves beyond the hearing and call of other voices, or met with other danger, venal or military, the one tearing and rending and opening up the darkness within us to bleed, yet we suppress any sound that might have expressed the terror and longing and horror and pain so that I or you may continue on this expedition, this before or after assault, and still return; or the other, the quiet evacuation of the light, the way, as we have kept on struggling, it falls on us and removes us from existence since in any case we are all but never there, always merely passing through and by and over the dust, within the shadows of our ruins, beneath the wall, within the razor of its coiled wire, annihilated, gone, quite gone, now simply gone and, in being or advancing in these ways, giving up all living light for unsettled, heart felt fire in our veins, exiled";

const lex = RiTa.lexicon();

if (precache) {
  console.warn('[WARN] using cached similars'
    + ` [${Object.keys(precache).length}]`);
}

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
  let { idx, destination } = e.data;
  if (!destination) {
    this.postMessage({ idx: -1, displaySims: [], shadowSims: [], similarCache });
    return;
  }
  let shadow = destination === 'rural' ? 'urban' : 'rural';
  let displayWord = sources[destination][idx];
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