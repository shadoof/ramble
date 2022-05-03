// progress bar color options
let redblue = ["#E9E9E9", "rgb(255, 97, 97, 0.6)", "rgba(178, 68, 68, 0.8)", "rgba(106, 166, 230, 0.6)", "rgba(54, 84, 116, 0.8)"];
let redgreen = ["rgb(0, 0, 0, 0.1)", "rgba(255, 97, 97, 0.6)", "rgba(178, 68, 68, 0.8)", "rgba(50, 187, 87, 0.6)", "rgb(30, 111, 52, 0.8)"];
let yellowblue = ["rgb(0, 0, 0, 0.1)", "rgba(0, 166, 233, 0.6)", "rgba(82, 158, 191, 0.8)", "rgba(245, 199, 0, 0.6)", "rgba(236, 192, 0, 0.8)"];
let pbdict, pbcolor = redblue;

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
  data += ' Rural=' + affvals.rural + ' Urban=' + affvals.urban;
  data += ' Shared=' + affvals.shared + ' Free=' + affvals.free;
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
  legendContent.innerHTML = `<p><svg class="rural-legend" style="fill: ${rurColReg}">
  <rect id="box" x="0" y="0" width="20" height="20"/>
  </svg> rural</p>
  <p><svg class="urban-legend" style="fill: ${urbColReg}">
  <rect id="box" x="0" y="0" width="20" height="20"/>
  </svg> urban</p>
  <p><svg class="overlap-legend">
  <rect style="fill: ${urbColReg}" id="box" x="0" y="0" width="20" height="20"/>
  <rect style="fill: ${rurColReg}" id="box" x="0" y="0" width="20" height="20"/>
  </svg> overlap</p>`;
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
  pbdict = opts.dict = loadProgress();

  const pbars = [];
  let progress = document.querySelectorAll(".progress");
  if (opts.color && opts.color.length !== progress.length) {
    throw Error('opts.color.length !== ' + progress.length);
  }
  progress.forEach((t, i) => {
    let pbar = new ProgressBar.Circle(t, {
      duration: opts.duration || 3000,
      // keep the absolute width same, see css options for strict bars
      strokeWidth: opts.strokeWidth || (opts.displayStrict
        ? (i > 0 ? (98 / (92 + 2 * ((i - 1) % 2 == 0 ? 2 : 1))) : 0.15)
        : (i > -1 ? (98 / (92 + 2 * ((i - 1) % 2 == 0 ? 2 : 1))) * 2 : 0.15)),
      easing: opts.easing || 'easeOut',
      trailColor: opts.trailColor || 'rgba(0,0,0,0)',
      color: opts.color && opts.color[i]
        ? opts.color[(opts.dict.divIndex[i][3])]
        : "#ddd"
    });

    if (displayStrict) { // state with outline only
      pbar.set(i ? 0 : 1);
    }
    else { // state with rural-reg only
      //      pbar.set(i!==4 ? 0 : 1);
      pbar.set(i ? 0 : 1);
      if (i === 0) pbar.set(1);
    }

    pbars.push(pbar);
  });
  let cidx = opts.dict.contentIndex;
  let strictBars = [
    progress[cidx.urbanStrict[3]],
    progress[cidx.background[3]],
    progress[cidx.ruralStrict[3]]
  ];
  if (opts.displayStrict) {
    strictBars.forEach(b => b.classList.remove("display-none"))
  } else {
    strictBars.forEach(b => b.classList.add("display-none"))
  }

  progress[cidx.background[3]].classList.remove("display-none"); // outer-line
  return pbars;
}


function loadProgress() {
  let labels = Array(5).map((l, i) => labels[i] = 'progressbar' + i);
  return displayStrict ? {
    divIndex:
      // [correspondingDivId, correspondingData, correspondingAffinityIndex, correspondingColorIndex]
      [
        [labels[0], "background", -1, 0],
        [labels[1], "urbanRegular", 0, 1],
        [labels[2], "urbanStrict", 1, 2],
        [labels[3], "ruralRegular", 2, 3],
        [labels[4], "ruralStrict", 3, 4],
      ],
    contentIndex:
    //  [correspondingDivId, correspondingAffinityIndex, correspondingColorIndex, correspondingDivIdx]
    {
      background: [labels[0], -1, 0, 0],
      urbanRegular: [labels[1], 0, 1, 1],
      urbanStrict: [labels[2], 1, 2, 2],
      ruralRegular: [labels[3], 2, 3, 3],
      ruralStrict: [labels[4], 3, 4, 4],
    }
  } : {
    divIndex:
      [
        [labels[0], "background", -1, 0],
        [labels[1], "urbanStrict", 1, 2],
        [labels[2], "urbanRegular", 0, 1],
        [labels[3], "ruralStrict", 3, 4],
        [labels[4], "ruralRegular", 2, 3],
      ],
    contentIndex:
    {
      background: [labels[0], -1, 0, 0],
      urbanStrict: [labels[1], 0, 2, 1],
      urbanRegular: [labels[2], 1, 1, 2],
      ruralStrict: [labels[3], 2, 4, 3],
      ruralRegular: [labels[4], 3, 3, 4],
    }
  };
}
