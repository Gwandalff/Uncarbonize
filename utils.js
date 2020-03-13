const nodeTypes = ["A","ABBR","ADDRESS","AREA","ARTICLE","ASIDE","AUDIO","B","BASE",
"BDI","BDO","BLOCKQUOTE","BODY","BR","BUTTON","CANVAS","CAPTION","CITE","CODE",
"COL","COLGROUP","DATA","DATALIST","DD","DEL",   "DETAILS","DFN","DIALOG","DIV","DL",
"DT","EM","EMBED","FIELDSET","FIGCAPTION","FIGURE","FOOTER","FORM","H1","H2","H3","H4",
"HEAD","HEADER","HR","HTML","I","IFRAME","IMG","INPUT","INS","KBD","LABEL","LEGEND", "H5","LI","LINK","MAIN","MAP","MARK","META","METER","NAV","NOSCRIPT","OBJECT","OL",
"OPTGROUP","OPTION","H6","OUTPUT","P","PARAM","PICTURE","PRE","PROGRESS","Q",
"RP","RT","RUBY","S","SAMP","SCRIPT","SECTION","SELECT","SMALL","SOURCE","SPAN","STRONG",
"STYLE","SUB","SUMMARY","SUP","SVG","TABLE","TBODY","TD", "TEMPLATE","TEXTAREA","TFOOT",
"TH","THEAD","TIME","TITLE","TR","TRACK","U","UL","VAR","VIDEO","WBR"]

function getDomain(url){
    const parts = url.split("/")[2].split(".");
    return parts[parts.length-2] + "." + parts[parts.length-1];
}
function getBaseURI(url){
    const parts = url.split("/");
    return parts[0] + "/" + parts[1] + "/" + parts[2];
}
