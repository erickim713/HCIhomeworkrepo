// This allows the Javascript code inside this block to only run when the page
// has finished loading in the browser.

var pairs = [];
var lengthofpairs = 0;
var autolist = [];

$( document ).ready(function() {
    //entry for pairs
    function Object(country, capital){
        this.country = country;
        this.capital = capital;
    };
    //parsing for the pairs list
    function processData(result){
        var textlines = result.split("\n"); //split all the lines
        for (var line in textlines) {
            if(line != 0){
                var parsed = textlines[line].split(",");
                var country = parsed[0];
                var capital = parsed[1];
                var entry_line = new Object(country, capital);
                pairs.push(entry_line);
                lengthofpairs = lengthofpairs + 1;
            }
        }
        new_question(pairs, lengthofpairs);
        autocompletelist();
        FocusOnInput();
    };
    //getting the text csv file from the given link.

    $.ajax({
        url: "https://s3.ap-northeast-2.amazonaws.com/cs374-csv/country_capital_pairs.csv",
        type: 'get',
        dataType: 'text',
        success: function(data) {
            processData(data);
        }
    })


    $('tbody').on('click', "#delete", function(){
        $(this).closest ('tr').remove ();
    });



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
    });


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
        autocompletelist();
        reset_input_box();
        FocusOnInput();
        new_question(pairs, lengthofpairs);
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


function new_question(list, lengthofpairs){
    var randomValue = Math.floor(Math.random() * lengthofpairs);
    var output = list[randomValue].country;
    document.getElementById("googlemap").src="https://www.google.com/maps/embed/v1/place?key=AIzaSyBk1wjoohydgdxOmjGcld1AOUbbqM_hJhU&q="+ output + "&maptype=satellite"
    document.getElementById("pr2__question").innerHTML = output;
};

function FocusOnInput(){
    document.getElementById("pr2__answer").focus();
};

function reset_input_box(){
    document.getElementById("pr2__answer").value = "";
};

function autocompletelist(){
    for(var i=0; i<pairs.length;i++){
        autolist.push(pairs[i]["capital"]);
    }
};
