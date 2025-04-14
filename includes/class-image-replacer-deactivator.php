<?php

/**
 * Fired during plugin deactivation
 *
 * @link       http://example.com
 * @since      1.0.0
 *
 * @package    Image_Replacer
 * @subpackage Image_Replacer/includes
 */

/**
 * Fired during plugin deactivation.
 *
 * This class defines all code necessary to run during the plugin's deactivation.
 *
 * @since      1.0.0
 * @package    Image_Replacer
 * @subpackage Image_Replacer/includes
 * @author     Your Name <email@example.com>
 */
class Image_Replacer_Deactivator {

	/**
	 * Executa ações necessárias durante a desativação do plugin.
	 *
	 * @since    1.0.0
	 */
	public static function deactivate() {
		// Limpar qualquer cache de transient que o plugin tenha usado
		delete_transient('image_replacer_posts_cache');
	}

}