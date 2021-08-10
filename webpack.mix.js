let mix = require('laravel-mix');

mix
	.js('example/example.js', 'example/dist.example.js')
	.setPublicPath('example');
