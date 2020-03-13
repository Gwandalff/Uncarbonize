function adapt(doc,context) {
    if(doc["nodeName"] == "AUDIO"){
        if(doc["src"] != undefined && 
				!context.isFirstParty(doc.attributes.getNamedItem("src").nodeValue)){
            doc.parentNode.removeChild(doc)
            return
        }
    }
    if(doc["nodeName"] == "IMG"){
        if(doc["src"] != undefined && 
				!context.isFirstParty(doc.attributes.getNamedItem("src").nodeValue)){
            doc.parentNode.removeChild(doc)
            return
        }
    }
    if(doc["nodeName"] == "IFRAME"){
        if(doc["src"] != undefined && 
				!context.isFirstParty(doc.attributes.getNamedItem("src").nodeValue)){
            doc.parentNode.removeChild(doc)
            return
        }
    }
    if(doc["nodeName"] == "LINK"){
        if(doc["href"] != undefined && 
				!context.isFirstParty(doc.attributes.getNamedItem("href").nodeValue)){
            doc.parentNode.removeChild(doc)
            return
        }
    }
    if(doc["nodeName"] == "SOURCE"){
        if(doc["src"] != undefined && 
				!context.isFirstParty(doc.attributes.getNamedItem("src").nodeValue)){
            doc.parentNode.removeChild(doc)
            return
        }
        if(doc["srcset"] != undefined && 
				!context.isFirstParty(doc.attributes.getNamedItem("srcset").nodeValue)){
            doc.parentNode.removeChild(doc)
            return
        }
    }
    if(doc["nodeName"] == "SCRIPT"){
        if(doc["src"] != undefined && 
				!context.isFirstParty(doc.attributes.getNamedItem("src").nodeValue)){
            doc.parentNode.removeChild(doc)
            return
        }
    }
    if(doc["nodeName"] == "VIDEO"){
        if(doc["src"] != undefined && 
				!context.isFirstParty(doc.attributes.getNamedItem("src").nodeValue)){
            doc.parentNode.removeChild(doc)
            return
        }
    }
    for(var i = 0;i < doc.children.length; i++){
        adapt(doc.children[i],context)
    }
    return doc
}

function Context(pageURL){
    this.baseURI = getBaseURI(pageURL);
    this.domain = getDomain(this.baseURI);
    this.cleanURL = url => new URL(url, this.baseURI).href;
    this.isFirstParty = url => this.cleanURL(url).includes(this.domain);
}

function main(requestDetails) {    
    let filter = browser.webRequest.filterResponseData(requestDetails.requestId);
    let decoder = new TextDecoder("utf-8");
    let encoder = new TextEncoder();

    let context = new Context(requestDetails.url);

    filter.ondata = event => {
        let stringContainingHTMLSource = decoder.decode(event.data, {stream: true});
        console.log(stringContainingHTMLSource)
        // Just change any instance of Example in the HTTP response
        // to WebExtension Example.
        const parser = new DOMParser();
        var doc = parser.parseFromString(stringContainingHTMLSource, "text/html");

        doc["children"][0] = adapt(doc["children"][0], context);
        stringContainingHTMLSource = doc.documentElement.outerHTML;
        
        filter.write(encoder.encode(stringContainingHTMLSource));
        filter.disconnect();
    }
}

browser.webRequest.onBeforeRequest.addListener(
  main,
  {urls: ["<all_urls>"], types: ["main_frame"]},
  ["blocking"]
);
