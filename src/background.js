// Import the libraries using the ES Module syntax.
// You will need to have the actual files (e.g., 'jisho.js', 'nihongo.js')
// in your extension's directory.
import JishoAPI from './unofficial-jisho-api.js';
import { parseKanji } from './nihongo.js';

const jisho = new JishoAPI();

// This function remains largely the same, but it's good practice
// to check if the API call was successful.
function getInfo(kanjis, tabId) {
  kanjis.forEach((kanji) => {
    jisho.searchForKanji(kanji).then((result) => {
      // Only send a message if a result was actually found
      if (result.found) {
        chrome.tabs.sendMessage(tabId, {
          action: "showKanji",
          kanji: result,
        });
      }
    });
  });
}

// Create the context menu when the extension is installed.
// This prevents errors from re-declaring the menu every time the service worker starts.
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "kanjidex-tooltip",
    title: "Search with Kanjidex",
    contexts: ["selection"],
  });
});

// The listener for when the context menu is clicked.
// The 'tab' object is passed directly, which is more efficient than querying for it.
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "kanjidex-tooltip" && info.selectionText) {
    const kanjis = parseKanji(info.selectionText);
    getInfo(kanjis, tab.id);
  }
});