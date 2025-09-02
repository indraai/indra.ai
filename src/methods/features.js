// (c) Copyright 2025 Quinn A Michaels. All rights reserved.
"use strict";

export async function features(packet) {
	this.context('features');
	this.action('method', 'features');
	return this.func.lists('features');	
}