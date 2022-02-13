/*
parameters:target, lines, opts
    opts.fontSize: float, fontSize in px
    opts.fontFamily: string, fontFamily string

return: an array of original line widths
*/
const initCircularTextDisplay = function (initR, target, lines, opts = {}) {
    const fontSize = opts.fontSize;
    const fontFamily = opts.fontFamily;
    const dbug = opts.debug;

    //------------------
    while(target.firstChild){
        target.removeChild(target.firstChild)
    }
    //--------------------- text
    let wi = 0;
    const ws = [];
    const textContainer = document.createElement("div");
    textContainer.id = "text-display";
    textContainer.style.width = initR * 2 + "px";
    textContainer.style.height = initR * 2 + "px";
    if (dbug) console.log(lines.length);
    lines.forEach((l, li) => {
        let thisLineDiv = document.createElement("div");
        thisLineDiv.classList.add("line");
        const thisFontSize = l.fontSize || fontSize;
        const thisFontFamliy = l.fontFamily || fontFamily;
        const thisWordSpacing = l.wordSpacing;
        if (thisFontSize) thisLineDiv.style.fontSize = thisFontSize + "px";
        if (thisFontFamliy) thisLineDiv.style.fontFamily = thisFontFamliy;
        if (thisWordSpacing) thisLineDiv.style.wordSpacing = thisWordSpacing + "em";
        thisLineDiv.style.top = (l.bounds[1] - l.bounds[3] / 2) + "px";
        thisLineDiv.id = "l" + li;
        //---------------------------------
        if (l.text && l.text.length > 0) {
            const wrapperSpan = document.createElement("span");
            wrapperSpan.style.display = "inline-block";
            wrapperSpan.classList.add("wrapper");
            let words = RiTa.tokenize(l.text);
            words.forEach((w, iil) => {
                if (iil > 0) {
                    if (!RiTa.isPunct(w)) wrapperSpan.append(" ");
                }
                let thisWordSpan = document.createElement("span");
                thisWordSpan.classList.add("word");
                thisWordSpan.id = "w" + wi;
                wi++;
                thisWordSpan.innerText = w;
                wrapperSpan.append(thisWordSpan);
            });
            thisLineDiv.append(wrapperSpan)
        }
        //----------------------------------
        textContainer.append(thisLineDiv);
        ws.push(l.bounds[2]);
    });
    target.append(textContainer);
    return ws;
}

/*
parameter: line, initLineW
return: none 
*/
const adjustWordSpace = function(line, initLineW, maxMin, padding, scaleRatio){
    if (!maxMin) maxMin = [-0.1, 1];
    line.classList.remove("max-word-spacing");
    line.classList.remove("min-word-spacing");
    let step = 0.01;
    let idx = parseInt((line.id).replace("l",""));
    let ws = parseFloat(window.getComputedStyle(line).wordSpacing.replace("px", ""));
    ws = ws/initFontSize; // px => em
    let oriW = initLineW[idx] - 2*padding;
    let currentW = line.firstChild.getBoundingClientRect().width;
    currentW  = currentW/scaleRatio;
    let tries = 0;
    while (Math.abs(oriW - currentW) > 5 && tries < 200) {
        if (oriW > currentW){
            ws += step;
        } else {
            ws -= step;
        }
        line.style.wordSpacing = ws + "em";
        currentW = line.firstChild.getBoundingClientRect().width;
        currentW = currentW/scaleRatio;
        tries++;
    }
    if (ws >= maxMin[1]){
        line.style.wordSpacing = maxMin[1] + "em";
        line.classList.add("max-word-spacing");
    }
    if (ws <= maxMin[0]){
        line.style.wordSpacing = maxMin[0] + "em";
        line.classList.add("min-word-spacing");
    }
}

/*
parameters:targetArr, opts
    opts.duration: float, in ms
    opts.strokeWidth: float,
    opts.easing: css str
    opts.trailColor: css color
    opts.color: array of css color
   
return: an array of original line widths
*/
const createProgressBars = function (targetArr, opts = {}) {
    const bars = [];
    targetArr.forEach((t, i) => {
        let thisProgressBar = new ProgressBar.Circle(t, {
            duration: opts.duration || 3000,
            strokeWidth: opts.strokeWidth || 1,
            easing: opts.easing || 'easeOut',
            trailColor: opts.trailColor || '#fafafa',
            color: opts.color && opts.color[i] ? opts.color[i] : "#ddd"
        });
        thisProgressBar.set((i + 1) * .20);
        bars.push(thisProgressBar);
    });
    return bars
}

/*
parameter: words, radius, opts = {}
    opts.offset : object: { x: x, y: y };
    opts.padding: float;
    opts.font: css str
    opts.fontSize: float, for init guess;
    opts.lineHeightScale: float;
    opts.wordSpacing: float, in em
return: array of lines
*/
const dynamicCircleLayout = function (words, radius, opts = {}) {
    let offset = opts.offset || { x: 0, y: 0 };
    let padding = opts.padding || 0;
    let fontName = opts.font || 'sans-serif';
    let lineHeightScale = opts.lineHeightScale || 1.2;
    let wordSpacing = opts.wordSpacing || 0.2;
    let fontSize = radius / 4, result;
    do {
        fontSize -= 0.1;
        result = fitToLineWidths
            (offset, radius - padding, words, fontSize, fontSize * lineHeightScale, fontName, wordSpacing);
    }
    while (result.words.length);

    console.log('Computed fontSize:', fontSize);

    return result.rects.map((r, i) => ({ fontSize, wordSpacing, bounds: r, text: result.text[i] }));
}

/*
parameter: offset, radius, words, fontSize, lineHeight, fontName
return: { text, rects, words }
*/
const fitToLineWidths = function (offset, radius, words, fontSize, lineHeight, fontName = 'sans-serif', wordSpacing) {
    //console.log('fitToLineWidths', fontSize);
    let tokens = words.slice();
    let text = [], rects = lineWidths(offset, radius, lineHeight);
    rects.forEach(([x, y, w, h], i) => {
        let data = fitToBox(tokens, w, fontSize, fontName, wordSpacing);
        if (!data) { // fail to fit any words
            text.push('');
            return;
        }
        text.push(data.text);
        tokens = data.words;
    });
    return { text, rects, words: tokens };
}

/*
parameter: words, width, fontSize, fontName
return: { words, text }
*/
const fitToBox = function (words, width, fontSize, fontName = 'sans-serif', wordSpacing) {
    //console.log('fitToBox', words, width, fontSize);
    let i = 1, line = {
        text: words[0],
        width: measureWidth(words[0], fontSize, fontName, wordSpacing)
    };
    if (line.width > width) return; // can't fit first word

    for (let n = words.length; i < n; ++i) {
        let next = ' ' + words[i];
        let nextWidth = measureWidth(next, fontSize, fontName, wordSpacing);
        if (line.width + nextWidth > width) {
            break; // done
        }
        line.text += next;
        line.width += nextWidth;
    }
    words = words.slice(i);
    if (RiTa.isPunct(words[0])) { // punct can't start a line
        line.text += words.shift();
    }
    return {
        words, text: RiTa.untokenize((line.text || '').split(' ')),
    };
}

//-----------------------------------helper
const measureWidth = function(text, fontSizePx = 12, fontName = font, wordSpacing) {
    let context = document.createElement("canvas").getContext("2d");
    context.font = fontSizePx + 'px ' + fontName;
    let spaceCount = text ? (text.split(" ").length - 1) : 0;
    return context.measureText(text).width + spaceCount* (wordSpacing*fontSizePx);
}

const chordLength = function (rad, d) {
    return 2 * Math.sqrt(rad * rad - (rad - d) * (rad - d));
}

const lineWidths = function (center, rad, lh) {
    let result = [];
    let num = Math.floor((rad * 2) / lh);
    let gap = ((rad * 2) - (lh * num))/2;
    for (let i = 0; i < num; i++) {
        let d = gap + lh/2 + (i * lh); // distance from top to the middle of the textline
        let cl = chordLength(rad, d > rad ? d + lh : d);
        let x = center.x - cl / 2;
        let y = center.y - (rad - d + lh/2);
        if (cl) {
            //console.log(i, d, d > r, cl);
            result.push([x, y, cl, lh]);
        }
    }
    return result;
}
