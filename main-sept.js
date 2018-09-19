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

// Global variables
var curr_exp = -1;
var item_answers = [];
var user_answer_list = [];
var data_val = {}  // store each example data in this array to be stored in csv

Shuffle = function (o) {
    for (var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};

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

// Text input per example
var answers_file = 'new_text/answers.json';
var viz_file = 'new_text/viz.json';
var response_file = 'new_text/rosie_responses.json'
var examples = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

// Shuffled list of experiments
//var textOrder = Shuffle(examples);

// function readTextFile(file, callback) {
//     var rawFile = new XMLHttpRequest();
//     rawFile.overrideMimeType("application/json");
//     rawFile.open("GET", file, true);
//     rawFile.onreadystatechange = function () {
//         if (rawFile.readyState === 4 && rawFile.status == "200") {
//             callback(rawFile.responseText);
//         }
//     }
//     rawFile.send(null);
// }

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

//  var url = 'https://preetiramaraj.github.io/vizStudy/text/answers.json';
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

function loadData() {
    $('#startBtn').show();
    $('#nextBtn').hide();
    examples.splice(6, 0, 13);
   // examples.splice(12, 0, 18); // PR - todo consider putting only one check
    // Populate possible answers
    readTextFile(answers_file, function (data1) {
        var ans_list = JSON.parse(data1);
        for (var i = 0; i < ans_list.length; i++) {
            var individual_answers = [];
            for (var j = 0; j < 4; j++) {
                individual_answers.push('<option value="' + (j + 1) + '">' + ans_list[i][(j + 1).toString()] + '</option>');
            }
            user_answer_list.push(individual_answers);
        }
    });
}

function startExperiment() {
    $('#instructions').hide();
    $('#startBtn').hide();
    $('#timer').show();
    $('#exampleid').show();
    // Setting up the first experiment
    $("#showOptionsBtn").show();
    $('#nextBtn').show();
    data_val["example-order"] = examples;
    next();
    startTime = new Date();
}

function next() { // This function will figure out which tab to display
    // Defining array variables in order to vary the condition
    var arr_none = [1, 5, 9, 13];//, 14];
    var arr_qa = [2, 4, 6, 8, 10, 12];
    var arr_viz = [3, 4, 7, 8, 11, 12];
    var curr_dictionary = {};
    resetTime();
    curr_dictionary["start_time"] = Date.now();

    // Resetting display
    $('#all-buttons').hide();
    $('#dropdown').hide();
    $('#visual-area').hide();
    // Resetting answer buttons    
    $('#user-text-input').show();
    $('#showOptionsBtn').show();
    $('#user-input').hide();
    curr_dictionary["show-options-time"] = [];
    $('#reason').val('');
    $('input[name=Confidence]').prop('checked',false);
    // Disable readytoanswer and submit button
    $('#showOptionsBtn').prop("disabled", true);
    $('#answerBtn').prop("disabled", true);
    // To refresh buttons for the new example
    document.getElementById("visual-buttons").innerHTML = '';
    // To refresh answer field
    document.getElementById('answer').innerHTML = '';

    curr_exp = curr_exp + 1;
    var curr_id = examples[curr_exp];
    if (curr_exp > 0) {
        $("#conv_set" + examples[curr_exp - 1].toString()).hide();
        $("#img_set" + examples[curr_exp - 1].toString()).hide();
    }

    if (curr_exp === 13) {
        exit_to_survey();
    }
    else {
        document.getElementById('serialno').innerHTML = (curr_exp+1).toString() + ".";
        //document.getElementById('serialno').innerHTML += " " + curr_id.toString();

        $("#conv_set" + curr_id.toString()).show();
        $("#img_set" + curr_id.toString()).show();

        if (arr_none.indexOf(curr_id) == -1) {
            $('#all-buttons').show();
        } else {
            // Control examples
            if(curr_id === 13) // || curr_id === 14) 
            {
                $('#reason').val('PLEASE NOTE. You are not required to figure why the robot failed here. You are expected to answer the question yourself. Select the right option below.');
                $('#showOptionsBtn').prop("disabled", false);
            }
        }
        // Add condition to check if q&a needs to be shown
        if (arr_qa.indexOf(curr_id) != -1) {
            // Add Rosie's output of unsatisfied condition to Rosie's response
            readTextFile(response_file, function (text1) {
                var responses = JSON.parse(text1);
                document.getElementById("conv_set" + curr_id).innerHTML += responses.find(item => item.id === curr_id).response;
            });

            // Show question-list
            $('#dropdown').show();
            item_answers = [];
            $("#question-answer").innerHTML = '';
            curr_dictionary["questions"] = [];
            curr_dictionary["questions_time"] = [];

            // Reading json file to populate questions list
            file2 = 'new_text/' + curr_id.toString() + '.json';
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

        // Adding condition to check if visualization is part of it
        if (arr_viz.indexOf(curr_id) != -1) {
            // Set image to show with display mechanisms
            document.getElementById("img_set" + curr_id).src = "new_images/img_" + curr_id + "_viz.png";

            // Showing visual explanation options
            $('#visual-area').show();
            curr_dictionary["viz"] = [];
            curr_dictionary["viz_time"] = [];

            // Reading json file to create visualization buttons
            readTextFile(viz_file, function (text1) {
                var viz_options = JSON.parse(text1);
                var jobject = viz_options.find(item => item.id === curr_id);
                for (var x = 0; x < jobject.values.length; x++) {
                    var button1 = create_button(curr_id, jobject.values[x]);
                    document.getElementById("visual-buttons").appendChild(button1);
                }
            });
        }

        // Showing final answer options
        $('#user-input-options').show();

        // Populate example-level-answers
        $('#user-answer').html((user_answer_list[curr_id - 1]).join(' '));
        data_val[curr_id] = curr_dictionary;
    }
}

function create_button(curr_id, text_value) {
    var button1 = document.createElement("button");
    button1.setAttribute("class", "btn");
    button1.type = "button";
    var t = document.createTextNode(text_value);
    button1.addEventListener("click", function () {
        change_image(curr_id, text_value);
    });
    button1.appendChild(t);
    return button1;
}

function change_image(curr_id, textContent) {
    var src = "";
    switch (textContent) {
        case "Show properties": src = "new_images/img_" + curr_id + "_annotations.png";
            break;
        case "Show original": src = "new_images/img_" + curr_id + "_viz.png";
            break;
        case "Show clear": src = "new_images/img_" + curr_id + "_clear.png";
            break;
        case "Show free": src = "new_images/img_" + curr_id + "_free.png";
            break;
        case "Show matched": src = "new_images/img_" + curr_id + "_matched.png";
            break;
        case "Show occupied": src = "new_images/img_" + curr_id + "_occupied.png";
            break;
        case "Show captured": src = "new_images/img_" + curr_id + "_captured.png";
                break;

    }
    document.getElementById("img_set" + curr_id).setAttribute("src", src);    
    data_val[curr_id]["viz"].push(textContent);
    data_val[curr_id]["viz_time"].push(Date.now());
}

function printAnswer(option) {
    curr_id = examples[curr_exp];
    data_val[curr_id]["questions"].push($("#question-answer option:selected").text());
    data_val[curr_id]["questions_time"].push(Date.now());
    document.getElementById("answer").innerHTML = item_answers[document.getElementById("question-answer").value];
}

function readyToAnswer() {
    // Only show answer options and image - no transparency or text answer when the user says they are ready to answer
    $('#all-buttons').hide();
    $('#dropdown').hide();
    $('#user-text-input').hide();
    // past work
    $('#showOptionsBtn').hide();
    $('#user-input').show();
    curr_id = examples[curr_exp];
    data_val[curr_id]["show-options-time"].push(Date.now());
    return false;
}

function submitAnswer() {
    curr_id = examples[curr_exp];
    data_val[curr_id]["text-answer"] = $('textarea#reason').val();
    data_val[curr_id]["final_answer"] = $("#user-answer").val();
    data_val[curr_id]["Confidence"] = $("input[name='Confidence']:checked").val();
    data_val[curr_id]["final_time"] = Date.now();
//   debugger;
    if(curr_exp === 12)
    {
      //alert(JSON.stringify(data_val));
      $.post('save_data.php',{blah: JSON.stringify(data_val)},
         function(data,status){
             //alert(data); 
             var endtext = "You have completed the experiment. Please enter the following code on your mechanical turk portal and fill in the questionnaire. ";
             document.getElementById("serialno").innerHTML = endtext + data;

         });
       /* $.ajax({
            type: 'POST',
            url: 'save_data.php',
            data: {blah: "rrr"},
        })
        .done( function( data ) {
            alert('done');
            console.log(data);
        })
        .fail( function( data ) {
            alert('fail');
            console.log(data);
        });
*/
    }
    
    next();
}

function exit_to_survey() {
    $('#timer').hide();
    $("#showOptionsBtn").hide();
    $('#all-buttons').hide();
    $('#user-input-options').hide();
}
