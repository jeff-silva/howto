<?php

function dd()
{
	foreach (func_get_args() as $data) {
		echo '<pre>' . print_r($data, true) . '</pre>';
	}
}

/**
 * Sets up theme defaults and registers support for various WordPress features.
 *
 * Note that this function is hooked into the after_setup_theme hook, which
 * runs before the init hook. The init hook is too late for some features, such
 * as indicating support for post thumbnails.
 */
add_action('after_setup_theme', function () {
	/*
		* Make theme available for translation.
		* Translations can be filed in the /languages/ directory.
		* If you're building a theme based on daradomingues, use a find and replace
		* to change 'daradomingues' to the name of your theme in all the template files.
		*/
	load_theme_textdomain('daradomingues', get_template_directory() . '/languages');

	// Add default posts and comments RSS feed links to head.
	add_theme_support('automatic-feed-links');

	/*
			* Let WordPress manage the document title.
			* By adding theme support, we declare that this theme does not use a
			* hard-coded <title> tag in the document head, and expect WordPress to
			* provide it for us.
			*/
	add_theme_support('title-tag');

	/*
			* Enable support for Post Thumbnails on posts and pages.
			*
			* @link https://developer.wordpress.org/themes/functionality/featured-images-post-thumbnails/
			*/
	add_theme_support('post-thumbnails');

	// This theme uses wp_nav_menu() in one location.
	register_nav_menus(
		array(
			'menu-1' => esc_html__('Primary', 'daradomingues'),
		)
	);

	/*
			* Switch default core markup for search form, comment form, and comments
			* to output valid HTML5.
			*/
	add_theme_support(
		'html5',
		array(
			'search-form',
			'comment-form',
			'comment-list',
			'gallery',
			'caption',
			'style',
			'script',
		)
	);

	// Set up the WordPress core custom background feature.
	add_theme_support(
		'custom-background',
		apply_filters(
			'daradomingues_custom_background_args',
			array(
				'default-color' => 'ffffff',
				'default-image' => '',
			)
		)
	);

	// Add theme support for selective refresh for widgets.
	add_theme_support('customize-selective-refresh-widgets');

	/**
	 * Add support for core custom logo.
	 *
	 * @link https://codex.wordpress.org/Theme_Logo
	 */
	add_theme_support(
		'custom-logo',
		array(
			'height'      => 250,
			'width'       => 250,
			'flex-width'  => true,
			'flex-height' => true,
		)
	);
});

add_action('after_setup_theme', function () {
	// 
}, 0);

add_action('widgets_init', function () {
	register_sidebar(
		array(
			'name'          => esc_html__('Sidebar', 'daradomingues'),
			'id'            => 'sidebar-1',
			'description'   => esc_html__('Add widgets here.', 'daradomingues'),
			'before_widget' => '<section id="%1$s" class="widget %2$s">',
			'after_widget'  => '</section>',
			'before_title'  => '<h2 class="widget-title">',
			'after_title'   => '</h2>',
		)
	);
});



add_action('admin_init', function () {
	$required_plugins = [
		[
			'name' => 'Elementor',
			'did_action' => 'elementor/loaded',
			'search_term' => 'elementor',
		],
	];

	$required_plugins = array_map(function ($required_plugin) {
		$required_plugin['installed'] = did_action($required_plugin['did_action']);
		$required_plugin['install_url'] = admin_url("plugin-install.php?s={$required_plugin['search_term']}&tab=search&type=term");
		return $required_plugin;
	}, $required_plugins);

	// Is some required plugin not installed?
	$need_install = empty(array_filter($required_plugins, function ($required_plugin) {
		return $required_plugin['installed'];
	}));

	if ($need_install) {
		add_action('admin_notices', function () use ($required_plugins) {
?>
			<div class="notice notice-error">
				<strong>Alguns plugins precisam ser instalados para ativação do tema:</strong><br>
				<ul>
					<?php foreach ($required_plugins as $required_plugin): if ($required_plugin['installed']) continue; ?>
						<li>&bullet; <a href="<?php echo $required_plugin['install_url']; ?>"><?php echo $required_plugin['name']; ?></a></li>
					<?php endforeach; ?>
				</ul>
			</div>
<?php
		});
	}
});
