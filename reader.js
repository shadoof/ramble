class Reader {

  constructor(elements) {
    this.index = 0;
    this.reading = false;
    this.spans = Array.from(elements);
    this.numVisibleWords = 13;
    RiTa.SILENCE_LTS = true; // no logging of lts
  }

  start() {
    clearTimeout(this.timeoutId);
    this.reading = true;
    this.step();
  }

  selection() {
    return this.spans.slice(this.index, this.index + this.numVisibleWords);
  }

  step() {
    if (!this.reading) return;
    let delayTime = this.timeToRead(this.spans[this.index].textContent);
    this.spans.forEach(e => e.classList.remove('visible'));
    this.selection().forEach(e => {
      e.classList.remove('outgoing'); // remove color
      e.classList.remove('incoming'); // remove color
      e.classList.add('visible'); // add dark color
    });
    this.index = (this.index + 1) % this.spans.length;
    this.timeoutId = setTimeout(() => this.step(), delayTime);
  }

  stop() {
    this.reading = false;
    clearTimeout(this.timeoutId);
    this.spans.forEach(e => e.classList.remove('visible'));
  }

  timeToRead(word, basetime = 150) {
    // most significant accumulator: these ms per syllable
    const syltime = basetime / 2;
    if (!RiTa.isPunct(word)) {
      let syls = RiTa.syllables(word); // array of syllables
      let time = basetime + syls.split('/').length * syltime; // syls * basic unit
      time += syls.split(splitRE).length * (syltime / 12); // add 1/12 of a syltime for each phoneme
      time += word.match(punctRE) ? basetime : 0; // add basetime to a punctuated word
      time += word.match(endsRE) ? basetime * 2 : 0; // or add more for the end of a period
      return time;
    }
    return word.match(endsRE) ? basetime * 3 : basetime * 1.5;
  }
}

const endsRE = /[.?!]/, punctRE = /[,;:—]/, splitRE = /[\/-]/;