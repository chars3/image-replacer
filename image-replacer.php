<?php

/**
 * The plugin bootstrap file
 *
 * @link              http://example.com
 * @since             1.0.0
 * @package           Image_Replacer
 *
 * @wordpress-plugin
 * Plugin Name:       Image Replacer
 * Description:       Permite encontrar e substituir imagens em posts do WordPress
 * Version:           1.0.6
 * Author:            Charles
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       image-replacer
 * Domain Path:       /languages
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Currently plugin version.
 */
define( 'IMAGE_REPLACER_VERSION', '1.0.0' );

/**
 * The code that runs during plugin activation.
 */
function activate_image_replacer() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-image-replacer-activator.php';
	Image_Replacer_Activator::activate();
}

/**
 * The code that runs during plugin deactivation.
 */
function deactivate_image_replacer() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-image-replacer-deactivator.php';
	Image_Replacer_Deactivator::deactivate();
}

register_activation_hook( __FILE__, 'activate_image_replacer' );
register_deactivation_hook( __FILE__, 'deactivate_image_replacer' );

/**
 * The core plugin class that is used to define internationalization,
 * admin-specific hooks, and public-facing site hooks.
 */
require plugin_dir_path( __FILE__ ) . 'includes/class-image-replacer.php';

/**
 * Begins execution of the plugin.
 *
 * @since    1.0.0
 */
function run_image_replacer() {

	$plugin = new Image_Replacer();
	$plugin->run();

}
run_image_replacer();
