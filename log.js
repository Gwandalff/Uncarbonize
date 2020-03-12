const nodeTypes = ["A","ABBR","ADDRESS","AREA","ARTICLE","ASIDE","AUDIO","B","BASE","BDI","BDO","BLOCKQUOTE",
   "BODY","BR","BUTTON","CANVAS","CAPTION","CITE","CODE","COL","COLGROUP","DATA","DATALIST","DD","DEL",
   "DETAILS","DFN","DIALOG","DIV","DL","DT","EM","EMBED","FIELDSET","FIGCAPTION","FIGURE","FOOTER","FORM",
   "H1","H2","H3","H4","HEAD","HEADER","HR","HTML","I","IFRAME","IMG","INPUT","INS","KBD","LABEL","LEGEND",
   "H5","LI","LINK","MAIN","MAP","MARK","META","METER","NAV","NOSCRIPT","OBJECT","OL","OPTGROUP","OPTION",
   "H6","OUTPUT","P","PARAM","PICTURE","PRE","PROGRESS","Q","RP","RT","RUBY","S","SAMP","SCRIPT","SECTION",
   "SELECT","SMALL","SOURCE","SPAN","STRONG","STYLE","SUB","SUMMARY","SUP","SVG","TABLE","TBODY","TD",
   "TEMPLATE","TEXTAREA","TFOOT","TH","THEAD","TIME","TITLE","TR","TRACK","U","UL","VAR","VIDEO","WBR"]

const triggerNodes = ["AUDIO","CANVAS","IMG","IFRAME","LINK","PICTURE","SCRIPT","VIDEO"]

function adapt(doc) {
    console.log(doc)
    if(doc["nodeName"] == "AUDIO"){}
    if(doc["nodeName"] == "CANVAS"){}
    if(doc["nodeName"] == "IMG"){}
    if(doc["nodeName"] == "IFRAME"){}
    if(doc["nodeName"] == "LINK"){}
    if(doc["nodeName"] == "PICTURE"){}
    if(doc["nodeName"] == "SCRIPT"){}
    if(doc["nodeName"] == "VIDEO"){}
}

function getDomain(url){
    const parts = url.split("/")[2].split(".")
    return parts[parts.length-2] + "." + parts[parts.length-1]
}

function main(requestDetails) {
    console.log(requestDetails)
    
    let filter = browser.webRequest.filterResponseData(requestDetails.requestId);
    let decoder = new TextDecoder("utf-8");
    let encoder = new TextEncoder();

    filter.ondata = event => {
        let stringContainingHTMLSource = decoder.decode(event.data, {stream: true});
        // Just change any instance of Example in the HTTP response
        // to WebExtension Example.
        const parser = new DOMParser();
        var doc = parser.parseFromString(stringContainingHTMLSource, "text/html")
        
        doc["children"][0] = adapt(doc["children"][0])
        
        //var oSerializer = new XMLSerializer();
        //stringContainingHTMLSource = oSerializer.serializeToString(doc);
        
        filter.write(encoder.encode(stringContainingHTMLSource));
        filter.disconnect();
    }
}

browser.webRequest.onBeforeRequest.addListener(
  main,
  {urls: ["<all_urls>"], types: ["main_frame"]},
  ["blocking"]
);
