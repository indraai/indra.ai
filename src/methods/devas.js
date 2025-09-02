// (c) Copyright 2025 Quinn A Michaels. All rights reserved.
"use strict";

export async function devas(packet) {
	this.context('devas', packet.id);
	this.action('method', `devas:${packet.id}`);
	return this.func.devas(packet);	
}