$(document).ready(function(){
    var pairs = [];
    var autolist = [];
    //functions
    function autocompletelist(){
        for(var i=0; i<pairs.length;i++){
            autolist.push(pairs[i]["capital"]);
        }
    };
    function setup(result){
        var eachline = result.split("\n");
        //eachline is an array of 172 stuff in it
        var count;
        for(count = 1; count<eachline.length; count++){
            var parsed = eachline[count].split(",");
            var first = parsed[0];
            var second = parsed[1];
            var entry = {country:first, capital:second};
//            console.log(entry.capital);
            pairs.push(entry);
        }
        autocompletelist();
    }
    function trim(s){ 
        return ( s || '' ).replace( /^\s+|\s+$/g, '' ); 
    }
    function start_game(){
        new_question();
        FocusOnInput();
    }
    function clearentries(){
        document.getElementById("pr3_entries").remove();
    }
    function new_question(){
        var randomValue = Math.floor(Math.random() * pairs.length);
        var output = pairs[randomValue].country;
        document.getElementById("googlemap").src="https://www.google.com/maps/embed/v1/place?key=AIzaSyBk1wjoohydgdxOmjGcld1AOUbbqM_hJhU&q="+ output + "&maptype=satellite"
        document.getElementById("pr2__question").innerHTML = output;
    }
    function FocusOnInput(){
        document.getElementById("pr2__answer").focus();
    }
    function reset_input_box(){
        document.getElementById("pr2__answer").value = "";
    }
    function checktheanswer(question, answer){
        var i;
        
        for(i=0; i<pairs.length;i++){
            if(trim(pairs[i].country) == trim(question)){
                if(trim(pairs[i].capital)==trim(answer)){
                    //correct
                    var correctmarkup = "<tr class='right'><td id='question'>" + question + "</td><td id='answer'>"+answer+"</td><td><i class='fa fa-check' aria-hidden='true'></i><button id='delete' style='float: right;'>delete</button></td></tr>";
                    $("tbody").prepend(correctmarkup);
                    if(document.getElementById('wrong').checked) {
                        $(".wrong").show();
                        $(".right").show();
                        $("#all").prop("checked", true);
                    }
                }
                else{
                    var stringcapital = trim(pairs[i].capital);
                    var wrongmarkup = "<tr class='wrong'><td>" + question + "</td><td class='wrong_capital'>" + answer + "</td><td>" + stringcapital + "<button id='delete' style='float: right;'>delete</button></td></tr>";
                    $("tbody").prepend(wrongmarkup);
                    if(document.getElementById('correct').checked) {
                        $(".wrong").show();
                        $(".right").show();
                        $("#all").prop("checked", true);
                    }
                }
            }
        }
    }
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
    $("#pr2__answer").autocomplete({
        source: autolist,
        minLength: 2,
        select: function(event,ui){
            var question = $("#pr2__question").text();
            var answer = $("#pr2__answer").val();
            var checklist1 = pairs;
            for(var i=0; i<pairs.length;i++){
                if(checklist1[i].country == question){
                    if(trim(checklist1[i].capital) == answer){
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
            new_question();
            reset_input_box();
            FocusOnInput();
            return false;
        }
    });    
    $("#pr2__submit").click(function(){
        var question = $("#pr2__question").text();
        var answer = $("#pr2__answer").val();
        checktheanswer(question, answer);
//        autocompletelist();
        reset_input_box();
        FocusOnInput();
        new_question();
    });
    $.ajax({
        url: "https://s3.ap-northeast-2.amazonaws.com/cs374-csv/country_capital_pairs.csv",
        type: 'get',
        dataType: 'text',
        success: function(data) {
            //sets up the pairs filling.
            setup(data);
            start_game();
        }
    });    
});