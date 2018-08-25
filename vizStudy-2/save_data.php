<?php
$blah=json_decode($_POST['blah'],true);

if(!is_null($blah))
{
$id = rand();
echo $id;
$resultname = '../../../../../../../tmp/results2-' . $id . '.json';
#$fp = fopen('../../../../../../tmp/results.json', 'w');
$fp = fopen($resultname, 'w');
fwrite($fp, json_encode($blah));
fclose($fp);
}

?>
