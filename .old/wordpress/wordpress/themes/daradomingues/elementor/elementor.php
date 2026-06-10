<?php

add_action('elementor/widgets/register', function ($widgets_manager) {
  $widgets_manager->register(include __DIR__ . '/widgets/Home_Widget.php');
});
