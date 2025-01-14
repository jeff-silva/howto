<?php

add_action('elementor/widgets/register', function ($widgets_manager) {
  $widget = include __DIR__ . '/widgets/Home_Widget.php';
  $widgets_manager->register($widget);
});
