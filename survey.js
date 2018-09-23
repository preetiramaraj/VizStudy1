/*$(document).ready(function(){
	$("#submit").click(function(){*/

function submitAnswer()
{
		var data_val = {};
		data_val["assignmentId"] = gup("assignmentId");
		data_val["workerId"] = gup("workerId");
		data_val["validationCode"] = gup("validationCode");
		data_val["hitId"] = gup("hitId");
		data_val["gender"] = $("input[name='gender']:checked").val();
		data_val["age"] =  $("input[name='age']:checked").val();
		data_val["FreeTextQNA"] =  $("input[name='FreeTextQNA']").val();
		data_val["FreeTextViz"] =   $("input[name='FreeTextViz']").val();
		data_val["pref"] =                  $("input[name='pref']:checked").val();
		data_val["FreeTextOpinion"] =                  $("input[name='FreeTextOpinion']").val();
		 var val2 = [];
		$('input[name=puzzle-list]:checked').each(function(i){
			  val2[i] = $(this).val();
			});
		data_val["puzzle-list"] = val2; //$("input[name='puzzle-list']").val();
		data_val["qna_quickly"] =  $("input[name='qna_quickly']:checked").val();
		data_val["qna_easy"] =  $("input[name='qna_easy']:checked").val();
		data_val["qna_useful"] =  $("input[name='qna_useful']:checked").val();
		data_val["qna_easier"] =  $("input[name='qna_easier']:checked").val();
		data_val["qna_future"] =    $("input[name='qna_future']:checked").val();
		data_val["viz_quickly"] =  $("input[name='viz_quickly']:checked").val();
		data_val["viz_easy"] =  $("input[name='viz_easy']:checked").val();
		data_val["viz_useful"] =  $("input[name='viz_useful']:checked").val();
		data_val["viz_easier"] =  $("input[name='viz_easier']:checked").val();
		data_val["viz_future"] =  $("input[name='viz_future']:checked").val();
		 var val = [];
		$('input[name=interactive-agent]:checked').each(function(i){
			  val[i] = $(this).val();
			});
		data_val["interactive-agent"] =  val; //$("input[name='interactive-agent']").val();
		data_val["FreeTextMissing"] =  $("input[name='FreeTextMissing']").val();
		data_val["Q6MultiLineTextInput"] =  $("input[name='Q6MultiLineTextInput']").val();

 /*
		var final_val = [gup("assignmentId"),gup("workerId"),gup("validationCode"), gup("hitId"),$("input[name='gender']").val(), $("input[name='age']").val(),$("input[name='FreeTextQNA']").val(),                $("input[name='FreeTextViz']").val(),                $("input[name='pref']").val(),                $("input[name='FreeTextOpinion']").val(),                $("input[name='puzzle-list']").val(),                $("input[name='qna_quickly']").val(),                $("input[name='qna_easy']").val(),                $("input[name='qna_useful']").val(),                $("input[name='qna_easier']").val(),                $("input[name='qna_future']").val(),                $("input[name='viz_quickly']").val(),                $("input[name='viz_easy']").val(),                $("input[name='viz_useful']").val(),                $("input[name='viz_easier']").val(),                $("input[name='viz_future']").val(),                $("input[name='interactive-agent']").val(),        $("input[name='FreeTextMissing']").val(),        $("input[name='Q6MultiLineTextInput']").val()];*/
		
		$.post('save_survey.php',{survey: JSON.stringify(data_val)},
			function(data,status){

				  });
	$("#mturk_form").submit();

}

/*return false;
	});
});*/



