<?php
/**
 * This file adds functions to the japonizm WordPress theme.
 *
 * @package japonizm
 * @author  Shohei Yamazaki
 * @license GNU General Public License v2 or later
 * @link    https://japonizmwp.com
 */

namespace japonizm;


/**
 * in18n　テキストドメインを登録
 */
load_theme_textdomain( 'japonizm', get_template_directory() . '/languages' );

/**
 * テーマのデフォルト設定とさまざまなWordPress機能を登録
 */
function setup() {
	//独自のエディタースタイルを有効にする
	add_theme_support('editor-styles'); 
	// エディタースタイルとフォントをキューに追加
	add_editor_style( 'style.css' );

	// コアブロックパターンを削除
	remove_theme_support( 'core-block-patterns' );
}
add_action( 'after_setup_theme', __NAMESPACE__ . '\setup' );


/**
 * スタイルシートをキューに追加
 */
function enqueue_style_sheet() {
	wp_enqueue_style( sanitize_title( __NAMESPACE__ ), get_template_directory_uri() . '/style.css', array(), wp_get_theme()->get( 'Version' ) );
}
add_action( 'wp_enqueue_scripts', __NAMESPACE__ . '\enqueue_style_sheet' );


/**
 * ブロックスタイルのバリエーションを追加
 */
function register_block_styles() {

	$block_styles = array(
		'core/list'                      => array(
			'list-check'        => __( 'Check', 'japonizm' ),
			'list-check-circle' => __( 'Check Circle', 'japonizm' ),
			'list-boxed'        => __( 'Boxed', 'japonizm' ),
		),
		'core/code'                      => array(
			'dark-code' => __( 'Dark', 'japonizm' ),
		),
		'core/cover'                     => array(
			'blur-image-less' => __( 'Blur Image Less', 'japonizm' ),
			'blur-image-more' => __( 'Blur Image More', 'japonizm' ),
			'rounded-cover'   => __( 'Rounded', 'japonizm' ),
			'circle-cover'   => __( 'Circled', 'japonizm' ),
		),
		'core/column'                    => array(
			'column-box-shadow' => __( 'Box Shadow', 'japonizm' ),
		),
		'core/post-excerpt'              => array(
			'excerpt-truncate-2' => __( 'Truncate 2 Lines', 'japonizm' ),
			'excerpt-truncate-3' => __( 'Truncate 3 Lines', 'japonizm' ),
			'excerpt-truncate-4' => __( 'Truncate 4 Lines', 'japonizm' ),
		),
		'core/group'                     => array(
			'column-box-shadow' => __( 'Box Shadow', 'japonizm' ),
			'background-blur' => __( 'Background Blur', 'japonizm' ),
			'column-box-border' => __( 'Border', 'japonizm' ),
		),
		'core/separator'                 => array(
			'separator-dotted' => __( 'Dotted', 'japonizm' ),
			'separator-thin'   => __( 'Thin', 'japonizm' ),
		),
		'core/image'                     => array(
			'rounded-full' => __( 'Rounded Full', 'japonizm' ),
			'media-boxed'  => __( 'Boxed', 'japonizm' ),
			'media-shine'  => __( 'Shiny', 'japonizm' ),
		),
		'core/preformatted'              => array(
			'preformatted-dark' => __( 'Dark Style', 'japonizm' ),
		),
		'core/post-terms'                => array(
			'term-button' => __( 'Button Style', 'japonizm' ),
		),
		'core/video'                     => array(
			'media-boxed' => __( 'Boxed', 'japonizm' ),
		),
		'core/heading'                     => array(
			'heading-boxed' => __( '囲みタイトル', 'japonizm' ),
			'heading-gradient' => __( 'Gradient Style', 'japonizm' ),
			'heading-line' => __( 'Line Style', 'japonizm' ),
			'heading-gradient-text' => __( 'Gradient Text Style', 'japonizm' ),
		),
	);

	foreach ( $block_styles as $block => $styles ) {
		foreach ( $styles as $style_name => $style_label ) {
			register_block_style(
				$block,
				array(
					'name'  => $style_name,
					'label' => $style_label,
				)
			);
		}
	}
}
add_action( 'init', __NAMESPACE__ . '\register_block_styles' );


/**
 * ブロックが使用されている場合にのみカスタムブロックスタイルを読み込む
 */
function enqueue_custom_block_styles() {

	// スタイルフォルダをスキャンしてブロックスタイルを見つける
	$files = glob( get_template_directory() . '/assets/styles/*.css' );

	foreach ( $files as $file ) {

		// Get the filename and core block name.
		$filename   = basename( $file, '.css' );
		$block_name = str_replace( 'core-', 'core/', $filename );

		wp_enqueue_block_style(
			$block_name,
			array(
				'handle' => "japonizm-block-{$filename}",
				'src'    => get_theme_file_uri( "assets/styles/{$filename}.css" ),
				'path'   => get_theme_file_path( "assets/styles/{$filename}.css" ),
			)
		);
	}
}
add_action( 'init', __NAMESPACE__ . '\enqueue_custom_block_styles' );


/**
 * パターンカテゴリを登録
 */
function pattern_categories() {

	$block_pattern_categories = array(
		'japonizm/card'           => array(
			'label' => __( 'Cards', 'japonizm' ),
		),
		'japonizm/call-to-action' => array(
			'label' => __( 'Call To Action', 'japonizm' ),
		),
		'japonizm/features'       => array(
			'label' => __( 'Features', 'japonizm' ),
		),
		'japonizm/hero'           => array(
			'label' => __( 'Hero', 'japonizm' ),
		),
		'japonizm/pages'          => array(
			'label' => __( 'Pages', 'japonizm' ),
		),
		'japonizm/posts'          => array(
			'label' => __( 'Posts', 'japonizm' ),
		),
		'japonizm/pricing'        => array(
			'label' => __( 'Pricing', 'japonizm' ),
		),
		'japonizm/testimonial'    => array(
			'label' => __( 'Testimonials', 'japonizm' ),
		),
	);

	foreach ( $block_pattern_categories as $name => $properties ) {
		register_block_pattern_category( $name, $properties );
	}
}
add_action( 'init', __NAMESPACE__ . '\pattern_categories', 9 );


/**
 * ページネーションが存在しない場合、ブログ/アーカイブの最後のセパレーターを削除する
 * Remove last separator on blog/archive if no pagination exists.　
 */
function is_paginated() {
	global $wp_query;
	if ( $wp_query->max_num_pages < 2 ) {
		echo '<style>.blog .wp-block-post-template .wp-block-post:last-child .entry-content + .wp-block-separator, .archive .wp-block-post-template .wp-block-post:last-child .entry-content + .wp-block-separator, .blog .wp-block-post-template .wp-block-post:last-child .entry-content + .wp-block-separator, .search .wp-block-post-template .wp-block-post:last-child .wp-block-post-excerpt + .wp-block-separator { display: none; }</style>';
	}
}
add_action( 'wp_head', __NAMESPACE__ . '\is_paginated' );


/**
 * サイドバーテンプレートパーツエリアを追加
 * Add a Sidebar template part area
 */
function template_part_areas( array $areas ) {
	$areas[] = array(
		'area'        => 'sidebar',
		'area_tag'    => 'section',
		'label'       => __( 'Sidebar', 'japonizm' ),
		'description' => __( 'The Sidebar template defines a page area that can be found on the Page (With Sidebar) template.', 'japonizm' ),
		'icon'        => 'sidebar',
	);

	return $areas;
}
add_filter( 'default_wp_template_part_areas', __NAMESPACE__ . '\template_part_areas' );

/**
 * フェードインエフェクトの追加
 * Add Fade in Effect
 */
function add_fade_in_script() {
    wp_enqueue_script(
        'fade-in-animation',
        get_template_directory_uri() . '/assets/js/fade-in.js', 
        array(), 
        null, 
        true 
    );
}
add_action('wp_enqueue_scripts', __NAMESPACE__ . '\add_fade_in_script');

/**
 * フェードインエフェクトの追加
 * Add Fade in Effect
 */
function add_custom_animation_script() {
    wp_enqueue_script(
        'custom-animation-settings',
        get_template_directory_uri() . '/assets/js/custom-animation-settings.js',
        array( 'wp-blocks', 'wp-hooks', 'wp-edit-post', 'wp-components', 'wp-data', 'wp-i18n' ),
        null,
        true
    );
}
add_action('enqueue_block_editor_assets', __NAMESPACE__ . '\add_custom_animation_script');

/**
 * サイドバー設定の追加
 * Add Sidebar settings
 */
if ( file_exists( get_template_directory() . '/inc/settings-sidebar/settings-sidebar.php' ) ) {
	require_once get_template_directory() . '/inc/settings-sidebar/settings-sidebar.php';
} else {
	error_log( 'settings-sidebar.phpファイルが見つかりません😮' );
}

function ollie_enqueue_block_editor_assets() {
	wp_enqueue_script(
		'ollie-settings-sidebar',
		get_template_directory_uri() . '/inc/settings-sidebar/build/index.js',
		array( 'wp-plugins', 'wp-edit-post', 'wp-components', 'wp-data', 'wp-compose' ),
		filemtime(get_template_directory() . '/inc/settings-sidebar/build/index.js'),
		true
	);
}
add_action( 'enqueue_block_editor_assets', __NAMESPACE__ . '\ollie_enqueue_block_editor_assets' );
