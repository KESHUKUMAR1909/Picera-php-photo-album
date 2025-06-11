<?php
$images = array_values(array_filter(scandir('images'), function ($file) {
  return preg_match('/\.(jpg|jpeg|png)$/i', $file);
}));
echo json_encode($images);
?>
