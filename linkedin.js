//Essentially what this is going to do is chromes dev tools are going to go through the HTML elements and look for a line
//that says promoted and then hide that by finding it's parent element that wraps around our promoted element

function removeAds(){
    //Get all 'span' elements on page (all of them)
    //the document is the webpage and getelement function checks all elements for the "span" ones
    let spans = document.getElementsByTagName("span");

    for(let i = 0; i < spans.length; i++){

        //check if they contain the text 'promoted'
        if(spans[i].innerHTML.trim() === "Promoted"){
            //get the div that wraps around the entire ad
            //.closest() searches up through the HTML page until it gets to the outer div
            let card = spans[i].closest(".feed-shared-update-v2")
            console.log("found promoted")
            ads_blocked++
            console.log(ads_blocked)

            //Adds to the local variable everytime an ad is blocked
            chrome.storage.local.set({
                adsBlocked: ads_blocked
            });
            //if the classs changed and we can't find it with closest(), get the sixth parent
            //goes up 6 spaces and removes that hoping thats the div or gets rid of the ad (kind of fragile)
            if(card == null){
                let j = 0
                card = spans[i];

                while(j < 6){
                    card = card.parentNode;
                    j++;
                }
            }
            //made the div with the ad dissapear
            card.setAttribute("style","display: none !important");
        }
    }
}
//The tally for blocked ads resets everytime you reload Linkedin since this script gets run again and the varibale is reinitialized
let ads_blocked = 0
removeAds();

//ensure all ads will be removed as the user scrolls
//calls removeAds every 100 miliseconds
setInterval(function(){

    //Checks what the local storage value is, if null, then default to true
     chrome.storage.local.get("adBlockingEnabled", function(result) {

        let enabled = result.adBlockingEnabled ?? true;

        if (enabled) {
            removeAds();
        }

    });
},100)

