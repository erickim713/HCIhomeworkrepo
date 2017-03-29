// This allows the Javascript code inside this block to only run when the page
// has finished loading in the browser.

function refresh(){
    var country_capital_pairs = pairs;
    var randomValue = Math.floor(Math.random() * country_capital_pairs.length);
    var output = country_capital_pairs[randomValue].country;
    document.getElementById("pr2__question").innerHTML = output;
}

$(document).ready(refresh());

function FocusOnInput(){
    document.getElementById("pr2__answer").focus();
}

function reset_field(){
    document.getElementById("pr2__answer").value="";
    refresh();
    FocusOnInput();
}