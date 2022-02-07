/*
parameters:target, lines, opts
    opts.fontSize: float, fontSize in px
    opts.fontFamily: string, fontFamily string

return: an array of original line widths
*/
const initCircularTextDisplay = function(target, lines, opts = {}){
    const fontSize = opts.fontSize;
    const fontFamily = opts.fontFamily;
    const dbug = opts.debug;

    //--------------------- text
    let wi = 0;
    const ws = [];
    const textContainer = document.createElement("div");
    textContainer.id = "text-display";
    if (dbug) console.log(lines.length);
    lines.forEach((l, li) => {
        let thisLineDiv = document.createElement("div");
        thisLineDiv.classList.add("line");
        const thisFontSize = l.fontSize || fontSize;
        const thisFontFamliy = l.fontFamily || fontFamily;
        if (thisFontSize) thisLineDiv.style.fontSize = thisFontSize + "px";
        if (thisFontFamliy) thisLineDiv.style.fontFamily = thisFontFamliy;
        thisLineDiv.style.top = (l.bounds[1] - l.bounds[3] / 2) + "px";
        thisLineDiv.id = "l" + li;
        //---------------------------------
        if (l.text && l.text.length > 0) {
            let words = RiTa.tokenize(l.text);
            words.forEach((w, iil) => {
                if (iil > 0) {
                    if (!RiTa.isPunct(w)) thisLineDiv.append(" ");
                }
                let thisWordSpan = document.createElement("span");
                thisWordSpan.classList.add("word");
                thisWordSpan.id = "w" + wi;
                wi ++;
                thisWordSpan.innerText = w;
                thisLineDiv.append(thisWordSpan);
            });
        }
        //----------------------------------
        textContainer.append(thisLineDiv);
        ws.push(l.bounds[3]);
    });
    target.append(textContainer);
    return ws
}

/*
parameters:targetContainer, number, opts
    opts.duration: float, in ms
    opts.strokeWidth: float,
    opts.easing: css str
    opts.trailColor: css color
    opts.color: css color

return: an array of original line widths
*/
const createProgressBars = function(targetContainer, number, opts = {}){
    const bars = []
    for (let i = 0; i <number; i++) {
        const progressBarPlaceHolder = document.createElement("div");
        progressBarPlaceHolder.id = "progress" + i;
        progressBarPlaceHolder.classList.add("progress");
        targetContainer.append(progressBarPlaceHolder);
        let thisProgressBar = new ProgressBar.Circle(progressBarPlaceHolder, {
            duration: opts.duration || 3000,
            strokeWidth: opts.strokeWidth || 1.1,
            easing: opts.easing || 'easeOut',
            trailColor: opts.trailColor || '#fafafa',
            color: opts.color || '#ddd'
        });
        thisProgressBar.set((i + 1) * .20);
        bars.push(thisProgressBar);
    }
    return bars
}

/*
parameter: 

return: none
*/
const updateProgressBars = function(){
    
}
