<?php
$dir = 'public/gallery/';
$files = array_values(array_filter(scandir($dir), function($file) use ($dir) {return preg_match('/\.(jpe?g|png|gif|webp|txt)$/i', $file) && is_file($dir . $file);}));
file_put_contents($dir . '.file-list.json', json_encode($files, JSON_PRETTY_PRINT));
echo "generated ./" . $dir . ".file-list.json with " . count($files) . " files";