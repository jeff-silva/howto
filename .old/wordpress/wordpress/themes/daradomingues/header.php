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

		.elementor-widget-container h1 {
			font-size: 60px;
			font-family: "Roboto", serif;
			font-optical-sizing: auto;
			font-weight: 400;
			font-style: normal;
			font-variation-settings: "wdth" 100;
		}

		.elementor-widget-container h2 {
			font-size: 60px;
			font-family: "Roboto", serif;
			font-optical-sizing: auto;
			font-weight: 400;
			font-style: normal;
			font-variation-settings: "wdth" 100;
		}

		.elementor-widget-container h3 {
			font-size: 44px;
			font-family: "Roboto", serif;
			font-optical-sizing: auto;
			font-weight: 400;
			font-style: normal;
			font-variation-settings: "wdth" 100;
		}

		.elementor-widget-container h4 {
			font-size: 36px;
			font-family: "Roboto", serif;
			font-optical-sizing: auto;
			font-weight: 400;
			font-style: normal;
			font-variation-settings: "wdth" 100;
		}

		.elementor-widget-container h5 {
			font-size: 28px;
			font-family: "Roboto", serif;
			font-optical-sizing: auto;
			font-weight: 400;
			font-style: normal;
			font-variation-settings: "wdth" 100;
		}

		.elementor-widget-container h6 {
			font-size: 16px;
			font-family: "Roboto", serif;
			font-optical-sizing: auto;
			font-weight: 400;
			font-style: normal;
			font-variation-settings: "wdth" 100;
		}

		.elementor-widget-container p {
			font-size: 16px;
			font-family: "Roboto", serif;
			font-optical-sizing: auto;
			font-weight: 400;
			font-style: normal;
			font-variation-settings: "wdth" 100;
		}
	</style>
</head>

<body <?php body_class(); ?>>
	<?php wp_body_open(); ?>

	<div id="app-header" style="opacity:0;">

		<!-- Nav -->
		<div
			class="fixed top-0 left-0 w-full"
			style="background: #ffffffee; z-index:99;">
			<div class="mx-auto container py-2 flex items-center gap-2">
				<a
					href="/"
					class="text-gray-500 text-slate-600 px-3 text-sm font-roboto-800 hover:text-slate-900">
					Dara Domingues
				</a>

				<div class="flex-1 flex justify-center">
					<nav class="hidden lg:flex space-x-4" aria-label="Tabs">
						<template v-for="o in nav.items">
							<a
								:href="`/#${o.slug}`"
								class="text-gray-500 text-slate-600 px-3 py-2 hover:text-slate-900"
								v-bind="o.bind">
								<span
									class="decoration-black underline-offset-8 font-roboto-400 text-sm"
									:class="{'underline text-slate-900': o.active}">
									{{ o.name }}
								</span>
							</a>
						</template>
					</nav>
				</div>

				<a
					href="/contact"
					class="text-gray-500 text-slate-600 px-3 text-sm font-roboto-400 hover:text-slate-900">
					Contact
				</a>
			</div>
		</div>
		<br /><br />
	</div>
	<script type="module">
		const {
			createApp,
			onMounted,
			reactive,
			computed
		} = Vue;

		window.appHeader = createApp({
			setup() {
				const work = reactive({
					filter: {
						work_tag: null,
					},
					terms: computed(() => {
						return work.raw.terms;
					}),
					posts: computed(() => {
						if (!work.filter.work_tag) {
							return work.raw.posts;
						}

						return work.raw.posts.filter((post) => {
							return post.meta.work_tag.filter((tag) => {
								return tag.slug == work.filter.work_tag;
							}).length >= 1;
						});
					}),
					raw: <?php echo json_encode(daradomingues_get_posts_schema('work')); ?>,
				});

				const nav = reactive({
					dialog: {
						visible: false,
						set(visible = null) {
							nav.dialog.visible = visible === null ? !nav.dialog.visible : visible;
						},
					},
					items: computed(() => {
						return work.raw.terms.map((term) => {
							const name = term.name;
							const slug = term.slug;
							const active = work.filter.work_tag == term.slug;
							const bind = {
								onClick: (ev) => {
									work.filter.work_tag = active ? null : term.slug;
								},
							};
							return {
								name,
								slug,
								active,
								bind
							};
						})
					}),
				});

				const onHashChange = () => {
					let work_tag = location.hash.replace('#', '') || null;
					work.filter.work_tag = work_tag;
				}

				onMounted(() => {
					document.querySelector('#app-header').style.opacity = 1;
					addEventListener("hashchange", onHashChange);
					onHashChange();
				});

				return {
					work,
					nav
				};
			},
		});
		window.appHeader.mount("#app-header");
	</script>