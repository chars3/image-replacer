<?php

/**
 * The REST API functionality of the plugin.
 *
 * @since      1.0.0
 * @package    Image_Replacer
 * @subpackage Image_Replacer/includes
 */
class Image_Replacer_API {

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
	public function __construct( $plugin_name, $version ) {

		$this->plugin_name = $plugin_name;
		$this->version = $version;

	}

	/**
	 * Register the REST API routes
	 *
	 * @since    1.0.0
	 */
	public function register_routes() {
		// Endpoint para listar posts com imagens
		register_rest_route( $this->plugin_name . '/v1', '/posts', array(
			'methods'  => 'GET',
			'callback' => array( $this, 'get_posts_with_images' ),
			'permission_callback' => array( $this, 'permissions_check' ),
		));

		// Endpoint para obter as imagens dentro de um post específico
		register_rest_route( $this->plugin_name . '/v1', '/post/(?P<id>\d+)/images', array(
			'methods'  => 'GET',
			'callback' => array( $this, 'get_images_from_post' ),
			'permission_callback' => array( $this, 'permissions_check' ),
			'args' => array(
				'id' => array(
					'validate_callback' => function($param) {
						return is_numeric($param);
					}
				),
			),
		));

		// Endpoint para substituir uma imagem
		register_rest_route( $this->plugin_name . '/v1', '/replace-image', array(
			'methods'  => 'POST',
			'callback' => array( $this, 'replace_image' ),
			'permission_callback' => array( $this, 'permissions_check' ),
		));
	}

	/**
	 * Check if a given request has access
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 * @return WP_Error|bool
	 */
	public function permissions_check( $request ) {
		// Verificar se o usuário tem permissão de editar posts
		return current_user_can( 'edit_posts' );
	}

	/**
	 * Get posts that contain images
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 * @return WP_Error|WP_REST_Response
	 */
	public function get_posts_with_images( $request ) {
		$args = array(
			'post_type'      => 'post',
			'post_status'    => 'publish',
			'posts_per_page' => 20,
			's'              => '<img', // Procurar por posts que contenham tags de imagem
		);

		// Adicionar filtros adicionais se fornecidos no request
		if ( isset( $request['page'] ) ) {
			$args['paged'] = $request['page'];
		}

		if ( isset( $request['per_page'] ) ) {
			$args['posts_per_page'] = $request['per_page'];
		}

		$query = new WP_Query( $args );
		$posts = array();

		foreach ( $query->posts as $post ) {
			$images = $this->extract_images_from_content( $post->post_content );
			
			if ( !empty( $images ) ) {
				$posts[] = array(
					'id'     => $post->ID,
					'title'  => $post->post_title,
					'status' => $post->post_status,
					'images' => $images,
				);
			}
		}

		$response = array(
			'posts'    => $posts,
			'total'    => $query->found_posts,
			'pages'    => $query->max_num_pages,
		);

		return rest_ensure_response( $response );
	}

	/**
	 * Get all images from a specific post
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 * @return WP_Error|WP_REST_Response
	 */
	public function get_images_from_post( $request ) {
		$post_id = $request['id'];
		$post = get_post( $post_id );

		if ( empty( $post ) ) {
			return new WP_Error( 'no_post', 'Post não encontrado', array( 'status' => 404 ) );
		}

		$images = $this->extract_images_from_content( $post->post_content );

		$response = array(
			'post_id' => $post_id,
			'title'   => $post->post_title,
			'images'  => $images,
		);

		return rest_ensure_response( $response );
	}

	/**
	 * Replace image in a post
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 * @return WP_Error|WP_REST_Response
	 */
	public function replace_image( $request ) {
		$params = $request->get_json_params();

		if ( ! isset( $params['post_id'] ) || ! isset( $params['old_image'] ) || ! isset( $params['new_image'] ) ) {
			return new WP_Error( 'missing_params', 'Parâmetros incompletos', array( 'status' => 400 ) );
		}

		$post_id = $params['post_id'];
		$old_image = $params['old_image'];
		$new_image = $params['new_image'];

		$post = get_post( $post_id );

		if ( empty( $post ) ) {
			return new WP_Error( 'no_post', 'Post não encontrado', array( 'status' => 404 ) );
		}

		// Substituir a imagem no conteúdo
		$content = $post->post_content;
		
		// Extrair o HTML completo da tag img antiga
		$pattern = '/<img[^>]*' . preg_quote($old_image, '/') . '[^>]*>/i';
		preg_match($pattern, $content, $matches);
		
		if (empty($matches[0])) {
			return new WP_Error( 'image_not_found', 'Imagem não encontrada no conteúdo', array( 'status' => 404 ) );
		}
		
		$old_img_tag = $matches[0];
		
		// Criar a nova tag img preservando atributos exceto src
		$new_img_tag = preg_replace('/src=[\'"][^\'"]*[\'"]/i', 'src="' . esc_url($new_image) . '"', $old_img_tag);
		
		// Substituir no conteúdo
		$updated_content = str_replace($old_img_tag, $new_img_tag, $content);
		
		// Atualizar o post
		$updated_post = array(
			'ID'           => $post_id,
			'post_content' => $updated_content,
		);
		
		$result = wp_update_post($updated_post);
		
		if (is_wp_error($result)) {
			return $result;
		}
		
		return rest_ensure_response(array(
			'success' => true,
			'post_id' => $post_id,
			'message' => 'Imagem substituída com sucesso',
		));
	}

	/**
	 * Extract all images from post content
	 *
	 * @param string $content Post content.
	 * @return array Array of images with src, width, height, and alt
	 */
	private function extract_images_from_content( $content ) {
		$images = array();
		$doc = new DOMDocument();
		
		// Suppress warnings from malformed HTML
		libxml_use_internal_errors( true );
		$doc->loadHTML( mb_convert_encoding( $content, 'HTML-ENTITIES', 'UTF-8' ) );
		libxml_clear_errors();
		
		$img_tags = $doc->getElementsByTagName( 'img' );
		
		foreach ( $img_tags as $tag ) {
			$image = array(
				'src'    => $tag->getAttribute( 'src' ),
				'width'  => $tag->getAttribute( 'width' ),
				'height' => $tag->getAttribute( 'height' ),
				'alt'    => $tag->getAttribute( 'alt' ),
				'class'  => $tag->getAttribute( 'class' ),
			);
			
			// Verificar se é uma imagem do WordPress com ID de attachment
			if ( $tag->getAttribute( 'class' ) && preg_match( '/wp-image-(\d+)/i', $tag->getAttribute( 'class' ), $matches ) ) {
				$image['attachment_id'] = intval( $matches[1] );
				
				// Obter informações adicionais do attachment
				$attachment = get_post( $image['attachment_id'] );
				if ( $attachment ) {
					$image['title'] = $attachment->post_title;
					$image['caption'] = $attachment->post_excerpt;
				}
			}
			
			$images[] = $image;
		}
		
		return $images;
	}
}