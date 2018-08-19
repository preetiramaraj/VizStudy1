<?php
$blah=json_decode($_POST['blah'],true);
$who = exec('whoami');
echo "hello";
$myfile = fopen("data/newfile7.txt", "w") or die("Unable to open file!");
fwrite($myfile, $who);
fwrite($myfile, implode("|", $blah["example-order"]));
fwrite($myfile, $blah["5"]["start_time"]);
fclose($myfile);

$fp = fopen('data/results.json', 'w');
fwrite($fp, json_encode($blah));
fclose($fp);
?>
