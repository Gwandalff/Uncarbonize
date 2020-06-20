
const tradeoffSlider = document.querySelector("#tradeoff");
const tradeoffActive = document.querySelector("#activation");
const imageTrigger   = document.querySelector("#trigger");

// Store the currently selected settings using browser.storage.local.
function storeSettings() {
    let energy = tradeoffSlider.value;
    let tradeoff = { energy: energy, accuracy: (100 - energy), doTradeoff: tradeoffActive.checked };
    const img = tradeoffActive.checked ? "../icon/on.svg" : "../icon/off.svg";
    imageTrigger.src = img;
    browser.browserAction.setIcon({ path: img });
    browser.storage.local.set({
        tradeoff
    });
}

// Update the options UI with the settings values retrieved from storage,
// or the default settings if the stored settings are empty.
function updateUI(restoredSettings) {
    tradeoffSlider.value = restoredSettings.tradeoff.energy;
    tradeoffActive.checked = restoredSettings.tradeoff.doTradeoff;
    const img = tradeoffActive.checked ? "../icon/on.svg" : "../icon/off.svg";
    imageTrigger.src = img;
}

function onError(e) {
    console.error(e);
}

// On opening the options page, fetch stored settings and update the UI with them.
browser.storage.local.get().then(updateUI, onError);

// Whenever the contents of the textarea changes, save the new values
tradeoffActive.addEventListener("change", storeSettings);
tradeoffSlider.addEventListener("change", storeSettings);
//imageTrigger.addEventListener("click", toggleActivation);