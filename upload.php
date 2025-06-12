<?php
// Try to raise limits (may be ignored on some servers)
ini_set('upload_max_filesize', '10M');
ini_set('post_max_size', '20M');
ini_set('max_file_uploads', '10');

$uploadDir = 'images/';
$maxFileSize = 5 * 1024 * 1024; // 5 MB
$maxFileCount = 10;
$allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];

// Create upload directory if it doesn't exist
if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

// Check if files are uploaded
if (!empty($_FILES['images']['name'][0])) {
    $fileCount = count($_FILES['images']['name']);

    if ($fileCount > $maxFileCount) {
        exit("Error: You can upload a maximum of $maxFileCount files at once.");
    }

    $errors = [];

    foreach ($_FILES['images']['tmp_name'] as $index => $tmpName) {
        $originalName = $_FILES['images']['name'][$index];
        $fileSize = $_FILES['images']['size'][$index];
        $fileType = $_FILES['images']['type'][$index];
        $fileError = $_FILES['images']['error'][$index];

        // Skip empty or invalid uploads
        if ($fileError === UPLOAD_ERR_NO_FILE) {
            $errors[] = "No file selected at position $index.";
            continue;
        }

        // Check for general upload errors
        if ($fileError !== UPLOAD_ERR_OK) {
            $errors[] = "Error uploading $originalName. Error Code: $fileError";
            continue;
        }

        // Validate file type
        if (!in_array($fileType, $allowedTypes)) {
            $errors[] = "Unsupported file type: $originalName";
            continue;
        }

        // Validate file size
        if ($fileSize > $maxFileSize) {
            $errors[] = "File too large: $originalName (Max 5MB)";
            continue;
        }

        // Sanitize and generate unique filename
        $safeName = preg_replace("/[^A-Z0-9._-]/i", "_", $originalName);
        $uniqueName = uniqid('', true) . '_' . $safeName;
        $targetFile = $uploadDir . $uniqueName;

        // Move uploaded file
        if (!move_uploaded_file($tmpName, $targetFile)) {
            $errors[] = "Failed to move file: $originalName";
        }
    }

    // Final message
    if (empty($errors)) {
        echo "✅ All files uploaded successfully.";
    } else {
        echo "⚠️ Some errors occurred:<br>" . implode("<br>", $errors);
    }
} else {
    echo "⚠️ No files uploaded.";
}
?>
