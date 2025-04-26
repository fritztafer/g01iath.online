<?php
$dir = 'public/gallery/';
$images = array_values(array_filter(scandir($dir), function($file) use ($dir) {
    return preg_match('/\.(jpe?g|png|gif|webp)$/i', $file) && is_file($dir . $file);
}));

file_put_contents($dir . '.file-list.json', json_encode($images, JSON_PRETTY_PRINT));
echo "generated file-list.json with " . count($images) . " files";