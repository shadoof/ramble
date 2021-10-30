class Rambler {

  constructor(words, opts = {}) {
    this.name = opts.name || 'rambler';
    this.words = Array.isArray(words) ? words : RiTa.tokenize(words);
    this.pos = opts.pos || RiTa.pos(this.words);
    this.initial = this.words.slice();
    this.history = this.words.map(w => [w]);
    this.ignores = opts.ignores || defaultIgnores;
    this.stops = opts.stopWords || defaultStopWords;
    this.repidxs = opts.replaceableIndices || this.replaceableIndices();
    console.log(`[Rambler] ${this.name} ${this.repidxs.length}/${this.words.length} replaceable`);
  }

  replaceableIndices() {
    let replaceables = [];
    this.initial.forEach((w, i) => this.isReplaceable(w) && replaceables.push(i));
    return replaceables;
  }

  /* number of replacements made */
  replacements() {
    return this.words.reduce((total, _, idx) =>
      total += this.history[idx].length - 1, 0);
  }

  isReplaceable(word) {
    return word.length >= Rambler.minWordLength && !this.stops.includes(word);
  }

  affinity(raw) {
    let total = this.words.reduce((t, w) => t += this.isReplaceable(w) ? 1 : 0, 0);
    let current = this.words.reduce((t, _, i) => t += this.isModified(i) ? 1 : 0, 0);
    let value = current / total;
    return raw ? value : Math.round((value * 10000)) / 100 + '%';
  }

  isModified(idx) {
    return this.words[idx] !== this.initial[idx];
  }

  // take one step either outgoing or incoming
  step(outgoing) {
    return outgoing ? this.replace() : this.restore();
  }

  similars(word, pos) {

    // find related words
    let rhymes = RiTa.rhymes(word, { pos });
    let sounds = RiTa.soundsLike(word, { pos });
    let spells = RiTa.spellsLike(word, { pos });
    let similars = [...rhymes, ...sounds, ...spells]
      .filter(next =>
        next.length > 3 &&
        !word.includes(next) &&
        !next.includes(word) &&
        !this.ignores.includes(next));
    if (similars.length > 1) return similars;
  }

  // does one new replacement
  replace() {

    let idx, word, pos, next;
    let ridx = RiTa.randi(this.words.length);

    // loop from a random spot
    for (let i = ridx; i < this.words.length + ridx; i++) {

      idx = i % this.words.length;
      word = this.words[idx].toLowerCase();
      pos = this.pos[idx];

      if (!this.isReplaceable(word)) continue;
      let similars = this.similars(word, pos);
      if (!similars) continue;

      // pick a random similar
      next = RiTa.random(similars);

      if (/[A-Z]/.test(this.words[idx][0])) {
        next = RiTa.capitalize(next); // keep capitals
      }

      this.words[idx] = next; // do replacement
      this.history[idx].push(next); // add to history

      break; // done
    }

    return { idx, word, next, pos, parent: this };
  }

  // replaces one from history
  restore() {

    // get all possible restorations
    let choices = this.words
      .map((next, idx) => ({ next, idx }))
      .filter(({ next, idx }) =>
        this.history[idx].length > 1
        && this.isReplaceable(next));

    if (!choices.length) throw Error('no choices: ' + this.words.filter(
      (w, i) => this.isModified(i)).map((w, i) => i + ') ' + w));

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

    if (hist.length === 1 && next !== hist[0]) console.warn('NOTICE****');
    /*  if (hist.length === 1 && next !== hist[0]) { // ???
         hist.push(hist[0]); // hack for last incoming
         return;
       }
    */
    return { idx, word, next, pos, parent: this };
  }
}

Rambler.minWordLength = 4;

const defaultIgnores = [
  "jerkies",
  "nary",
  "outta",
  "copras",
  "accomplis",
  "scad",
  "silly",
  "saris",
  "coca",
  "durn",
  "geed",
  "goted",
  "denture",
  "wales"
];

const defaultStopWords = [
  "also",
  "over",
  "have",
  "this",
  "that",
  "just",
  "then",
  "under",
  "some",
  "within",
  "rushed", // added to synch number of replacements in each text
  "prayer"  // added to synch number of replacements in each text
]