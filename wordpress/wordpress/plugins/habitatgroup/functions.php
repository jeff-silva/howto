<?php

// if (!function_exists('dd')) {
//   function dd()
//   {
//     foreach (func_get_args() as $data) {
//       echo '<pre>' . print_r($data, true) . '</pre>';
//     }
//     die;
//   }
// }

add_action('admin_init', function () {
  $required_plugins = [
    [
      'name' => 'Elementor',
      'plugin_file' => 'elementor/elementor.php',
      'search_term' => 'elementor',
    ],
    [
      'name' => 'Pods',
      'plugin_file' => 'pods/init.php',
      'search_term' => 'pods',
    ],
  ];

  $active_plugins = get_option('active_plugins');

  $required_plugins = array_map(function ($required_plugin) use ($active_plugins) {
    $required_plugin['installed'] = in_array($required_plugin['plugin_file'], $active_plugins);
    $required_plugin['install_url'] = admin_url("plugin-install.php?s={$required_plugin['search_term']}&tab=search&type=term");
    return $required_plugin;
  }, $required_plugins);

  // Is some required plugin not installed?
  $need_install = array_filter($required_plugins, function ($required_plugin) {
    return !$required_plugin['installed'];
  });

  if (!empty($need_install)) {
    add_action('admin_notices', function () use ($need_install) {
?>
      <div class="notice notice-error" style="padding:10px 10px 0 10px;">
        <strong>Required plugins for this theme:</strong><br>
        <ul>
          <?php foreach ($need_install as $required_plugin): ?>
            <li>&bullet; <a href="<?php echo $required_plugin['install_url']; ?>"><?php echo $required_plugin['name']; ?></a></li>
          <?php endforeach; ?>
        </ul>
      </div>
<?php
    });
  }
});

include __DIR__ . '/elementor/elementor.php';
