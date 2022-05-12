
importScripts('lib/rita.js');
importScripts('cache.js');

const lex = RiTa.lexicon();

let similarCache = typeof cache !== 'undefined' ? cache : {};
let eventHandlers = {
  init: function (data, worker) {
    const num = Object.entries(data.overrides).length;
    console.log('[INFO] Found ' + num + ' cache overrides');
    Object.entries(data.overrides).forEach(([k, v]) => similarCache[k] = v);
    if (similarCache) {
      console.info('[INFO] Using cached similars'
        + ` [${Object.keys(similarCache).length}]`);
    }
    else {
      console.info('[INFO] No cache, doing live lookups');
    }
  },
  getcache: function (data, worker) {
    const cache = similarCache;
    worker.postMessage({ idx: -1, dsims: 0, ssims: 0, cache });
  },
  lookup: function (data, worker) {
    const { idx, dword, sword, state, timestamp } = data;
    const { sources } = state, pos = sources.pos[idx];
    const dsims = findSimilars(idx, dword, pos, state, timestamp);
    const ssims = findSimilars(idx, sword, pos, state, timestamp);
    worker.postMessage({ idx, dword, sword, dsims, ssims, timestamp });
  }
}

this.onmessage = function (e) {
  let { event, data } = e.data;
  //console.log('worker.onmessage:', event, typeof eventHandlers[event]);
  eventHandlers[event](data, this);
}

function findSimilars(idx, word, pos, state, timestamp) {

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

  let inSource = sources.rural[idx] === word || sources.urban[idx] === word && sources.pos[idx] === pos;
  if (inSource && !sourceMisses.has(word + '/' + pos)) {
    sourceMisses.add(word + '/' + pos)
    console.warn('[WARN] No similars for: "' + word + '"/' + pos
      + (inSource ? ' *** [In Source] ' + JSON.stringify(Array.from(sourceMisses)) : ''));
  }
  //if (inSource) throw Error('[WARN] No similars for: "' + word + '"/' + pos);

  return [];
}
let sourceMisses = new Set();

function isReplaceable(word, state) {
  //console.log(state);
  let { stops, overrides, minWordLength } = state;
  return (word.length >= minWordLength || overrides[word])
    && !stops.includes(word);
}

function trunc(arr, len = 100) {
  arr = Array.isArray(arr) ? (JSON.stringify(arr)
    .replace(/[""\[\]]/g, '')
    .replace(/,/g, ', '))
    : arr;
  if (arr.length <= len) return arr;
  return arr.substring(0, len) + '...';
}