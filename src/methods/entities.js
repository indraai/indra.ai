"use strict";
// ©2025 Quinn A Michaels; All rights reserved. 
// Legal Signature Required For Lawful Use.
// Distributed under the VLA:21524957441626894690 LICENSE.md

export async function entities(packet) {
	this.context('entities', packet.id);
	return new Promise(async (resolve, reject) => {
		// first thing is to get the list of entities/devas
		const jsondata =[];
		const {dir} = this.config;
		const devas = packet.q.text ? packet.q.text.split(',') : Object.keys(this.devas);
		this.state('try', `entities:${packet.id}`);
		try {
			for (let deva of devas) {
				const d = this.devas[deva];
				const {id, key, prompt, profile, created, hash} = d.agent();
				const info = d.info();
				this.state('set', `newitem:${deva}`);
				const newitem = {
					id,
					key,
					package: info.name,
					name: profile.name,
					describe: profile.describe,
					version: info.package,
					url: `/devas/${key}`,
					color: profile.color,
					bgcolor: profile.bgcolor,
					background: profile.background,
					emoji: profile.emoji,
					avatar: profile.avatar,
					hash,
					created: this.lib.formatDate(created, 'long', true),
				};
				jsondata.push(newitem);
	
				const help = await this.question(`${this.askChr}${key} help`);
				const htmlpath = this.lib.path.join(dir, 'devas', `${key}.html`);
	
				// const greeting = await this.question(`${this.askChr}${key} ask We are publishing your page to the Indra.ai site. Let's write a greeting for everyone so they can get to know you in one paragraph please.`);
				
				const html = [
					'---',
					`id: ${id}`,
					`key: ${key}`,
					`name: ${profile.name}`,
					`title: ${profile.title}`,
					`subtitle: ${profile.subtitle}`,
					`describe: ${profile.describe}`,
					`layout: ${profile.layout}`,
					`image: ${profile.image}`,
					`background: ${profile.background}`,
					`emoji: ${profile.emoji}`,
					`avatar: ${profile.avatar}`,
					`color: ${profile.color}`,
					`label: rgb(${prompt.colors.label.R},${prompt.colors.label.G},${prompt.colors.label.B})`,
					`text: rgb(${prompt.colors.text.R},${prompt.colors.text.G},${prompt.colors.text.B})`,
					`bgcolor: ${profile.bgcolor}`,
					`tweet: ${profile.tweet}`,
					`hashtags: ${profile.hashtags}`,
					'---',
					// `<article class="greeting">${greeting.a.html}</article>`,
					help.a.html,
				].join('\n');
	
				this.lib.fs.writeFileSync(htmlpath, html, {encoding: 'utf8',flag:'w'});
	
				this.prompt(`entity:${deva}`);
			}				
			const jsonpath = this.lib.path.join(dir, '_data', 'devas.json');
			this.lib.fs.writeFileSync(jsonpath, JSON.stringify(jsondata, null, 2), {encoding: 'utf8',flag:'w'});
			return resolve({
				text: this.vars.messages.entities,
				html: this.vars.messages.entities,
				data: jsondata,
			});
		} catch (err) {
			this.state('catch', `entities:${packet.id}`);
			return this.error(err, packet, reject);				
		}
	
	});	
}