<?php

/**
 * The admin-specific functionality of the plugin.
 *
 * @link       http://example.com
 * @since      1.0.0
 *
 * @package    Image_Replacer
 * @subpackage Image_Replacer/admin
 */

/**
 * The admin-specific functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for
 * enqueuing the admin-specific stylesheet and JavaScript.
 *
 * @package    Image_Replacer
 * @subpackage Image_Replacer/admin
 * @author     Your Name <email@example.com>
 */
class Image_Replacer_Admin
{

	/**
	 * The ID of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $plugin_name    The ID of this plugin.
	 */
	private $plugin_name;

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $plugin_name       The name of this plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct($plugin_name, $version)
	{

		$this->plugin_name = $plugin_name;
		$this->version = $version;
	}

	/**
	 * Register the stylesheets for the admin area.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_styles()
	{
		$screen = get_current_screen();
		if (!isset($screen->id) || $screen->id !== 'tools_page_' . $this->plugin_name) {
			return;
		}

		wp_enqueue_style($this->plugin_name, plugin_dir_url(__FILE__) . 'css/image-replacer-admin.css', array(), $this->version, 'all');
	}

	/**
	 * Register the JavaScript for the admin area.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_scripts()
	{
		$screen = get_current_screen();
		if (!isset($screen->id) || $screen->id !== 'tools_page_' . $this->plugin_name) {
			return;
		}

		// Registrando estilos de media selector do WP
		wp_enqueue_media();

		// Verificar ambiente de desenvolvimento
		$dev_mode = defined('WP_DEBUG') && WP_DEBUG === true;

		// Caminho para os arquivos compilados
		$js_path = plugin_dir_path(__FILE__) . 'js/dist/assets/main.js';
		$css_path = plugin_dir_path(__FILE__) . 'js/dist/assets/main.css';

		// Verificar se os arquivos existem
		if (file_exists($js_path)) {
			$version = filemtime($js_path);
			wp_enqueue_script(
				$this->plugin_name . '-app',
				plugin_dir_url(__FILE__) . 'js/dist/assets/main.js',
				array('jquery'),
				$version,
				true
			);

			if (file_exists($css_path)) {
				wp_enqueue_style(
					$this->plugin_name . '-app-styles',
					plugin_dir_url(__FILE__) . 'js/dist/assets/main.css',
					array(),
					$version,
					'all'
				);
			}
		} else {
			// Arquivo não encontrado
			error_log('ImageReplacer: JavaScript bundle não encontrado em: ' . $js_path);
		}

		// Passar variáveis para o script
		wp_localize_script(
			$this->plugin_name . '-app',
			'imageReplacerSettings',
			array(
				'root' => esc_url_raw(rest_url()),
				'nonce' => wp_create_nonce('wp_rest'),
				'apiEndpoint' => esc_url_raw(rest_url($this->plugin_name . '/v1')),
				'adminUrl' => admin_url(),
				'isAdmin' => current_user_can('manage_options'),
				'isDev' => $dev_mode,
			)
		);
	}

	/**
	 * Add menu to the WordPress admin
	 *
	 * @since    1.0.0
	 */
	public function add_plugin_admin_menu()
	{
		add_submenu_page(
			'tools.php',
			'Image Replacer',
			'Image Replacer',
			'edit_posts',
			$this->plugin_name,
			array($this, 'display_plugin_admin_page')
		);
	}

	/**
	 * Render the settings page for the plugin
	 *
	 * @since    1.0.0
	 */
	public function display_plugin_admin_page()
	{
		include_once('partials/image-replacer-admin-display.php');
	}

	/**
	 * Add settings action link to the plugins page.
	 *
	 * @since    1.0.0
	 */
	public function add_action_links($links)
	{
		$settings_link = array(
			'<a href="' . admin_url('tools.php?page=' . $this->plugin_name) . '">' . __('Settings', 'image-replacer') . '</a>',
		);
		return array_merge($settings_link, $links);
	}
}
