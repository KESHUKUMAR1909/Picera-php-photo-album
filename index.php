<?php
$imagesPerPage = 6;
$allImages = array_values(array_filter(scandir('images'), function ($file) {
    return preg_match('/\.(jpg|jpeg|png)$/i', $file);
}));
$totalPages = ceil(count($allImages) / $imagesPerPage);
$page = isset($_GET['page']) ? max(1, intval($_GET['page'])) : 1;
$start = ($page - 1) * $imagesPerPage;
$currentImages = array_slice($allImages, $start, $imagesPerPage);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Photo Album</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h1>Real-Time Photo Album</h1>

    <form id="uploadForm" enctype="multipart/form-data">
        <input type="file" name="image" id="imageInput" accept=".jpg,.jpeg,.png" required>
        <button class="btn" type="submit">Upload</button>
        <p id="message"></p>
    </form>

    <div class="album">
        <div class="column">
            <?php for ($i = 0; $i < 3 && $i < count($currentImages); $i++): ?>
                <img class="img" src="images/<?= htmlspecialchars($currentImages[$i]) ?>" alt="Image">
            <?php endfor; ?>
        </div>
        <div class="column">
            <?php for ($i = 3; $i < 6 && $i < count($currentImages); $i++): ?>
                <img src="images/<?= htmlspecialchars($currentImages[$i]) ?>" alt="Image">
            <?php endfor; ?>
        </div>
    </div>

    <div class="pagination">
        <?php if ($page > 1): ?>
            <button class="btn"><a href="?page=<?= $page - 1 ?>">Previous</a><button>
        <?php endif; ?>
        <?php if ($page < $totalPages): ?>
            <button class="btn"><a href="?page=<?= $page + 1 ?>">Next</a></button>
        <?php endif; ?>
    </div>

    <script src="script.js"></script>
</body>
</html>
