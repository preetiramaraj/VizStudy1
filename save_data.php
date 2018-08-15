<?php
$data = $_POST['data'];
$myfile = fopen("newfile.txt", "w") or die("Unable to open file!");
$txt = "John Doe\n";
fwrite($myfile, $txt);
$txt = "Jane Doe\n";
fwrite($myfile, $txt);
fwrite($myfile, $data);
file_put_contents("newfile.txt", $txt.PHP_EOL , FILE_APPEND | LOCK_EX);
fclose($myfile);
?>