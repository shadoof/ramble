class Reader {

  constructor(elements) {
    this.index = 0;
    this.timeoutId = 0;
    this.pauseForId = 0;
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

  pauseForThen(ms, func) {
    clearTimeout(this.pauseForId);
    this.pauseForId = setTimeout(func, ms);
    return false;
  }

  selection() {

    // line-based highlighter
    let lastSpan = this.spans[this.index - 1];
    if (lastSpan !== undefined && (!lastSpan.nextSibling
      || !lastSpan.nextSibling.nextSibling)) {
      return [lastSpan, this.spans[this.index]];
    }

    let sl = [], idx = this.index, currSpan;
    do {
      currSpan = this.spans[idx--]
      sl.unshift(currSpan);
    } while (currSpan !== currSpan.parentElement.firstChild)

    return sl;

    // the following would highlight a fixed number of words
    // with timeToRead delays for the leading word at this.index
    // return this.spans.slice(
    //this.index - this.numVisibleWords + 1, this.index + 1);
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
    clearTimeout(this.pauseForId);
    clearTimeout(this.timeoutId);
    this.spans.forEach(e => e.classList.remove('visible'));
  }

  timeToRead(word, basetime = 150) {
    const syltime = basetime / 2; // most significant accumulator: these ms per syllable
    if (digitsRE.test(word)) return basetime + word.length * syltime; // word is all number

    if (!RiTa.isPunct(word)) {
      // the following handles 'word's such as "well-illustrated"
      let syls = RiTa.syllables(word.replaceAll(hyphensRE, " ")).replaceAll(" ", "/");
      let time = basetime + syls.split('/').length * syltime; // syls * basic unit
      time += syls.split(splitRE).length * (syltime / 12); // add 1/12 of a syltime for each phoneme
      time += word.match(punctRE) ? basetime : 0; // add basetime to a punctuated word
      time += word.match(endsRE) ? basetime * 2 : 0; // or add more for the end of a period
      return time;
    }
    return word.match(endsRE) ? basetime * 3 : basetime * 1.5;
  }
}

const endsRE = /[.?!]$/, punctRE = /[,;:—]$/, hyphensRE = /[-–—]/g,
  splitRE = /[\/-]/, digitsRE = /^\d*[\d+.:,]*\d+$/;