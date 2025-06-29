<?php
$dir = 'public/gallery/';
$fname = '.file-list.json';
$files = array_values(array_filter(scandir($dir), function($file) use ($dir) {return preg_match('/\.(jpe?g|png|gif|webp|txt)$/i', $file) && is_file($dir . $file);}));
file_put_contents($dir . $fname, json_encode($files, JSON_PRETTY_PRINT));
echo "generated ./" . $dir . $fname . " using " . count($files) . " files";