/*
parameters:target, lines, opts
    opts.padding: float, padding in px
    opts.fontSize: float, fontSize in px
    opts.fontFamily: string, fontFamily string

return: void
*/
const initCircularDisplay = function(target, lines, opts = {}){
    const padding = opts.padding || 5;
    const fontSize = opts.fontSize;
    const fontFamily = opts.fontFamily;

    const textContainer = document.createElement("div");
    textContainer.classList.add("circularTextContainer");
    let wi = 0;
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
        target.append(thisLineDiv);
    });
}