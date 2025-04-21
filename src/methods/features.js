"use strict";

export async function features(packet) {
	this.context('features');
	this.action('method', 'features');
	return this.func.lists('features');	
}