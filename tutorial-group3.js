// Timer
var time;
function pad(val) { return val > 9 ? val : "0" + val; }

function resetTime() {
    time = Date.now();
}

timer = setInterval(function () {
    setTimeout(function () {
        var timediff = Math.floor((Date.now() - time) / 1000);
        document.getElementById("seconds").innerHTML = pad(timediff % 60);
        document.getElementById("minutes").innerHTML = pad(parseInt(timediff / 60, 10));

    }, 0);
}, 1000);

// end Timer

// read json file
function createCORSRequest(method, url) {
    var xhr = new XMLHttpRequest();
    if ("withCredentials" in xhr) {
      // Most browsers.
      xhr.open(method, url, true);
    } else if (typeof XDomainRequest != "undefined") {
      // IE8 & IE9
      xhr = new XDomainRequest();
      xhr.open(method, url);
    } else {
      // CORS not supported.
      xhr = null;
    }
    return xhr;
}

function readTextFile(url, callback) {
    var method = 'GET';
    var xhr = createCORSRequest(method, url);
    
    xhr.onload = function() {
        // Success code goes here.
        //alert("success!")
        callback(xhr.responseText);
      };
      
      xhr.onerror = function() {
        // Error code goes here.
       // alert("Error");
      };
      
      xhr.send();
}

var responseT;
// End read json file

// jquery for text answer
$(document).ready(function(){
    // Toggle ready-to-answer button
    $('#reason').on("keyup", enable_select);
    // Toggle submit answer button
    $('input:radio[name="Confidence"]').change(
        function(){
            if ($(this).is(':checked')) // && $('textarea#reason').val().length >= 20)
            {
                $('#answerBtn').prop("disabled", false);
            }
            else
            {
                $('#answerBtn').prop("disabled", true);
            }
        });
});
    
function enable_select()
{
    if($('textarea#reason').val().length >= 20)
      // && $("input:radio[name='Confidence']").is(":checked") )
    {
        $('#showOptionsBtn').prop("disabled", false);
    }
    else
    {
        $('#showOptionsBtn').prop("disabled", true);
    }
}
 
var answers_file = 'new_text/trial_answers.json';

function checkAccept()
{
    if (gup("assignmentId") == "ASSIGNMENT_ID_NOT_AVAILABLE" || gup("assignmentId") == "") {
        window.location = "https://hawk.eecs.umich.edu/VizStudy/instructions.html"; 
    }
}

function start()
{
    // Checking that the turker has accepted the HIT before starting the tutorial
    checkAccept();
    resetTime();
    $('#timer').show();
    $('#img_trial').show();
    $('#all-buttons').show();
    $('#dropdown').show();
    $('#showOptionsBtn').prop("disabled", true);
    $("#question-answer").innerHTML = '';
    file2 = 'new_text/tutorial.json';
    item_answers = [];
    readTextFile(file2, function (text) {
        var items = [];
        var qna = JSON.parse(text);
        for (var i = 0; i < qna.length; i++) {
            items.push('<option value="' + i + '">' + qna[i]["Question"] + '</option>');
            item_answers.push(qna[i]["Answer"]);
        }

        $('#question-answer').html(items.join(' '));
    });
}

var i = 0;
function nextt()
{	
    i++;
    switch(i) {
        
        case 1: document.getElementById("conv_set").style.border = "thick solid #0000FF";
                document.getElementById("instruction").innerHTML = "<b>Step 1 of 9</b>: Here you see an instructor trying to teach Rosie a game state but Rosie cannot see it.";
                break;
        case 2: document.getElementById("conv_set").style.border = "";
                document.getElementById("img_trial").style.border = "thick solid #0000FF";
                document.getElementById("instruction").innerHTML = "<b>Step 2 of 9</b>: This image represents what Rosie can see. <br/> There are a total of 7 objects. The solid green objects are \"blocks\" and the hollow brown objects with labels loc1, loc2 .. on them are \"locations\". Click Next. ";
                break;
        case 3: document.getElementById("instruction").innerHTML = "<b>Step 3 of 9</b>: All objects have unique ids. Here, the green blocks have ids 5, 6 and 7 and the brown locations have ids 1, 2, 3 and 4. <br/> The right panel shows <u>on</u> and <u>below</u> 'relations'. For e.g. (1 below 5) says Rosie can see object 1 is below object 5. <br/>Click Next.";
                break;
        case 4: document.getElementById("img_trial").style.border = "2px solid black";
                document.getElementById("question-answer").style.border = "thick solid #0000FF";
                document.getElementById("instruction").innerHTML = "<b>Step 4 of 9</b>: What does a frog mean? You can ask Rosie to <b>tell you</b> what it knows and sees in the image. Select \"What is frog?\" from the <b>left</b> question drop-down list.";
                $("#next").prop("disabled", true);
                break;
        case 7: $('#user-input-options').show();
                document.getElementById("img_trial").style.border = "2px solid black";
                document.getElementById("user-text-input").style.border = "thick solid #0000FF";
                document.getElementById("instruction").innerHTML = "<b>Step 8 of 9</b>: Given all the information you have seen, please enter why you think Rosie cannot see what the mentor said. When you click Continue, both the dropdown lists will disappear. \n Click \"Continue\" after you write the answer.";
                $("#next").prop("disabled", true);
                break;
    }
}

function change_image(clicked_id)
{
    var src = "";
    switch (clicked_id) {
        case "properties": src = "new_images/tutorial_annotations.png";
            break;
        case "original": src = "new_images/tutorial_viz.png";
            break;
        case "frog": src = "new_images/tutorial_frog.png";
            break;
    }
    document.getElementById("img_trial").setAttribute("src", src);
    if(i === 5 && clicked_id === "properties")
    {
        document.getElementById("answer").style.border = "";
        document.getElementById("img_trial").style.border = "thick solid #0000FF";
        document.getElementById("instruction").innerHTML = "<b>Step 6 of 9</b>: You can now see that Rosie can see objects 5, 6 and 7 are green blocks and object 4 is a location that does not have a color. You can ask Rosie to show you which objects are frogs. Select \"Show me which objects are frogs\" from the <b>right</b> drop-down.";
        i++;
    }

    if(i === 6 && clicked_id === "frog")
    {
        document.getElementById("instruction").innerHTML = "<b>Step 7 of 9</b>: Rosie highlights the objects that are frogs in the image. It also shows you which objects are frogs on the bottom of the right panel. Click Next to proceed.";
        $("#next").prop("disabled", false);
    }
}

function printAnswer(option) {
    document.getElementById("answer").innerHTML = "Answer: " + item_answers[document.getElementById("question-answer").value];
    if(i === 4 && $("#question-answer option:selected").text() === "What is frog?")
    {
        document.getElementById("question-answer").style.border = "";
        document.getElementById("answer").style.border = "thick solid #0000FF";
        document.getElementById("instruction").innerHTML = "<b>Step 5 of 9</b>: This means that Rosie thinks that the objects that are green and are blocks are frogs. Feel free to explore the other questions you can ask. <br/> After that, Select \"Show me the object properties\" option from the <b>right</b> drop-down to see the object properties that Rosie can see.";
        i++;
    }
}

function readyToAnswer() {
    // Only show answer options and image - no transparency or text answer when the user says they are ready to answer
    $('#all-buttons').hide();
    $('#dropdown').hide();
    $('#user-text-input').hide();
    // past work
    $('#showOptionsBtn').hide();
    $('#user-input').show();
    //image border reset
    document.getElementById("img_trial").style.border = "2px solid black"
    document.getElementById("instruction").innerHTML = "<b>Step 9 of 9</b>: In the study, you may or may not have the question dropdown, show buttons or the display panel available to you based on the example. <br/> Select the correct answer to move on to the main task."
}

var j = 0;
function submitAnswer()
{
    var x = $("#user-answer option:selected").val();
    if (x === "2")
    {
        document.getElementById("correct").innerHTML = "That is the correct answer! You will be taken to the main task in 3 seconds."
	var ytime = setTimeout(function() {
		// Send to main task.
	        window.location = "https://hawk.eecs.umich.edu/VizStudy/index-group3.html" + "?workerId=" + gup("workerId") + "&assignmentId=" + gup("assignmentId") +"&turkSubmitTo="+gup("turkSubmitTo")+"&hitId="+gup("hitId");
	}, 3000);
    }
    else if(j === 0)
    {
        document.getElementById("correct").innerHTML = "That is not the correct answer. You have one more try, please try again."
        j++;
    }
    else if (j > 0)
    {	
        $('#answerBtn').prop("disabled", true);
        document.getElementById("correct").innerHTML = "That is not the correct answer. The correct answer is \"The green block 7 is not on location 3\". Thank you for trying this tutorial. This HIT will be submitted for you in the next 5 seconds.";
        var xtime = setTimeout(function() {
            $("#mturk_form").submit();
        }, 5000);
    }
}
