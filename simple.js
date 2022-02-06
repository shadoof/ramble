const domDisplay = document.querySelector('#display');
const progressBars = createProgressBars();
let spans = spanify(lines);

function createProgressBars() {

  let numProgressBars = 4; // change to either 2 or 4
  let pbars = [...Array(numProgressBars).keys()]
    .map(i => makeProgressBar('#progress' + i));
  pbars.forEach((p, i) => p.set((i + 1) * .20));
  return pbars;
}

function makeProgressBar(ele, opts = {}) {

  return new ProgressBar.Circle(ele, {
    duration: opts.duration || 3000,
    strokeWidth: opts.strokeWidth || 1.1,
    easing: opts.easing || 'easeOut',
    trailColor: opts.trailColor || '#fafafa',
    color: opts.color || '#ddd'
  });
}

function spanify(lines) {

  let wordIdx = 0;
  let html = lines.reduce((html, l, i) => {
    let line = '';
    let ypos = l.bounds[1] - l.bounds[3] / 2;
    if (l.text) {
      let words = RiTa.tokenize(l.text);
      line = words.reduce((line, word, j) => {
        return line +
          `<span id="w${wordIdx++}" class="word">${word}</span>`
          + (j < words.length - 1 && RiTa.isPunct(words[j + 1]) ? '' : ' ');
      }, '');
    }
    return html + `<div id="l${i}"class="line" style="top: ${ypos}px;`
      + ` font-size:${l.fontSize}px;">${line}</div>`;
  }, '');

  domDisplay.innerHTML = html;
}
