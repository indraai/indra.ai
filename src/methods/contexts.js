"use strict";
// ©2025 Quinn A Michaels; All rights reserved. 
// Legal Signature Required For Lawful Use.
// Distributed under the VLA:21524957441626894690 LICENSE.md

export async function contexts(packet) {
	this.context('contexts');
	this.action('method', 'contexts');
	return this.func.lists('contexts');
}