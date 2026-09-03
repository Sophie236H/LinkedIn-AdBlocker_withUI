const button = document.getElementById("toggleButton");

//first time there will benothing to get so it sets it to true, then later gets the stored value
chrome.storage.local.get("adBlockingEnabled", function(result) {
    let enabled = result.adBlockingEnabled ?? true;
    //use the stuff on the left unless it's null, then use whats on the right

    updateButton(enabled);
    //calls updatebutton with enabeled being true or false

    //waiting for a click
    button.addEventListener("click", function() {
        enabled = !enabled;
        //changes enabled to the opposite of what is was

        chrome.storage.local.set({
            adBlockingEnabled: enabled
        });
        //sets the stored value

        updateButton(enabled);
        //runs update button on the new value
    });
});

//gets the local storged varibale with how many ads were blocked
chrome.storage.local.get("adsBlocked", function(result) {
    //if null then it sets it to zero, otherwise, get current value
    let count = result.adsBlocked ?? 0;
    //then it just sets the value it found(or zero) to the popup!
    document.getElementById("adsBlocked").innerText = count;
});

function updateButton(enabled) {
    if (enabled) {
        button.style.backgroundColor = "#B2D1BD";
        button.innerText = "Currently on! Turn Off?";
    } else {
        button.style.backgroundColor = "#FCACAC";
        button.innerText = "Currently off! Turn On?";
    }
}