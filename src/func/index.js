"use strict";
// ©2025 Quinn A Michaels; All rights reserved. 
// Legal Signature Required For Lawful Use.
// Distributed under the VLA:21524957441626894690 LICENSE.md

export default {
	cliprompt(packet) {
		this.talk('cliprompt', packet.agent); // clears cli line
		this.talk('clitext', packet);
		this.talk('cliprompt', this.client()); // clears cli line
	},
	
	
	addHistory(item) {
		this.vars.history.items.push(item)
		if (this.vars.history.items.length > this.vars.history.max_items) {
			const removed = this.vars.history.items.shift();
		}
	},
		
	devas(packet) {
		const agent = this.agent();
		return new Promise((resolve, reject) => {
			try {
				const devas = [
					`::BEGIN:DEVAS::${packet.id.uid}`,
					'::begin:menu'
				];
				for (let deva in this.devas) {
					const d = this.devas[deva];
					const {prompt, key, profile} = d.agent();
					devas.push(`button[${prompt.emoji} ${profile.name}]:${this.askChr}${key} help`);
				}
				devas.push('::end:menu');
				devas.push('::begin:hidden');
				devas.push('#color = {{profile.color}}');
				devas.push('#bgcolor = {{profile.bgcolor}}');
				devas.push('#bg = {{profile.background}}');
				devas.push('::end:hidden');          
				devas.push(`::END:DEVAS:${packet.id.uid}`);
	
				this.question(`${this.askChr}feecting parse ${devas.join('\n')}`).then(parsed => {
					return resolve({
						text:parsed.a.text,
						html:parsed.a.html,
						data:parsed.a.data,
					});
				}).catch(reject);
			} catch (e) {
				return this.error(e, packet, reject);
			}
		});
	}
}