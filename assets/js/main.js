"use strict";
$('menu .menu-button').on('click', (evt) => {
	$('body').toggleClass('open');
});
$('menu .menu-options-close').on('click', (evt) => {
	$('body').toggleClass('open');
});