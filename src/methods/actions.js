"use strict";
// ©2025 Quinn A Michaels; All rights reserved. 
// Legal Signature Required For Lawful Use.
// Distributed under the VLA:21524957441626894690 LICENSE.md

export async function actions(packet) {
	this.context('actions');
	this.action('method', 'actions');
	return this.func.lists('actions');	
}