// (c) Copyright 2025 Quinn A Michaels. All rights reserved.
"use strict";

export async function zones(packet) {
	this.context('zones');
	this.action('method', 'zones');
	return this.func.lists('zones');	
}