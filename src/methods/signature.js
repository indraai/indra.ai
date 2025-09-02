// (c) Copyright 2025 Quinn A Michaels. All rights reserved.
"use strict";

export async function signature(packet) {
	this.context('signature');
	this.action('method', 'signature');
	const id = this.lib.uid();
	const date = this.lib.formatDate(Date.now(), 'long', true);
	const agent = this.agent();
	const name = this.client().profile.name;
	const sigstr = `${id}${name}${date}`;
	
	const data = {
		id,
		name,
		md5: this.lib.hash(sigstr, 'md5'),
		sha256: this.lib.hash(sigstr, 'sha256'),
		sha512: this.lib.hash(sigstr, 'sha512'),
		date,
	}
	const text = [
		`::begin:signature:${data.id}`,
		`id: ${id}`,
		`name: ${data.name}`,
		`date: ${date}`,				
		data.md5,
		data.sha256,
		data.sha512,
		`::end:signature:${data.id}`,
	].join('\n').trim();
	return {
		text,
		html: false,
		data,
	}	
}