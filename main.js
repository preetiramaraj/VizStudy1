// Timer
var sec = 0;
function pad ( val ) { return val > 9 ? val : "0" + val; }
setInterval( function(){
    document.getElementById("seconds").innerHTML=pad(++sec%60);
    document.getElementById("minutes").innerHTML=pad(parseInt(sec/60,10));
}, 1000);

function resetTime() {
    sec = 0;
}
// end Timer

var curr_exp = -1;
        var startTime = Date.now();
        var prevTime;
        var item_answers = [];
        var user_answer_list = [];

        Shuffle = function (o) {
            for (var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
            return o;
        };

        // Text input per example
        var file1 = "text/interaction.txt";
        //var file2 = 'text/1_1.json';
        var answers_file = 'text/answers.json';
        var qna_list_file = 'text/question_answer_list.json';
        var examples = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16];
        function getInteractionText() {
            $.get('text/interaction.txt', function (txt) {
                alert(txt);
                var lines = txt.split("\n");
            });
        }

        // Shuffled list of experiments
        var textOrder = Shuffle(examples);

        function readTextFile(file, callback) {
            var rawFile = new XMLHttpRequest();
            rawFile.overrideMimeType("application/json");
            rawFile.open("GET", file, true);
            rawFile.onreadystatechange = function() {
                if (rawFile.readyState === 4 && rawFile.status == "200") {
                    callback(rawFile.responseText);
                }
            }
            rawFile.send(null);
        }

        function loadData() {
            $('#startBtn').show();
            $('#nextBtn').hide();
            // Populate possible answers
            readTextFile(answers_file, function(data){
                var ans_list = JSON.parse(data);
                for(var i=0; i < ans_list.length; i++)
                {
                    var individual_answers = [];
                    for(var j=0; j < 4; j++)
                    {
                        individual_answers.push('<option value="' + (j+1) + '">' + ans_list[i][(j+1).toString()] + '</option>');
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

            next();
            startTime = new Date();
            //getInteractionText();
        }

        function next() {
            // This function will figure out which tab to display
            // Defining array variables in order to vary the condition
            var arr_none = [1,5,9,13];
            var arr_qa = [2,4,6,8,10,12,14,16];
            var arr_viz = [3,4,7,8,11,12,15,16];
            $('#all-buttons').hide();
            $('#dropdown').hide();
            // To refresh buttons for the new example
            // PR - consider deleting buttons whose names start with "Show", make show annotations - display properties
            document.getElementById("visual-buttons").innerHTML = '';
            //prevTime = startTime;
            // var startTime = Date.now();
            debugger;
            curr_exp = curr_exp + 1;
            curr_id = examples[curr_exp];
            if (curr_exp > 0)
            {
                $("#conv_set" + examples[curr_exp - 1].toString()).hide();
                $("#img_set" + examples[curr_exp - 1].toString()).hide();
            }

            document.getElementById('serialno').innerHTML = curr_exp.toString();
            document.getElementById('serialno').innerHTML += " " + curr_id.toString();
            resetTime();

            $("#conv_set" + curr_id.toString()).show();
            $("#img_set" + curr_id.toString()).show();

            if(arr_none.indexOf(curr_id) == -1)
            {
                $('#all-buttons').show();
            }
            // Add condition to check if q&a needs to be shown
            if(arr_qa.indexOf(curr_id) != -1)
            {
                $('#dropdown').show();
            }

            // Adding condition to check if visualization is part of it
            if(arr_viz.indexOf(curr_id) != -1)
            {
                $('#visual-buttons').show();

                // PR - make function out of making buttons
                var button1 = document.createElement("button");
                button1.setAttribute("class","btn");
                button1.type = "button";
                var t = document.createTextNode("Show annotations");
                // PR - add function to this
                button1.addEventListener("click", function() {
                    change_image(curr_id, button1.textContent);
                });
                button1.appendChild(t);
                document.getElementById("visual-buttons").appendChild(button1);
            }
            // Showing final answer options
            $('#user-input-options').show();
            // Reading json file
            file2 = 'text/'+ curr_id.toString() + '.json';
            readTextFile(file2, function(text){
                var items = [];
                var qna = JSON.parse(text);
                for(var i=0; i < qna.length; i++)
                {
                    items.push('<option value="' + i + '">' + qna[i]["Question"] + '</option>');
                    item_answers.push(qna[i]["Answer"]);
                }

                $('#question-answer').html(items.join(' '));
            });

            // Populate example-level-answers
            $('#user-answer').html((user_answer_list[curr_id-1]).join(' '));
        }

        function change_image(curr_id, textContent) {
            debugger;
            var button_text = "annotations"; // {"Show annotations":"annotations","aaa":"aaa") - add other concepts to this
            document.getElementById("img_set"+curr_id).setAttribute("src","images/img_" + curr_id + "_"+ button_text + ".png");

        }

        function printAnswer(option)
        {
            // PR:TODO Get value of question to retrieve corresponding answer from json
            document.getElementById("answer").innerHTML = item_answers[document.getElementById("question-answer").value];
        }