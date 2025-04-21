"use strict";

export async function contexts(packet) {
	this.context('contexts');
	this.action('method', 'contexts');
	return this.func.lists('contexts');
}