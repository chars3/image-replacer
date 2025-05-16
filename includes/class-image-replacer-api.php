<?php

/**
 * The REST API functionality of the plugin.
 *
 * @since      1.0.0
 * @package    Image_Replacer
 * @subpackage Image_Replacer/includes
 */
class Image_Replacer_API
{
	private $plugin_name;
	private $version;

	public function __construct($plugin_name, $version)
	{
		$this->plugin_name = $plugin_name;
		$this->version = $version;
	}

	public function register_routes()
	{
		register_rest_route($this->plugin_name . '/v1', '/posts', array(
			'methods'  => 'GET',
			'callback' => array($this, 'get_posts_with_images'),
			'permission_callback' => array($this, 'permissions_check'),
		));

		register_rest_route($this->plugin_name . '/v1', '/post/(?P<id>\d+)/images', array(
			'methods'  => 'GET',
			'callback' => array($this, 'get_images_from_post'),
			'permission_callback' => array($this, 'permissions_check'),
			'args' => array(
				'id' => array(
					'validate_callback' => function ($param) {
						return is_numeric($param);
					}
				),
			),
		));

		register_rest_route($this->plugin_name . '/v1', '/replace-image', array(
			'methods'  => 'POST',
			'callback' => array($this, 'replace_image'),
			'permission_callback' => array($this, 'permissions_check'),
		));

		register_rest_route($this->plugin_name . '/v1', '/replace-featured-image', array(
			'methods'  => 'POST',
			'callback' => array($this, 'replace_featured_image'),
			'permission_callback' => array($this, 'permissions_check'),
		));

		register_rest_route($this->plugin_name . '/v1', '/upload', array(
			'methods'  => 'POST',
			'callback' => array($this, 'upload_image'),
			'permission_callback' => array($this, 'permissions_check'),
		));
	}

	public function permissions_check($request)
	{
		return current_user_can('edit_posts');
	}

	public function get_posts_with_images($request)
	{
		$args = array(
			'post_type'      => 'post',
			'post_status'    => 'publish',
			'posts_per_page' => 20,
			's'              => '<img',
		);

		if (isset($request['page'])) {
			$args['paged'] = $request['page'];
		}
		if (isset($request['per_page'])) {
			$args['posts_per_page'] = $request['per_page'];
		}

		$query = new WP_Query($args);
		$posts = array();

		foreach ($query->posts as $post) {
			$images = $this->extract_images_from_content($post->post_content);

			$thumbnail_id = get_post_thumbnail_id($post->ID);
			if ($thumbnail_id) {
				$thumbnail_url = wp_get_attachment_url($thumbnail_id);
				$thumbnail_meta = wp_get_attachment_metadata($thumbnail_id);
				$thumbnail_alt = get_post_meta($thumbnail_id, '_wp_attachment_image_alt', true);
				$thumbnail_post = get_post($thumbnail_id);

				$featured_image = array(
					'src'     => $thumbnail_url,
					'width'   => isset($thumbnail_meta['width']) ? $thumbnail_meta['width'] : '',
					'height'  => isset($thumbnail_meta['height']) ? $thumbnail_meta['height'] : '',
					'alt'     => $thumbnail_alt,
					'title'   => $thumbnail_post->post_title,
					'caption' => $thumbnail_post->post_excerpt,
					'class'   => 'featured-image',
					'type'    => 'featured',
				);

				array_unshift($images, $featured_image);
			}

			if (!empty($images)) {
				$posts[] = array(
					'id'     => $post->ID,
					'title'  => $post->post_title,
					'status' => $post->post_status,
					'images' => $images,
				);
			}
		}

		$response = array(
			'posts' => $posts,
			'total' => $query->found_posts,
			'pages' => $query->max_num_pages,
		);

		return rest_ensure_response($response);
	}

	public function get_images_from_post($request)
	{
		$post_id = $request['id'];
		$post = get_post($post_id);

		if (empty($post)) {
			return new WP_Error('no_post', 'Post não encontrado', array('status' => 404));
		}

		$images = $this->extract_images_from_content($post->post_content);

		$thumbnail_id = get_post_thumbnail_id($post->ID);
		if ($thumbnail_id) {
			$thumbnail_url = wp_get_attachment_url($thumbnail_id);
			$thumbnail_meta = wp_get_attachment_metadata($thumbnail_id);
			$thumbnail_alt = get_post_meta($thumbnail_id, '_wp_attachment_image_alt', true);
			$thumbnail_post = get_post($thumbnail_id);

			$featured_image = array(
				'src'     => $thumbnail_url,
				'width'   => isset($thumbnail_meta['width']) ? $thumbnail_meta['width'] : '',
				'height'  => isset($thumbnail_meta['height']) ? $thumbnail_meta['height'] : '',
				'alt'     => $thumbnail_alt,
				'title'   => $thumbnail_post->post_title,
				'caption' => $thumbnail_post->post_excerpt,
				'class'   => 'featured-image',
				'type'    => 'featured',
			);

			array_unshift($images, $featured_image);
		}

		$response = array(
			'post_id' => $post_id,
			'title'   => $post->post_title,
			'images'  => $images,
		);

		return rest_ensure_response($response);
	}

	public function replace_image($request)
	{
		$params = $request->get_json_params();

		if (! isset($params['post_id']) || ! isset($params['old_image']) || ! isset($params['new_image'])) {
			return new WP_Error('missing_params', 'Parâmetros incompletos', array('status' => 400));
		}

		$post_id = $params['post_id'];
		$old_image = $params['old_image'];
		$new_image = $params['new_image'];

		$post = get_post($post_id);
		if (empty($post)) {
			return new WP_Error('no_post', 'Post não encontrado', array('status' => 404));
		}

		$content = $post->post_content;
		$pattern = '/<img[^>]*' . preg_quote($old_image, '/') . '[^>]*>/i';
		preg_match($pattern, $content, $matches);

		if (empty($matches[0])) {
			return new WP_Error('image_not_found', 'Imagem não encontrada no conteúdo', array('status' => 404));
		}

		$old_img_tag = $matches[0];
		$new_img_tag = preg_replace('/src=[\'"][^\'"]*[\'"]/i', 'src="' . esc_url($new_image) . '"', $old_img_tag);
		$updated_content = str_replace($old_img_tag, $new_img_tag, $content);

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

	public function replace_featured_image($request)
	{
		$params = $request->get_json_params();
	
		if (!isset($params['post_id']) || !isset($params['new_image'])) {
			return new WP_Error('missing_params', 'Parâmetros incompletos', array('status' => 400));
		}
	
		$post_id = $params['post_id'];
		$new_image_url = esc_url_raw($params['new_image']);
		$post = get_post($post_id);
	
		if (empty($post)) {
			return new WP_Error('no_post', 'Post não encontrado', array('status' => 404));
		}
	
		// 🧠 Usa a função do WP para obter o ID do attachment baseado na URL
		$attachment_id = attachment_url_to_postid($new_image_url);
	
		if (!$attachment_id) {
			return new WP_Error('invalid_image', 'Imagem não encontrada na biblioteca de mídia.', array('status' => 404));
		}
	
		set_post_thumbnail($post_id, $attachment_id);
	
		return rest_ensure_response(array(
			'success' => true,
			'post_id' => $post_id,
			'message' => 'Imagem destacada substituída com sucesso',
		));
	}
	

	private function extract_images_from_content($content)
	{
		$images = array();
		$doc = new DOMDocument();
		libxml_use_internal_errors(true);
		$doc->loadHTML(mb_convert_encoding($content, 'HTML-ENTITIES', 'UTF-8'));
		libxml_clear_errors();

		$img_tags = $doc->getElementsByTagName('img');
		foreach ($img_tags as $tag) {
			$image = array(
				'src'    => $tag->getAttribute('src'),
				'width'  => $tag->getAttribute('width'),
				'height' => $tag->getAttribute('height'),
				'alt'    => $tag->getAttribute('alt'),
				'class'  => $tag->getAttribute('class'),
			);

			if ($tag->getAttribute('class') && preg_match('/wp-image-(\d+)/i', $tag->getAttribute('class'), $matches)) {
				$image['attachment_id'] = intval($matches[1]);
				$attachment = get_post($image['attachment_id']);
				if ($attachment) {
					$image['title'] = $attachment->post_title;
					$image['caption'] = $attachment->post_excerpt;
				}
			}

			$images[] = $image;
		}

		return $images;
	}

	public function upload_image($request)
	{
		$files = $request->get_file_params();

		if (empty($files['image'])) {
			return new WP_Error('no_file', 'Nenhum arquivo foi enviado.', array('status' => 400));
		}

		require_once ABSPATH . 'wp-admin/includes/file.php';
		require_once ABSPATH . 'wp-admin/includes/media.php';
		require_once ABSPATH . 'wp-admin/includes/image.php';

		$attachment_id = media_handle_upload('image', 0);
		if (is_wp_error($attachment_id)) {
			return new WP_Error('upload_failed', 'Falha ao enviar a imagem.', array('status' => 500));
		}

		$url = wp_get_attachment_url($attachment_id);

		return rest_ensure_response(array(
			'success' => true,
			'url'     => $url,
			'id'      => $attachment_id,
			'message' => 'Imagem enviada com sucesso.'
		));
	}
}
