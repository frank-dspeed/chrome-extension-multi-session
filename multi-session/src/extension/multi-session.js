// Get All Cookies for the current url


// Save them inside 
chrome.storage.sync.set({key: value}, function() {
    console.log('Value is set to ' + value);
});
  
chrome.storage.sync.get(['key'], function(result) {
console.log('Value currently is ' + result.key);
});