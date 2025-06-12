<?php
$dir = "images/";
$images = array_filter(scandir($dir), function ($file) use ($dir) {
    return in_array(strtolower(pathinfo($file, PATHINFO_EXTENSION)), ['jpg', 'jpeg', 'png']);
});
echo json_encode(array_values($images));
?>
