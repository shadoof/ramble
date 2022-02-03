class Reader {

  constructor(elements) {
    this.index = 0;
    this.reading = false;
    this.spans = Array.from(elements);
    console.log(this.spans.map(s => s.textContent));
    this.numVisibleWords = 13;
    RiTa.SILENCE_LTS = true; // no logging of lts
  }

  start() {
    clearTimeout(this.timeoutId);
    this.reading = true;
    this.step();
  }

  step() {
    if (!this.reading) return;
    let delayTime = this.timeToRead(this.spans[this.index].textContent);
    this.spans.forEach((ele,i) => {
      let endIdx = (this.index + this.numVisibleWords) % this.spans.length;
      let func = (i >= this.index && i < endIdx) ? 'add' : 'remove';
      ele.classList[func]('visible');
    });
    this.index = (this.index + 1) % this.spans.length;
    this.timeoutId = setTimeout(() => this.step(), delayTime);
  }

  stop() {
    this.reading = false;
    clearTimeout(this.timeoutId);
  }

  timeToRead(word, basetime = 150) {
    const syltime = basetime / 2; // most significant accumulator: these ms per syllable
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