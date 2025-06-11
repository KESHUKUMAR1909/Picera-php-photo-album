<?php
$uploadDir = 'images/';

if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

if (!empty($_FILES['images']['name'][0])) {
    foreach ($_FILES['images']['tmp_name'] as $index => $tmpName) {
        $filename = basename($_FILES['images']['name'][$index]);
        $targetFile = $uploadDir . $filename;
        move_uploaded_file($tmpName, $targetFile);
    }
    echo "Images uploaded successfully.";
} else {
    echo "No files uploaded.";
}
?> 