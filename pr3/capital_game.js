$(document).ready(function(){
    var pairs = [];
    var autolist = [];
    var postsRef;
    var database;
    var undo_recent = 0;
    var redo_recent = 0;
    //functions
    function wholesetting(){
        settingfunction();
        undohistory.remove();
        undo_recent = 0;
    }
    function settingfunction(){
        redohistory.remove()
        redo_recent = 0
        if(undo_recent > 0){
            document.getElementById("pr3_undo").disabled = false;
        }
        if(undo_recent == 0){
            document.getElementById("pr3_undo").disabled = true;
        }
        if(redo_recent > 0){
            document.getElementById("pr3_redo").disabled = false;
        }
        if(redo_recent == 0){
            document.getElementById("pr3_redo").disabled = true;
        }
    }
    function initialize_firebase(){
        var config = {
            apiKey: "AIzaSyDgXDaJAyqZvcMqYFFzxLCRVnCBZV79lP0",
            databaseURL: "https://prhw-8ce7a.firebaseio.com/"
        };
        firebase.initializeApp(config);
        // console.log("firebase has been initialized");
        database = firebase.database();
        postsRef = database.ref("entry");
        undohistory = database.ref("undo");
        redohistory =  database.ref("redo");
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
        });
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
            snapshot.forEach(function(childSnapshot){
                // console.log("2");
                var childData = childSnapshot.val();
                // console.log(childData.capital);
                // console.log("should equal below");
                // console.log(capital)
                // console.log(childData.country);
                // console.log("should equal below");
                // console.log(country)
                // console.log(childData.answer);
                // console.log("should equal below");
                // console.log(answer);
                if(childData.country == country && childData.capital == capital && childData.answer == answer){
                    console.log("hi");
                    postsRef.child(childSnapshot.key).remove();
                }
            })
        })
    }
    function undohistory_submit_added(country, capital, answer){
        undohistory.push({
            index: undo_recent,
            action: "submit",
            country: country,
            capital: capital,
            answer: answer
        })
    }
    function undohistory_remove_added(country, capital, answer){
        undohistory.push({
            index: undo_recent,
            action: "remove",
            country: country,
            capital: capital,
            answer: answer
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
        postsRef.remove();
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
    function checktheanswerchecklist(question, input_answer, undo, checklist){
        for(var i=0; i<pairs.length;i++){
            if(checklist[i].country == question){
                if(trim(checklist[i].capital) == input_answer){
                    //correct
                    insert_to_database(trim(question), trim(input_answer), "correct");
                    if(undo == "no"){
                        console.log("not a undo");
                        undohistory_submit_added(trim(question), trim(input_answer), "correct");
                        undo_recent = undo_recent + 1;
                    }
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
                    if(undo == "no"){
                        console.log("not a undo");
                        undohistory_submit_added(trim(question), trim(input_answer), trim(pairs[i].capital));
                        undo_recent = undo_recent + 1;
                    }
                    var wrongmarkup = "<tr class='wrong'><td class='question_slot' id='question'>" + question + "</td><td class='wrong_capital'>" + input_answer + "</td><td>" + checklist[i].capital + "<button id='delete' style='float: right;'>delete</button></td></tr>";
                    $("tbody").prepend(wrongmarkup);
                    if(document.getElementById('correct').checked) {
                        $(".wrong").show();
                        $(".right").show();
                        $("#all").prop("checked", true);
                    }
                }
            }
        }
        if(undo_recent > 0){
            document.getElementById("pr3_undo").disabled = false;
        }
        if(undo_recent == 0){
            document.getElementById("pr3_undo").disabled = true;
        }
        if(redo_recent > 0){
            document.getElementById("pr3_redo").disabled = false;
        }
        if(redo_recent == 0){
            document.getElementById("pr3_redo").disabled = true;
        }
    }
    function checktheanswer(question, input_answer, undo){
        var i;

        for(i=0; i<pairs.length;i++){
            if(trim(pairs[i].country) == trim(question)){
                if(trim(pairs[i].capital)==trim(input_answer)){
                    //correct
                    insert_to_database(trim(question), trim(input_answer), "correct");
                    if(undo == "no"){
                        console.log("not a undo");
                        undohistory_submit_added(trim(question), trim(input_answer), "correct");
                        undo_recent = undo_recent + 1;
                    }
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
                    if(undo == "no"){
                        console.log("not a undo");
                        undohistory_submit_added(trim(question), trim(input_answer), trim(pairs[i].capital));
                        undo_recent = undo_recent + 1;
                    }
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
        if(undo_recent > 0){
            document.getElementById("pr3_undo").disabled = false;
        }
        if(undo_recent == 0){
            document.getElementById("pr3_undo").disabled = true;
        }
        if(redo_recent > 0){
            document.getElementById("pr3_redo").disabled = false;
        }
        if(redo_recent == 0){
            document.getElementById("pr3_redo").disabled = true;
        }
    }
    $('#pr3_clear').click(function(){
        clearentries();
        wholesetting();
    })

    function redo(){
        redohistory.once('value', function(snapshot){
            snapshot.forEach(function(childSnapshot){
                var childData = childSnapshot.val();
                //it's finding the right index
                if(redo_recent - 1 == childData.index){
                    if(childData.action == "submit"){
                        checktheanswer(childData.country, childData.capital, "no");
                        redo_recent = redo_recent - 1;
                        redohistory.child(childSnapshot.key).remove();
                        if(undo_recent > 0){
                            document.getElementById("pr3_undo").disabled = false;
                        }
                        if(undo_recent == 0){
                            document.getElementById("pr3_undo").disabled = true;
                        }
                        if(redo_recent > 0){
                            document.getElementById("pr3_redo").disabled = false;
                        }
                        if(redo_recent == 0){
                            document.getElementById("pr3_redo").disabled = true;
                        }
                    }
                    if(childData.action == "remove"){
                        console.log("problem");
                        var cells_1 = $('tbody tr').first().find('td');
                        var temp = cells_1[2].innerHTML.split('<')
                        if(trim(temp[0])==""){
                            undohistory_remove_added(cells_1[0].innerHTML, cells_1[1].innerHTML, "correct");
                            undo_recent = undo_recent + 1;
                            remove_from_database(cells_1[0].innerHTML, cells_1[1].innerHTML, "correct");
                        }
                        else{
                            undohistory_remove_added(cells_1[0].innerHTML, cells_1[1].innerHTML, trim(temp[0]));
                            undo_recent = undo_recent + 1;
                            remove_from_database(cells_1[0].innerHTML, cells_1[1].innerHTML, trim(temp[0]));
                        }
                        redohistory.child(childSnapshot.key).remove();
                        $('tbody tr').first().remove();
                        redo_recent = redo_recent - 1;
                        if(undo_recent > 0){
                            document.getElementById("pr3_undo").disabled = false;
                        }
                        if(undo_recent == 0){
                            document.getElementById("pr3_undo").disabled = true;
                        }
                        if(redo_recent > 0){
                            document.getElementById("pr3_redo").disabled = false;
                        }
                        if(redo_recent == 0){
                            document.getElementById("pr3_redo").disabled = true;
                        }
                    }
                }
            })
        })
    }

    function undo_added(x){

    }

    function redo_added(x){
        console.log("redo added!");
        x.index = redo_recent;
        redohistory.push(x)
        redo_recent = redo_recent + 1;
    }

    function undo(){
        console.log("undo!")
        undohistory.once('value', function(snapshot){
            // console.log("1");
            snapshot.forEach(function(childSnapshot){
                // console.log("2");
                var childData = childSnapshot.val();
                // console.log(childData.capital);
                // console.log("should equal below");
                // console.log(capital)
                // console.log(childData.country);
                // console.log("should equal below");
                // console.log(country)
                // console.log(childData.answer);
                // console.log("should equal below");
                // console.log(answer);
                if(undo_recent-1 == childData.index){
                    console.log("i am going to undo now");
                    if(childData.action == "remove"){
                        console.log("undoing remove");
                        redo_added(childData);
                        checktheanswer(childData.country, childData.capital, "yes")
                        undohistory.child(childSnapshot.key).remove();
                        undo_recent = undo_recent - 1;
                        if(undo_recent > 0){
                            document.getElementById("pr3_undo").disabled = false;
                        }
                        if(undo_recent == 0){
                            document.getElementById("pr3_undo").disabled = true;
                        }
                        if(redo_recent > 0){
                            document.getElementById("pr3_redo").disabled = false;
                        }
                        if(redo_recent == 0){
                            document.getElementById("pr3_redo").disabled = true;
                        }
                    }
                    if(childData.action == "submit"){
                        console.log("undoing submit");
                        redo_added(childData);
                        var cells_1 = $('tbody tr').first().find('td');
                        var temp = cells_1[2].innerHTML.split('<')
                        if(trim(temp[0])==""){
                            remove_from_database(cells_1[0].innerHTML, cells_1[1].innerHTML, "correct");
                        }
                        else{
                            remove_from_database(cells_1[0].innerHTML, cells_1[1].innerHTML, trim(temp[0]));
                        }
                        $('tbody tr').first().remove();
                        undohistory.child(childSnapshot.key).remove();
                        undo_recent = undo_recent - 1;
                        if(undo_recent > 0){
                            document.getElementById("pr3_undo").disabled = false;
                        }
                        if(undo_recent == 0){
                            document.getElementById("pr3_undo").disabled = true;
                        }
                        if(redo_recent > 0){
                            document.getElementById("pr3_redo").disabled = false;
                        }
                        if(redo_recent == 0){
                            document.getElementById("pr3_redo").disabled = true;
                        }
                    }

                }
            })
        })
    }

    $('tbody').on('click', "#delete", function(){
        //console.log($(this).closest('tr'));
        var row = $(this).closest('tr');
        var cells = row.find('td');
        $(this).closest ('tr').remove();
        var temp = cells[2].innerHTML.split('<')
        console.log(temp);
        if(trim(temp[0])==""){
            console.log("hi here");
            undohistory_remove_added(cells[0].innerHTML, cells[1].innerHTML, "correct");
            undo_recent = undo_recent + 1;
            remove_from_database(cells[0].innerHTML, cells[1].innerHTML, "correct");
            settingfunction()
        }
        else{
            undohistory_remove_added(cells[0].innerHTML, cells[1].innerHTML, trim(temp[0]));
            undo_recent = undo_recent + 1;
            remove_from_database(cells[0].innerHTML, cells[1].innerHTML, trim(temp[0]));
            settingfunction()
        }
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
            checktheanswerchecklist(question, input_answer, "no", checklist1);
            new_question();
            reset_input_box();
            FocusOnInput();
            return false;
        }
    });
    $("#pr2__submit").click(function(){
        var question = $("#pr2__question").text();
        var input_answer = $("#pr2__answer").val();
        checktheanswer(question, input_answer, "no");
        reset_input_box();
        FocusOnInput();
        new_question();
        settingfunction();
    });

    document.onkeydown = function(e) {
    var evtobj = window.event ? event : e
    if (evtobj.keyCode == 90 && evtobj.ctrlKey) {
        if(undo_recent > 0){
            console.log("undo!");
            undo();
            if(undo_recent > 0){
                document.getElementById("pr3_undo").disabled = false;
            }
            if(undo_recent == 0){
                document.getElementById("pr3_undo").disabled = true;
            }
            if(redo_recent > 0){
                document.getElementById("pr3_redo").disabled = false;
            }
            if(redo_recent == 0){
                document.getElementById("pr3_redo").disabled = true;
            }
        }
        else{
            console.log("undo ignored");
        }
    } else if (evtobj.keyCode == 89 && evtobj.ctrlKey) {
        if(redo_recent > 0){
            console.log("redo!")
            redo();
            if(undo_recent > 0){
                document.getElementById("pr3_undo").disabled = false;
            }
            if(undo_recent == 0){
                document.getElementById("pr3_undo").disabled = true;
            }
            if(redo_recent > 0){
                document.getElementById("pr3_redo").disabled = false;
            }
            if(redo_recent == 0){
                document.getElementById("pr3_redo").disabled = true;
            }
        }
        console.log("redo ignored");
    }
    };

    document.onclick = function(event) {
        var target = event.target || event.srcElement;
        if(event.target.id == "question"){
            document.getElementById("googlemap").src="https://www.google.com/maps/embed/v1/place?key=AIzaSyBk1wjoohydgdxOmjGcld1AOUbbqM_hJhU&q="+ target.innerHTML + "&maptype=satellite";
        }
        if(event.target.id == "pr3_undo"){
            console.log("before undo")
            undo();
            if(undo_recent > 0){
                document.getElementById("pr3_undo").disabled = false;
            }
            if(undo_recent == 0){
                document.getElementById("pr3_undo").disabled = true;
            }
            if(redo_recent > 0){
                document.getElementById("pr3_redo").disabled = false;
            }
            if(redo_recent == 0){
                document.getElementById("pr3_redo").disabled = true;
            }
        }
        if(event.target.id == "pr3_redo"){
            console.log("before redo");
            redo();
            if(undo_recent > 0){
                document.getElementById("pr3_undo").disabled = false;
            }
            if(undo_recent == 0){
                document.getElementById("pr3_undo").disabled = true;
            }
            if(redo_recent > 0){
                document.getElementById("pr3_redo").disabled = false;
            }
            if(redo_recent == 0){
                document.getElementById("pr3_redo").disabled = true;
            }
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
            wholesetting();
            if(undo_recent > 0){
                document.getElementById("pr3_undo").disabled = false;
            }
            if(undo_recent == 0){
                document.getElementById("pr3_undo").disabled = true;
            }
            if(redo_recent > 0){
                document.getElementById("pr3_redo").disabled = false;
            }
            if(redo_recent == 0){
                document.getElementById("pr3_redo").disabled = true;
            }
            start_game();
        }
    });
});
