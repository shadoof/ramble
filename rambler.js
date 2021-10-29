class Rambler {

  constructor(words, pos, opts = {}) {
    this.initial = Array.isArray(words) ? words : RiTa.tokenize(words);
    this.words = this.initial.slice();
    this.history = this.words.map(w => [w]);
    this.stopWords = opts.stopWords || defaultStopWords;
    this.ignores = opts.ignores || defaultIgnores;
    this.partsOfSpeech = pos;
  }

  // returns number of replacements made
  replacements() {
    return this.words.reduce((total, _, idx) =>
      total += this.history[idx].length - 1, 0);
  }

  isReplaceable(word) {
    return word.length > 3 && !this.stopWords.includes(word);
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
      pos = this.partsOfSpeech[idx];

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

    return { idx, word, next, pos };
  }

  // replaces one from history
  restore() {

    // get all possible restorations
    let choices = this.words
      .map((next, idx) => ({ next, idx }))
      .filter(({ next, idx }) =>
        this.history[idx].length > 1
        && this.isReplaceable(next));

    //console.log(choices);
    if (!choices.length) return; // nothing to do
    
    //choices.forEach(({next,idx}) => console.log(`${idx}) ${this.words[idx]} ${next}`));

    // pick a changed word to step back
    let { next, idx } = RiTa.random(choices);
 
    let word = next;
    let pos = this.partsOfSpeech[idx];
    let hist = this.history[idx];

    // select last from history
    hist.pop();
    next = hist[hist.length-1];

    // do replacement
    this.words[idx] = next;

    /*    if (hist.length === 1 && next !== hist[0]) {
         hist.push(hist[0]); // hack for last incoming
         return;
       }
    */
    return { idx, word, next, pos };
  }
}

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
  "over",
  "have",
  "this",
  "that",
  "just",
  "then",
  "under",
  "some"
]