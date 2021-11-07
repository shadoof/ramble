class Rambler {

  constructor(sources, opts = {}) {
    this.sources = sources;
    this.name = opts.name || 'rambler';
    this.destination = opts.destination || 'rural';
    this.initial = sources[this.destination]; // const
    this.pos = opts.pos || RiTa.pos(this.words);
    this.ignores = opts.ignores || defaultIgnores;
    this.stops = opts.stopWords || defaultStopWords;
    this.repIds = opts.replaceableIndexes || this.replaceableIndexes();
    this.words = {};
    this.history = {};
    this.initHistory();
  }

  // ---------------------- API -------------------------

  /* initialize words and histories */
  initHistory() {
    for (let dest of destinations) {
      this.words[dest] = this.sources[dest].slice();
      this.history[dest] = this.sources[dest].map(w => [w]);
    }
  }

  /* take one step either outgoing or incoming */
  step(outgoing, destination, idx) {
    return outgoing ? this.replace(idx) : this.restore(destination, idx);
  }

  /* total number of replacements made */
  numMods(destination) {
    return this.repIds.reduce((total, idx) =>
      total + this.history[destination][idx].length - 1, 0);
  }

  // -------------------- HELPERS -----------------------

  /* return true if word can be replaced */
  isReplaceable(word) {
    return word.length >= Rambler.minWordLength && !this.stops.includes(word);
  }

  /* return true if word does not equal its original value */
  isModified(idx) {
    return this.words[this.destination][idx] !== this.initial[idx];
  }

  /* does one new word replacement */
  replace(inIdx) {

    let choices, startMs = +new Date();

    if (typeof inIdx !== 'undefined') {
      choices = [inIdx]; // single index
    }
    else {
      // all possible replaceable indexes
      choices = RiTa.randomOrdering(this.repIds);
    }

    let idx, pos, word, next;
    let wordObj = {}, nextObj = {};

    for (let i = 0; i < choices.length; i++) {

      idx = choices[i];
      pos = this.pos[idx];

      let reject = false;

      for (let dest of destinations) {
        wordObj[dest] = this.words[dest][idx];
        if (!wordObj[dest]) throw Error('Replace Error: ' + dest
          + ' for index=' + idx + ' word: ' + this.words[dest][idx] + '\n\n' + JSON.stringify(choices));

        wordObj[dest] = wordObj[dest].toLowerCase();

        let similars = this.similars(wordObj[dest], pos);
        if (!similars) {
          reject = true;
          break;
        }

        // pick a random similar
        nextObj[dest] = RiTa.random(similars);

        if (/[A-Z]/.test(this.words[dest][idx][0])) {
          nextObj[dest] = RiTa.capitalize(nextObj[dest]); // keep caps
        }

        this.words[dest][idx] = nextObj[dest]; // do replacement
        this.history[dest][idx].push(nextObj[dest]); // add to history
      }
      if (reject) continue;

      break; // done
    }

    word = wordObj[this.destination];
    next = nextObj[this.destination];

    let ms = +new Date() - startMs; // tmp: for perf

    return { idx, word, next, pos, ms };
  }

  /* restores one word from history */
  restore(dest = this.destination, inIdx) {

    let choices;

    if (typeof inIdx !== 'undefined') {
      choices = [{ next: this.words[dest][inIdx], idx: inIdx }];
    }
    else {
      // get all possible restorations
      choices = this.repIds
        .map(idx => ({ idx, next: this.words[dest][idx] }))
        .filter(({ next, idx }) =>
          this.history[dest][idx].length > 1
          && this.isReplaceable(next));
    }

    if (!choices.length) return;
    // { // tmp-remove
    //   let msg = '';
    //   for (let i = 0; i < this.words[dest].length; i++) {
    //     if (this.isModified(i)) msg += i + ') '
    //       + ' orig=' + this.initial[i] + ', curr=' + this.words[dest][i] + '\n';
    //   } console.error('[FAIL] No choices: ' + msg);
    // }

    // pick a changed word to step back
    let { next, idx } = RiTa.random(choices);

    let word = next;
    let pos = this.pos[idx];
    let hist = this.history[dest][idx];

    // select newest from history
    hist.pop();
    next = hist[hist.length - 1];

    // do replacement
    this.words[dest][idx] = next;

    return { idx, word, next, pos };
  }

  /* find all similars via RiTa */
  similars(word, pos) {

    let rhymes = RiTa.rhymes(word, { pos });
    let sounds = RiTa.soundsLike(word, { pos });
    let spells = RiTa.spellsLike(word, { pos });
    let similars = [...rhymes, ...sounds, ...spells]
      .filter(next => next.length >= Rambler.minWordLength &&
        !word.includes(next) && !next.includes(word) &&
        !this.ignores.includes(next) && !this.stops.includes(next));

    if (similars.length > 1) return similars;
  }

  replaceableIndexes() { // [] of replaceable indexes
    let repids = [];
    this.initial.forEach((word, idx) => {
      if (this.isReplaceable(word)) repids.push(idx);
    });
    return repids;
  }
}

Rambler.minWordLength = 4;

const defaultIgnores = ["jerkies", "nary", "outta", "copras", "accomplis", "scad", "silly", "saris", "coca", "durn", "geed", "goted", "denture", "wales"];
const defaultStopWords = ["also", "over", "have", "this", "that", "just", "then", "under", "some",
  // added: DCH
  'these',
  "within",
  "after",
  "with",
  "there",
  "where",
  "while",
  "from",
  "whenever",
  // added: DCH, from 'urban' to sync number of replaceable indexes in each text
  "rushed",
  "prayer"
]