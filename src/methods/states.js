// (c) Copyright 2025 Quinn A Michaels. All rights reserved.
"use strict";

export async function states(packet) {
	this.context('states');
	this.action('method', 'states');
	return this.func.lists('states');
}