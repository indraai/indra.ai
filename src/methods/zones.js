"use strict";

export async function zones(packet) {
	this.context('zones');
	this.action('method', 'zones');
	return this.func.lists('zones');	
}