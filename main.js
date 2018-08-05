var curr_exp = 0;
        var startTime = Date.now();
        var prevTime;
        Shuffle = function (o) {
            for (var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
            return o;
        };

        // Text input per example
        var file1 = "text/interaction.txt"
        var lines;
        function getInteractionText() {
            $.get('text/interaction.txt', function (txt) {
                alert(txt);
                var lines = txt.split("\n");
            });
        }

        //var textOrder = Shuffle(lines);

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
        }