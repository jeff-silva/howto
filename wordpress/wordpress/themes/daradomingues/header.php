<?php

/**
 * The header for our theme
 *
 * This is the template that displays all of the <head> section and everything up until <div id="content">
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package daradomingues
 */

?>
<!doctype html>
<html <?php language_attributes(); ?>>

<head>
	<meta charset="<?php bloginfo('charset'); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<?php wp_head(); ?>

	<style>
		@import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap');

		<?php foreach ([100, 200, 300, 400, 500, 600, 700, 800, 900] as $weight): ?>.font-roboto-<?php echo $weight; ?> {
			font-family: "Roboto", serif;
			font-optical-sizing: auto;
			font-weight: <?php echo $weight; ?>;
			font-style: normal;
			font-variation-settings: "wdth" 100;
		}

		<?php endforeach; ?>html,
		body {
			max-width: 100vw;
			overflow: auto;
		}

		* {
			transition: all 300ms ease;
		}

		*::-webkit-scrollbar {
			width: 14px;
			height: 14px;
		}

		*::-webkit-scrollbar-track {
			background: transparent;
		}

		*::-webkit-scrollbar-thumb {
			border: 4px solid rgba(0, 0, 0, 0);
			background-clip: padding-box;
			background-color: #7f7f7f44;
			border-radius: 10px;
			cursor: pointer;
		}

		.container {
			max-width: 1000px !important;
		}
	</style>
</head>

<body <?php body_class(); ?>>
	<?php wp_body_open(); ?>