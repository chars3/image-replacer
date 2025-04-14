/**
 * Register the JavaScript for the admin area.
 *
 * @since    1.0.0
 */
public function enqueue_scripts() {
    $screen = get_current_screen();
    if ( !isset($screen->id) || $screen->id !== 'tools_page_' . $this->plugin_name ) {
        return;
    }

    // Registrando estilos de media selector do WP
    wp_enqueue_media();
    
    // Verificar ambiente de desenvolvimento
    $dev_mode = defined('WP_DEBUG') && WP_DEBUG === true;
    
    if ($dev_mode) {
        // Em modo de desenvolvimento
        $js_path = plugin_dir_path( __FILE__ ) . 'js/dist/assets/main.js';
        $css_path = plugin_dir_path( __FILE__ ) . 'js/dist/assets/main.css';
        
        // Verificar se temos um build local (gerado pelo npm run dev --watch)
        if (file_exists($js_path)) {
            // Adicionar timestamp para quebrar o cache
            $version = filemtime($js_path);
            wp_enqueue_script( $this->plugin_name . '-app', plugin_dir_url( __FILE__ ) . 'js/dist/assets/main.js', array('jquery'), $version, true );
            
            if (file_exists($css_path)) {
                wp_enqueue_style( $this->plugin_name . '-app-styles', plugin_dir_url( __FILE__ ) . 'js/dist/assets/main.css', array(), $version, 'all' );
            }
        } else {
            // Fallback para o servidor Vite (se estiver executando npm run dev:server)
            wp_enqueue_script( $this->plugin_name . '-app-dev', 'http://localhost:5173/src/main.jsx', array(), $this->version, true );
        }
    } else {
        // Em modo de produção
        wp_enqueue_script( $this->plugin_name . '-app', plugin_dir_url( __FILE__ ) . 'js/dist/assets/main.js', array('jquery'), $this->version, true );
        wp_enqueue_style( $this->plugin_name . '-app-styles', plugin_dir_url( __FILE__ ) . 'js/dist/assets/main.css', array(), $this->version, 'all' );
    }
    
    // Passar variáveis para o script
    wp_localize_script(
        $dev_mode && !file_exists(plugin_dir_path( __FILE__ ) . 'js/dist/assets/main.js') 
            ? $this->plugin_name . '-app-dev' 
            : $this->plugin_name . '-app',
        'imageReplacerSettings',
        array(
            'root'  => esc_url_raw( rest_url() ),
            'nonce' => wp_create_nonce( 'wp_rest' ),
            'apiEndpoint' => esc_url_raw( rest_url( $this->plugin_name . '/v1' ) ),
            'adminUrl' => admin_url(),
            'isAdmin' => current_user_can('manage_options'),
            'isDev' => $dev_mode,
        )
    );
}