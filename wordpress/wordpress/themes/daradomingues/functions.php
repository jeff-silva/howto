<?php

session_start();

function dd()
{
	foreach (func_get_args() as $data) {
		echo '<pre>' . print_r($data, true) . '</pre>';
	}
}

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

/* Remove WP Emoji */
remove_action('wp_head', 'print_emoji_detection_script', 7);
remove_action('wp_print_styles', 'print_emoji_styles');
remove_action('admin_print_scripts', 'print_emoji_detection_script');
remove_action('admin_print_styles', 'print_emoji_styles');

foreach (['wp_enqueue_scripts', 'admin_enqueue_scripts'] as $action) {
	add_action($action, function () use ($action) {
		if ($action == 'wp_enqueue_scripts') {
			wp_enqueue_script('vue', '//unpkg.com/vue@3/dist/vue.global.js');
			wp_enqueue_script('tailwind', '//cdn.tailwindcss.com');
			// wp_enqueue_style('animate-css', '//cdnjs.cloudflare.com/ajax/libs/animate.css/3.7.2/animate.min.css');
		}
	});
}

include __DIR__ . '/elementor/elementor.php';
