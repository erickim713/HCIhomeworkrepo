$(document).ready(function(){
    var pairs = [];
    var autolist = [];
    var postsRef;
    var database;
    var counter = 0;
    //functions

    function initialize_firebase(){
        var config = {
            apiKey: "AIzaSyDgXDaJAyqZvcMqYFFzxLCRVnCBZV79lP0",
            databaseURL: "https://prhw-8ce7a.firebaseio.com/"
        };
        firebase.initializeApp(config);
        // console.log("firebase has been initialized");
        database = firebase.database();
        postsRef = database.ref("entry");
        // console.log("postsRef ready")
    }

    function insert_to_database(country, capital, answer){
        var country_entry = country;
        var capital_entry = capital;
        var correct = answer;
        //console.log(country + capital + answer);
        postsRef.push({
            country: country_entry,
            capital: capital_entry,
            answer: correct
        })
    }
    //this one recalls all entries.
    function recall_all_entries(){
        postsRef.once('value',function(snapshot){
            snapshot.forEach(function(childSnapshot) {
                var childData = childSnapshot.val();
                insert_to_table(childData.country, childData.capital, childData.answer);
            });
        });
    }

    function count_all_entries(){
        postsRef.on('value', function(snapshot) {
            var x = snapshot.val();
            for (var variable in x) {
                counter = counter + 1;
            }
        });

    }
    function remove_from_database(country, capital, answer){
        postsRef.once('value', function(snapshot){
            // console.log("1");
            // console.log(country);
            snapshot.forEach(function(childSnapshot){
                // console.log("2");
                // console.log(capital);
                var childData = childSnapshot.val();
                // console.log(childData);
                // console.log(answer);
                if(childData.country == country && childData.capital == capital && childData.answer == answer){
                    // console.log(childSnapshot.key);
                    postsRef.child(childSnapshot.key).remove()
                }
            })
        })
    }

    function autocompletelist(){
        for(var i=0; i<pairs.length;i++){
            autolist.push(pairs[i]["capital"]);
        }
    }
    function setup(result){
        var eachline = result.split("\n");
        //eachline is an array of 172 stuff in it
        var count;
        for(count = 1; count<eachline.length; count++){
            var parsed = eachline[count].split(",");
            var first = parsed[0];
            var second = parsed[1];
            var entry = {country:first, capital:second};
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
    function insert_to_table(question, input_answer, correct){
        if(correct == "correct"){
            var correctmarkup = "<tr class='right'><td class='question_slot' id='question'>" + question + "</td><td id='input_answer'>"+input_answer+"</td><td><i class='fa fa-check' aria-hidden='true'></i><button id='delete' style='float: right;'>delete</button></td></tr>";
            $("tbody").prepend(correctmarkup);
            if(document.getElementById('wrong').checked) {
                $(".wrong").show();
                $(".right").show();
                $("#all").prop("checked", true);
            }
        }
        else{
            var wrongmarkup = "<tr class='wrong'><td class='question_slot' id='question'>" + question + "</td><td id= 'input_answer' class='wrong_capital'>" + input_answer + "</td><td id='correct_answer'>" + correct + "<button id='delete' style='float: right;'>delete</button></td></tr>";
            $("tbody").prepend(wrongmarkup);
            if(document.getElementById('correct').checked) {
                $(".wrong").show();
                $(".right").show();
                $("#all").prop("checked", true);
            }
        }
    }
    function checktheanswer(question, input_answer){
        var i;

        for(i=0; i<pairs.length;i++){
            if(trim(pairs[i].country) == trim(question)){
                if(trim(pairs[i].capital)==trim(input_answer)){
                    //correct
                    insert_to_database(trim(question), trim(input_answer), "correct");
                    var correctmarkup = "<tr class='right'><td class='question_slot' id='question'>" + question + "</td><td id='input_answer'>"+input_answer+"</td><td><i class='fa fa-check' aria-hidden='true'></i><button id='delete' style='float: right;'>delete</button></td></tr>";
                    $("tbody").prepend(correctmarkup);
                    if(document.getElementById('wrong').checked) {
                        $(".wrong").show();
                        $(".right").show();
                        $("#all").prop("checked", true);
                    }
                }
                else{
                    insert_to_database(trim(question), trim(input_answer), trim(pairs[i].capital));
                    var stringcapital = trim(pairs[i].capital);
                    var wrongmarkup = "<tr class='wrong'><td class='question_slot' id='question'>" + question + "</td><td id= 'input_answer' class='wrong_capital'>" + input_answer + "</td><td id='correct_answer'>" + stringcapital + "<button id='delete' style='float: right;'>delete</button></td></tr>";
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
        //console.log($(this).closest('tr'));
        var row = $(this).closest('tr');
        var cells = row.find('td');
        $(this).closest ('tr').remove();
        var temp = cells[2].innerHTML.split('<')
        remove_from_database(cells[0].innerHTML, cells[1].innerHTML, temp[0]);
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
            var input_answer = $("#pr2__answer").val();
            var checklist1 = pairs;
            for(var i=0; i<pairs.length;i++){
                if(checklist1[i].country == question){
                    if(trim(checklist1[i].capital) == input_answer){
                        //correct
                        insert_to_database(trim(question), trim(input_answer), "correct");
                        var correctmarkup = "<tr class='right'><td class='question_slot' id='question'>" + question + "</td><td>"+input_answer+"</td><td><i class='fa fa-check' aria-hidden='true'></i><button id='delete' style='float: right;'>delete</button></td></tr>";
                        $("tbody").prepend(correctmarkup);
                        if(document.getElementById('wrong').checked) {
                            $(".wrong").show();
                            $(".right").show();
                            $("#all").prop("checked", true);

                        }
                    }
                    else{
                        insert_to_database(trim(question), trim(input_answer), trim(pairs[i].capital));
                        var wrongmarkup = "<tr class='wrong'><td class='question_slot' id='question'>" + question + "</td><td class='wrong_capital'>" + input_answer + "</td><td>" + checklist1[i].capital + "<button id='delete' style='float: right;'>delete</button></td></tr>";
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
        }
    });
    $("#pr2__submit").click(function(){
        var question = $("#pr2__question").text();
        var input_answer = $("#pr2__answer").val();
        checktheanswer(question, input_answer);
        reset_input_box();
        FocusOnInput();
        new_question();
    });

    document.onclick = function(event) {
        var target = event.target || event.srcElement;
        if(event.target.id == "question"){
            document.getElementById("googlemap").src="https://www.google.com/maps/embed/v1/place?key=AIzaSyBk1wjoohydgdxOmjGcld1AOUbbqM_hJhU&q="+ target.innerHTML + "&maptype=satellite";
        }
    };

    $.ajax({
        url: "https://s3.ap-northeast-2.amazonaws.com/cs374-csv/country_capital_pairs.csv",
        type: 'get',
        dataType: 'text',
        success: function(data) {
            //sets up the pairs filling.
            setup(data);
            initialize_firebase();
            recall_all_entries();
            start_game();
        }
    });
});
