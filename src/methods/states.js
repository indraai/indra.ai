"use strict";

export async function states(packet) {
	this.context('states');
	this.action('method', 'states');
	return this.func.lists('states');
}