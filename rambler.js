class Rambler {

  constructor(words, opts = {}) {
    this.words = words;
    this.name = opts.name || 'Rambler';
    this.pos = opts.pos || RiTa.pos(this.words);
    this.initial = this.words.slice();
    this.history = this.words.map(w => [w]);
    this.ignores = opts.ignores || defaultIgnores;
    this.stops = opts.stopWords || defaultStopWords;
    this.repIds = opts.replaceableIndexes || this.replaceableIndexes();
    console.log(`[Rambler] ${this.name} (${this.repIds.length}/${this.words.length} reps)`);
  }

  // ---------------------- API -------------------------

  /* take one step either outgoing or incoming */
  step(outgoing) {
    return outgoing ? this.replace() : this.restore();
  }

  /* total number of replacements made */
  numModifications() {
    return this.words.reduce((total, _, idx) =>
      total + this.history[idx].length - 1, 0);
  }

  /* total number of words differing from initial text */
  numWordsModified() {
    return this.words.reduce((total, word, idx) => {
      return total + (this.initial[idx] !== word ? 1 : 0)
    }, 0);
  }

  affinity(raw) { // [JC] ?
    let value = this.numWordsModified() / this.repIds.length;
    return raw ? value : Math.round((value * 10000)) / 100 + '%';
  }

  // -------------------- HELPERS -----------------------

  /* return true if word does not equal its original value */
  isReplaceable(word) {
    return word.length >= Rambler.minWordLength && !this.stops.includes(word);
  }

  /* return true if word does not equal its original value */
  isModified(idx) {
    return this.words[idx] !== this.initial[idx];
  }

  /* does one new word replacement */
  replace() {

    let idx, word, pos, next;

    // possible replaceable indexes
    let choices = RiTa.randomOrdering(this.repIds);

    for (let i = 0; i < choices.length; i++) {

      idx = choices[i];
      pos = this.pos[idx];
      word = this.words[idx].toLowerCase();

      // JC: do we want to accept stop words as replacements?
      if (!this.isReplaceable(word)) continue;

      let similars = this.similars(word, pos);
      if (!similars) continue;

      // pick a random similar
      next = RiTa.random(similars);

      if (/[A-Z]/.test(this.words[idx][0])) {
        next = RiTa.capitalize(next); // keep caps
      }

      this.words[idx] = next; // do replacement
      this.history[idx].push(next); // add to history

      break; // done
    }

    return { idx, word, next, pos };
  }

  /* restores one word from history */
  restore() {

    // get all possible restorations
    let choices = this.repIds
      .map(idx => ({ idx, next: this.words[idx] }))
      .filter(({ next, idx }) =>
        this.history[idx].length > 1
        && this.isReplaceable(next));

    if (!choices.length) {
      let msg = '';
      for (let i = 0; i < this.words.length; i++) {
        if (this.isModified(i)) msg += i + ') ' 
          + ' orig=' + this.initial[i] + ', curr=' + this.words[i] + '\n';
      }
      console.error('[FAIL] No choices: ' + msg);
      return;
    }

    // pick a changed word to step back
    let { next, idx } = RiTa.random(choices);

    let word = next;
    let pos = this.pos[idx];
    let hist = this.history[idx];

    // select newest from history
    hist.pop();
    next = hist[hist.length - 1];

    // do replacement
    this.words[idx] = next;

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
        !this.ignores.includes(next));

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
  // added: DCH, from 'urban' to sync number of replaceable indexes in each text
  "rushed",
  "prayer"
]