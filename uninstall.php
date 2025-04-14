<?php

/**
 * Fired when the plugin is uninstalled.
 *
 * @link       http://example.com
 * @since      1.0.0
 *
 * @package    Image_Replacer
 */

// If uninstall not called from WordPress, then exit.
if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
	exit;
}

// Limpa qualquer dado persistente armazenado pelo plugin
delete_option('image_replacer_settings');
delete_transient('image_replacer_posts_cache');

// Se o plugin utilizasse tabelas personalizadas, você poderia excluí-las aqui
// global $wpdb;
// $wpdb->query("DROP TABLE IF EXISTS {$wpdb->prefix}image_replacer_table");