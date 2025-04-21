"use strict";

export async function signature(packet) {
	this.context('signature');
	this.action('method', 'signature');
	const id = this.lib.uid();
	const date = Date.now();
	const agent = this.agent();
	const client = this.client();
	const sigstr = `${id}${client.profile.name}${date}`;
	
	const data = {
		id,
		name: client.profile.name,
		md5: this.lib.hash(sigstr),
		sha256: this.lib.hash(sigstr, 'sha256'),
		sha512: this.lib.hash(sigstr, 'sha512'),
		date: this.lib.formatDate(date, 'long', true),
	}
	const text = [
		`::begin:signature:${data.id}`,
		`name: ${data.name}`,
		`id: ${id}`,
		`md5: ${data.md5}`,
		`sha256: ${data.sha256}`,
		`sha512: ${data.sha512}`,
		`date: ${this.lib.formatDate(date, 'long', true)}`,				
		`::end:signature:${data.md5}`,
	].join('\n');
	return {
		text,
		html: false,
		data,
	}	
}