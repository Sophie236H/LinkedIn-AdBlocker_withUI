/*
    This event triggers when the browser has committed to loading a webpage.
    As opposed to e.g. webNavigation.onCompleted, this will start to run early
    so that we can begin to remove ads as soon as possible.
*/

chrome.webNavigation.onCommitted.addListener(function(tab) {
    //webNavigation detects navigation events (like a page started loading or something)
    //onCommited is a specific event and happens when crome commits to navigating to a page
    //The tab perameter contains info about the navigation event (such as tab id and url) - we are just calling it tab
    //this prevents script from running when other frames load

    if(tab.frameId == 0){
        //only run if the main webpage was navigated to not some outside sourse on the site
        chrome.tabs.query({active:true, lastFocusedWindow: true}, tabs => {
            //query is asking for information and specifically on the last active and viewed tab (for if you have multiple tabs open)
            //tabs is short for function(tabs)
            //get the url of the webpage (first tab in the tabs array)
            let url = tabs[0].url
            //remove unnecessary protocol definitions and www subdomain from url so that it is easy to work with, rplaces certain parts of the url string
             let parsedUrl = url.replace("https://", "")
                .replace("http://", "")
                .replace("www.", "")

            //remove path and queries e.g  linkedin.com/feed or linkedin.com?query=value
            //we only want the base domain so finds the / or ? and only takes whats before that so instead of youtube.com/4834629 we only get youtube.com 
            let domain = parsedUrl.slice(0, parsedUrl.indexOf('/') == -1 ? parsedUrl.length : parsedUrl.indexOf('/'))
            .slice(0, parsedUrl.indexOf('?') == -1 ? parsedUrl.length : parsedUrl.indexOf('?'));

            try {
                if (domain.length < 1 || domain === null || domain === undefined) {
                    return;
                    //if the domain is non existant then it going to catch an error
                } else if (domain == "linkedin.com") {
                    //if domain is not linkedin or youtube then it will go to that catch block
                    //otherwise it is going to run the function
                    runLinkedinScript();
                    return;
                }
            } catch (err) {
                //if there is an error it's just going to throw an error
                throw err;
            }
        })
    }
})

function runLinkedinScript() {
    chrome.tabs.query(
        { active: true, lastFocusedWindow: true },
        function(tabs) {
            //execute the function on the webpage
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                files: ["linkedin.js"]
            });
        }
    );
}


