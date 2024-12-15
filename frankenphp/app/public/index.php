<?php ob_start(); ?>
<?php include __DIR__ . '/../nav.php'; ?>
<h1 style="text-align:center;">Site80</h1>


<?php
$content = ob_get_clean();

ob_start();
phpinfo();
$phpinfo = ob_get_clean();

echo str_replace('<body>', '<body>' . $content, $phpinfo);
