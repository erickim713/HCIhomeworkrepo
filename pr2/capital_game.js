// This allows the Javascript code inside this block to only run when the page
// has finished loading in the browser.

//when uploaded/refreshed, pull new question from the list.

new_question_from_list();
FocusOnInput();
 var autolist = [];
//jquery stuff
$(document).ready(function(){
   
   $('tbody').on('click', "#delete", function(){
    $(this).closest ('tr').remove ();
    });
    function autocompletelist(){
        for(var i=0; i<pairs.length;i++){
            autolist.push(pairs[i]["capital"]);
        }
    }
    $('input[type="radio"]').click(function(){
        if($(this).attr('id')=="all"){
            $(".wrong").show();
            $(".right").show();   
        }
        else if($(this).attr('id')== "correct"){
            $(".wrong").hide();
            $(".right").show();
        }
        else if($(this).attr('id')== "wrong"){
            $(".right").hide();
            $(".wrong").show();
        }
    })
    autocompletelist();
    $("#pr2__submit").click(function(){
        var question = $("#pr2__question").text();
        var answer = $("#pr2__answer").val();
        var checklist1 = pairs;
        for(var i=0; i<pairs.length;i++){
            if(checklist1[i].country == question){
                if(checklist1[i].capital == answer){
                    //correct
                    var correctmarkup = "<tr class='right'><td>" + question + "</td><td>"+answer+"</td><td><i class='fa fa-check' aria-hidden='true'></i><button id='delete' style='float: right;'>delete</button></td></tr>";
                    $("tbody").prepend(correctmarkup);
                    if(document.getElementById('wrong').checked) {
                        $(".wrong").show();
                        $(".right").show();
                        $("#all").prop("checked", true); 
                    }
                }
                else{
                    var wrongmarkup = "<tr class='wrong'><td>" + question + "</td><td class='wrong_capital'>" + answer + "</td><td>" + checklist1[i].capital + "<button id='delete' style='float: right;'>delete</button></td></tr>";
                    $("tbody").prepend(wrongmarkup);
                    if(document.getElementById('correct').checked) {
                        $(".wrong").show();
                        $(".right").show();
                        $("#all").prop("checked", true);  
                    }
                }
            }
        }
        reset_input_box();
        FocusOnInput();
        new_question_from_list();
    });

    $("#pr2__answer").autocomplete({
        source: autolist,
        minLength: 2,
        select: function(event,ui){
            var question = $("#pr2__question").text();
            var answer = $("#pr2__answer").val();
            var checklist1 = pairs;
            for(var i=0; i<pairs.length;i++){
                if(checklist1[i].country == question){
                    if(checklist1[i].capital == answer){
                        //correct
                        var correctmarkup = "<tr class='right'><td>" + question + "</td><td>"+answer+"</td><td><i class='fa fa-check' aria-hidden='true'></i><button id='delete' style='float: right;'>delete</button></td></tr>";
                        $("tbody").prepend(correctmarkup);
                        if(document.getElementById('wrong').checked) {
                            $(".wrong").show();
                            $(".right").show();
                            $("#all").prop("checked", true);
 
                        }
                    }
                    else{
                        var wrongmarkup = "<tr class='wrong'><td>" + question + "</td><td class='wrong_capital'>" + answer + "</td><td>" + checklist1[i].capital + "<button id='delete' style='float: right;'>delete</button></td></tr>";
                        $("tbody").prepend(wrongmarkup);
                        if(document.getElementById('correct').checked) {
                            $(".wrong").show();
                            $(".right").show();
                            $("#all").prop("checked", true);  
                        }
                    }
                }
            }
            reset_input_box();
            FocusOnInput();
            new_question_from_list();
            return false;
        }
    });
});


//make the input box blank.
function reset_input_box(){
    document.getElementById("pr2__answer").value = "";
}

//new question from the list.
function new_question_from_list(){
    var country_capital_pairs = pairs;
    var randomValue = Math.floor(Math.random() * country_capital_pairs.length);
    var output = country_capital_pairs[randomValue].country;
    document.getElementById("pr2__question").innerHTML = output;
}

//this focuses the input box.
function FocusOnInput(){
    document.getElementById("pr2__answer").focus();
}



//this resets the input box and refouses.


    // var newRow = printTable.insertRow(i+1);
    // var newCell1 = newRow.insertCell(0);
    // var newCell2 = newRow.insertCell(1);
    // var newIdeaTitle = ideas[i][0];
    // var newIdeaCount = ideas[i][1];


// submit_button();
// function bindEvents() {
//   var submitBtn = document.getElementById('submitBtn');

//   submitBtn.onclick = function() {
//     var inputBox = document.getElementById('myInput');

//     ideas.push([inputBox.value, 1]);
//     inputBox.value = '';

//     printIdeas();
//     printOptions();
//   }

//   var items = document.getElementsByClassName("item");

//   for(var i=0;i<items.length;i++) {
//     var item = items[i];

//     item.onclick = function() {
//       ideas[this.currentContent][1]++;

//       sortIdeas();
//       printIdeas();
//       printOptions();
//     } 
//   }
// }


