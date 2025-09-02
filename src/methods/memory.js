// (c) Copyright 2025 Quinn A Michaels. All rights reserved.
"use strict";

export async function memory(packet) {
	this.context('memory');
	this.action('method', 'memory');
	const free = this.lib.os.freemem();
	const free_format = `${Math.round(free / 1024 / 1024 * 100) / 100} MB`;
	const total = this.lib.os.totalmem();
	const total_format = `${Math.round(total / 1024 / 1024 * 100) / 100} MB`;
	const text = `memory: ${free_format} / ${total_format}`;
	const html = `<p>${text}</p>`;
	const ret = {
		text,
		html,
		data: {
			free,
			total,
		}
	}
	return ret;
}