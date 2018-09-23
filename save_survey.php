<?php
$blah=json_decode($_POST['survey'],true);
if(!is_null($blah))
{
$id = $blah["validationCode"];
$resultname = '../survey-results/results-' . $id . '.json';
#$fp = fopen('../../../../../../tmp/results.json', 'w');
$fp = fopen($resultname, 'w');
fwrite($fp, json_encode($blah));
fclose($fp);
}

?>
