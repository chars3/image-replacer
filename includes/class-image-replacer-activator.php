<?php

/**
 * Fired during plugin activation
 *
 * @link       http://example.com
 * @since      1.0.0
 *
 * @package    Image_Replacer
 * @subpackage Image_Replacer/includes
 */

/**
 * Fired during plugin activation.
 *
 * This class defines all code necessary to run during the plugin's activation.
 *
 * @since      1.0.0
 * @package    Image_Replacer
 * @subpackage Image_Replacer/includes
 * @author     Your Name <email@example.com>
 */
class Image_Replacer_Activator {

	/**
	 * Executa ações necessárias durante a ativação do plugin.
	 *
	 * @since    1.0.0
	 */
	public static function activate() {
		// Nenhuma ação específica é necessária na ativação
		// Poderíamos criar tabelas personalizadas ou configurações padrão, se necessário
		
		// Limpar qualquer cache de transient que o plugin possa ter usado
		delete_transient('image_replacer_posts_cache');
	}

}