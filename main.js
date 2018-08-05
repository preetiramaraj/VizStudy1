var curr_exp = 0;
        var startTime = Date.now();
        var prevTime;
        Shuffle = function (o) {
            for (var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
            return o;
        };

        // Text input per example
        var file1 = "text/interaction.txt";
        var file2 = 'text/1_1.json';
        var lines;
        function getInteractionText() {
            $.get('text/interaction.txt', function (txt) {
                alert(txt);
                var lines = txt.split("\n");
            });
        }

        //var textOrder = Shuffle(lines);
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

        function startExperiment() {
            $('#instructions').hide();
            $('#startBtn').hide();
            $('#exampleid').show();
            // Setting up the first experiment
            $('#nextBtn').show();

            next();
            startTime = new Date();
            //getInteractionText();
        }

        function next() {
            // This function will figure out which tab to display
           //prevTime = startTime;
           // var startTime = Date.now();

           if (curr_exp != 0)
           {
               $("#conv_set" + curr_exp.toString()).hide();
               $("#img_set" + curr_exp.toString()).hide();
           }

           curr_exp = curr_exp + 1;
           $("#conv_set" + curr_exp.toString()).show();
           $("#img_set" + curr_exp.toString()).show();

           // Add condition to check if q&a needs to be shown
           $('#question-answer').show();

           // Reading json file
           readTextFile(file2, function(text){
               var items = [];
               var qna = JSON.parse(text);
               for(var i=0; i < qna.length; i++)
               {
                   items.push('<option value="' + i + '">' + qna[i]["Question"] + '</option>');
               }

               $('#question-answer').html(items.join(' '));
           });

        }

        function printAnswer(option)
        {
            // PR:TODO Get value of question to retrieve corresponding answer from json
            document.getElementById("answer").innerHTML = document.getElementById("question-answer").value;
        }