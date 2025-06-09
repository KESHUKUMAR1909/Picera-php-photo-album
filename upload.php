<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $targetDir = "images/";
    $file = $_FILES['image'];

    if (!in_array(mime_content_type($file['tmp_name']), ['image/jpeg', 'image/png'])) {
        echo "Invalid file type.";
        exit;
    }

    if ($file['size'] > 5 * 1024 * 1024) {
        echo "File size exceeds 5MB.";
        exit;
    }

    $filename = uniqid() . '_' . basename($file['name']);
    $targetFile = $targetDir . $filename;

    if (move_uploaded_file($file['tmp_name'], $targetFile)) {
        echo "success";
    } else {
        echo "Upload failed.";
    }
}
