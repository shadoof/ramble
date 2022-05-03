const pbID2Color = [3, 2, 1, 0];

/* compute the affinity over 2 text arrays for a set of word-ids */
function originalAffinity(textA, textB, idsToCheck) {

  let matches = idsToCheck.reduce((total, idx) =>
    total + (textA[idx] === textB[idx] ? 1 : 0), 0);
  let raw = matches / idsToCheck.length;
  let fmt = (raw * 100).toFixed(2);// pad
  while (fmt.length < 5) fmt = '0' + fmt; 
  return raw * 100;
}

function keyhandler(e) {
  if (e.code === 'KeyI') {
    let stats = document.querySelector('#stats');
    let curr = window.getComputedStyle(stats);
    stats.style.display = curr.display === 'block' ? 'none' : 'block';
  }
  else if (e.code === 'KeyL') {
    logging = !logging;
    console.log('[KEYB] logging: ' + logging);
  }
  else if (e.code === 'KeyV') {
    verbose = !verbose;
    console.log('[KEYB] verbose: ' + verbose);
  }
  else if (e.code === 'KeyH') {
    highlights = !highlights;
    if (!highlights) {
      Array.from(spans).forEach(e => {
        e.classList.remove('incoming');
        e.classList.remove('outgoing');
      });
    }
    console.log('[KEYB] highlights: ' + highlights);
  }
  else if (e.code === 'KeyE') {
    if (logging) console.log('[KEYB] stop');
    stop();
  }
  else if (e.code === 'KeyR') {
    recursiveReplace = !recursiveReplace;
    console.log('[KEYB] recursiveReplace: ' + recursiveReplace);
  }
  else if (e.code === 'KeyS') {
    if (!state.stepMode) {
      state.stepMode = true;
      if (reader) reader.stop();
    }
    else {
      state.loopId = setTimeout(ramble, 1);
    }
    console.log('[KEYB] stepMode: ' + state.stepMode);
  }
  else if (e.code === 'KeyD') {
    reader.unpauseThen(update);
    console.log('[KEYB] skip-delay');
  }
}

/* update stats in debug panel */
function updateInfo() {
  let { updating, domain, outgoing, legs, maxLegs } = state;

  let displayWords = unspanify(); // get words

  // compare visible text to each source text
  let oldAffinities = [
    originalAffinity(sources.urban, displayWords, repIds),
    originalAffinity(sources.urban, displayWords, strictRepIds),
    originalAffinity(sources.rural, displayWords, repIds),
    originalAffinity(sources.rural, displayWords, strictRepIds),
  ];

  // TODO: (#45) use these affinities for new 4-part progress bar
  let affvals = Object.fromEntries(Object.entries(affinities())
    .map(([k, raw]) => {
      let fmt = (raw * 100).toFixed(2);  // pad
      while (fmt.length < 5) fmt = '0' + fmt;
      return [k, fmt];
    }));

  // Update the #stats panel
  let data = 'Domain: ' + domain;
  data += '&nbsp;' + (updating ? (outgoing ? '⟶' : '⟵') : 'X');
  data += `&nbsp; Leg: ${legs + 1}/${maxLegs}&nbsp; Affinity:`;
  data += ' rural=' + affvals.rural + ' urban=' + affvals.urban;
  data += ' shared=' + affvals.shared + ' free=' + affvals.free;
  domStats = domStats || document.querySelector('#stats');
  domStats.innerHTML = data;

  progressBars.forEach((p, i) => {
    if (i) p.animate((updating ? oldAffinities[pbdict.divIndex[i][2]] : 0) / 100,
      { duration: 3000 }, () => 0/*no-op*/);
  });
}

function createLegend() {
  domLegend = document.createElement("div");
  domLegend.id = "legend";
  domLegend.style.width = "900px"
  domLegend.style.height = "900px"
  let legendContent = document.createElement("div");
  legendContent.classList.add("legend-content");
  let rurColReg = pbcolor[pbdict.contentIndex.ruralRegular[2]];
  let urbColReg = pbcolor[pbdict.contentIndex.urbanRegular[2]];
  legendContent.innerHTML = `<p><svg class="rural-legend" style="fill: ${bandColors[0]}">
  <rect id="box" x="0" y="0" width="20" height="20"/>
  </svg> rural</p>
  <p><svg class="urban-legend" style="fill: ${bandColors[1]}">
  <rect id="box" x="0" y="0" width="20" height="20"/>
  </svg> urban</p>
  <p><svg class="overlap-legend">
  <rect style="fill: ${bandColors[2]}" id="box" x="0" y="0" width="20" height="20"/>
  </svg> shared</p>
  <p><svg class="overlap-legend">
  <rect style="fill: ${bandColors[3]}" id="box" x="0" y="0" width="20" height="20"/>
  </svg> free</p>`;
  domLegend.append(legendContent);
  domLegend.style.fontSize = (initMetrics.fontSize || 20.5) + 'px';
  document.querySelector("#display").append(domLegend)
}

// Downloads data to a local file (tmp)
function download(data, filename, type = 'json') {
  if (typeof data !== 'string') data = JSON.stringify(data);
  let file = new Blob([data], { type });
  let a = document.createElement("a"),
    url = URL.createObjectURL(file);
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(function () {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 0);
}

function createProgressBars(opts = {}) {
  // progress bars dict
  const pbars = [];
  let progress = document.querySelectorAll(".progress");
  if (opts.color && opts.color.length !== progress.length) {
    throw Error('opts.color.length !== ' + progress.length);
  }
  progress.forEach((t, i) => {
    let pbar = new ProgressBar.Circle(t, {
      duration: opts.duration || 3000,
      // keep the absolute width same, see css options for strict bars
      strokeWidth: opts.strokeWidth || (i > -1 ? (98 / (92 + 2 * ((i - 1) % 2 == 0 ? 2 : 1))) * 2 : 0.15),
      easing: opts.easing || 'easeOut',
      trailColor: opts.trailColor || 'rgba(0,0,0,0)',
      color: opts.color && opts.color[i]
        ? opts.color[pbID2Color[i]]
        : "#ddd"
    });
    pbars.push(pbar);
  });
  return pbars;
}
