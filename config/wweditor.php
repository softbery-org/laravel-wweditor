<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Route Prefix
    |--------------------------------------------------------------------------
    |
    | This option controls the route prefix for wwEditor routes.
    | Default is 'wweditor'.
    |
    */
    'route_prefix' => env('WWEDITOR_ROUTE_PREFIX', 'wweditor'),

    /*
    |--------------------------------------------------------------------------
    | Middleware
    |--------------------------------------------------------------------------
    |
    | This option controls the middleware applied to wwEditor routes.
    | Default is ['web'].
    |
    */
    'middleware' => env('WWEDITOR_MIDDLEWARE', ['web']),

    /*
    |--------------------------------------------------------------------------
    | Storage Disk
    |--------------------------------------------------------------------------
    |
    | This option controls which storage disk to use for saving content.
    | Default is 'local'.
    |
    */
    'disk' => env('WWEDITOR_DISK', 'local'),

    /*
    |--------------------------------------------------------------------------
    | Default Toolbar
    |--------------------------------------------------------------------------
    |
    | This option controls the default toolbar configuration.
    |
    */
    'toolbar' => [
        'undo', 'redo', '|',
        'formatBlock', '|',
        'bold', 'italic', 'underline', 'strikethrough', '|',
        'justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull', '|',
        'insertOrderedList', 'insertUnorderedList', 'outdent', 'indent', '|',
        'createLink', 'insertImage', 'insertTable', 'insertHorizontalRule', '|',
        'fontSize', 'textColor', 'bgColor', '|',
        'removeFormat', 'subscript', 'superscript'
    ],

    /*
    |--------------------------------------------------------------------------
    | Available Modes
    |--------------------------------------------------------------------------
    |
    | This option controls the available editing modes.
    |
    */
    'modes' => ['wysiwyg', 'html', 'css', 'preview'],

    /*
    |--------------------------------------------------------------------------
    | Default Height
    |--------------------------------------------------------------------------
    |
    | This option controls the default height of the editor.
    |
    */
    'default_height' => env('WWEDITOR_DEFAULT_HEIGHT', '600px'),

    /*
    |--------------------------------------------------------------------------
    | Auto Save
    |--------------------------------------------------------------------------
    |
    | This option controls whether auto-save is enabled by default.
    |
    */
    'auto_save' => env('WWEDITOR_AUTO_SAVE', true),

    /*
    |--------------------------------------------------------------------------
    | Auto Save Interval
    |--------------------------------------------------------------------------
    |
    | This option controls the auto-save interval in seconds.
    |
    */
    'auto_save_interval' => env('WWEDITOR_AUTO_SAVE_INTERVAL', 60),

    /*
    |--------------------------------------------------------------------------
    | Theme
    |--------------------------------------------------------------------------
    |
    | This option controls the default theme.
    |
    */
    'theme' => env('WWEDITOR_THEME', 'default'),

    /*
    |--------------------------------------------------------------------------
    | Allowed File Types
    |--------------------------------------------------------------------------
    |
    | This option controls which file types are allowed for upload.
    |
    */
    'allowed_file_types' => [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/svg+xml'
    ],

    /*
    |--------------------------------------------------------------------------
    | Max File Size
    |--------------------------------------------------------------------------
    |
    | This option controls the maximum file size for uploads in kilobytes.
    |
    */
    'max_file_size' => env('WWEDITOR_MAX_FILE_SIZE', 2048),

    /*
    |--------------------------------------------------------------------------
    | External Libraries
    |--------------------------------------------------------------------------
    |
    | This option controls whether to use external CDN libraries.
    |
    */
    'use_external_libraries' => env('WWEDITOR_USE_EXTERNAL_LIBRARIES', true),

    /*
    |--------------------------------------------------------------------------
    | Custom CSS
    |--------------------------------------------------------------------------
    |
    | This option allows you to add custom CSS to the editor.
    |
    */
    'custom_css' => env('WWEDITOR_CUSTOM_CSS', ''),

    /*
    |--------------------------------------------------------------------------
    | Custom JavaScript
    |--------------------------------------------------------------------------
    |
    | This option allows you to add custom JavaScript to the editor.
    |
    */
    'custom_js' => env('WWEDITOR_CUSTOM_JS', ''),
];
