// (c) Copyright 2025 Quinn A Michaels. All rights reserved.
"use strict";

export async function actions(packet) {
	this.context('actions');
	this.action('method', 'actions');
	return this.func.lists('actions');	
}