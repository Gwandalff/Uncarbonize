// Initialize the list of blocked hosts
let tradeoff = {energy : 0, accuracy : 100, doTradeoff : true};

// Set the default list on installation.
browser.runtime.onInstalled.addListener(details => {
  browser.storage.local.set({
    tradeoff: tradeoff
  });
});

// Get the stored list
browser.storage.local.get(data => {
  if (data.tradeoff) {
    tradeoff = data.tradeoff;
  }
});

// Listen for changes in the blocked list
browser.storage.onChanged.addListener(changeData => {
    tradeoff = changeData.tradeoff.newValue;
});

function redirect(requestDetails) {
    console.log("Redirecting: " + requestDetails.url);
    if(requestDetails.url.includes("http://127.0.0.1:8080/uncarbonize/")) return requestDetails;
    if(!tradeoff.doTradeoff) return requestDetails;

    return {
      redirectUrl: "http://127.0.0.1:8080/uncarbonize/"+tradeoff.energy+"/"+tradeoff.accuracy+"/"+encodeURIComponent(requestDetails.url)
    };
  }
  
  browser.webRequest.onBeforeRequest.addListener(
    redirect,
    {urls: ["<all_urls>"], types: ["main_frame"]},
    ["blocking"]
  );