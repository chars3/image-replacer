<?php

/**
 * Provide a admin area view for the plugin
 *
 * This file is used to markup the admin-facing aspects of the plugin.
 *
 * @link       http://example.com
 * @since      1.0.0
 *
 * @package    Image_Replacer
 * @subpackage Image_Replacer/admin/partials
 */
?>

<div class="wrap">
    <h1><?php echo esc_html( get_admin_page_title() ); ?></h1>
    
    <div class="image-replacer-admin-container">
        <div id="image-replacer-app">
            <!-- O aplicativo React será renderizado aqui -->
            <div class="image-replacer-loading">
                <p><?php esc_html_e( 'Carregando aplicativo...', 'image-replacer' ); ?></p>
            </div>
        </div>
    </div>
</div>