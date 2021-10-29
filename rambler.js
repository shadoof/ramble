class Rambler {

  constructor(words, pos, opts = {}) {

    this.words = Array.isArray(words) ? words : RiTa.tokenize(words);
    this.history = this.words.map(w => [w]);
    this.stopWords = opts.stopWords || defaultStopWords;
    this.ignores = opts.ignores || defaultIgnores;
    //this.outgoing = typeof opts.outgoing === 'undefined' || opts.outgoing;
    this.partsOfSpeech = pos;
  }

  // returns number of replacements made
  replacements() {
    return this.words.reduce((total, _, idx) =>
      total += this.history[idx].length - 1, 0);
  }

  // take one step either outgoing or incoming
  step(outgoing) {
    return outgoing ? this.replace() : this.restore();
  }

  // does one new replacement
  replace() {
    let idx, next, word, pos;

    let r = Math.floor(Math.random() * this.words.length); // RiTa.randi(words.length);
    //r = 119;

    // loop from a random spot
    for (let i = r; i < this.words.length + r; i++) {

      idx = i % this.words.length;
      word = this.words[idx].toLowerCase();
      pos = this.partsOfSpeech[idx];

      if (word.length < 4) continue; // len >= 4

      // preserve some grammatical words
      if (this.stopWords.includes(word)) continue;

      // find related words
      let rhymes = RiTa.rhymes(word, { pos });
      let sounds = RiTa.soundsLike(word, { pos });
      let spells = RiTa.spellsLike(word, { pos });
      let similars = [...rhymes, ...sounds, ...spells];

      // only words with 2 or more similars
      if (similars.length < 2) continue;

      // pick a random similar
      next = RiTa.random(similars);

      if (next.length < 4) {
        continue; // skip if not >= 4 letters long
      }

      if (next.includes(word) || word.includes(next)) {
        continue; // skip substrings
      }

      if (defaultIgnores.includes(next)) continue;

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
      .filter(o => this.history[o.idx].length);

    if (!choices.length) return; // nothing to do

    // pick a changed word to step back
    let { next, idx } = RiTa.random(choices);

    
    let hist = this.history[idx];

    // select last from history
    next = hist.pop();
    let pos = this.partsOfSpeech[idx];
    let word = this.words[idx].toLowerCase();
    
    // do replacement
    this.words[idx] = next;

    if (hist.length === 1 && next !== hist[0]) {
      hist.push(hist[0]); // hack for last incoming
      return;
    }

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