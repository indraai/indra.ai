// (c) Copyright 2025 Quinn A Michaels. All rights reserved.
"use strict";

/*********
name: algo
describe: algo is the method that publishes 
the algorithms to the /algorithms directory
*********/
export async function algorithms(packet) {
	this.context('algorithms', packet.id);
	return new Promise((resolve, reject) => {
		this.action('method', `algorithms:${packet.id}`);

		this.question(`${this.askChr}algorithm list`).then(async algos => {
			const {dir} = this.config;
			const jsondata = [];
			const jsonpath = this.lib.path.join(dir, '_data', 'algorithms.json');
			for (let item of algos.a.data) {
				const newitem = {
					id: item.id,
					url: `/${item.help}`,
					key: item.key,
					name: item.name,
					describe: item.describe,
					created: Date.now(),
				};
				newitem.hash = this.lib.hash(newitem);
				jsondata.push(newitem);
				const help = await this.question(`${this.askChr}algorithm help ${item.help}`);

				const html = [
				'---',
				`id: ${item.id}`,
				`name: ${item.name}`,
				`title: ${item.title}`,
				`subtitle: ${item.subtitle}`,
				`layout: ${item.layout}`,
				`emoji: ${item.emoji}`,
				`avatar: ${item.avatar}`,
				`image: ${item.image}`,
				`background: ${item.background}`,
				`label: ${item.label}`,
				`text: ${item.text}`,
				`color: ${item.color}`,
				`bgcolor: ${item.bgcolor}`,
				`describe: ${item.describe}`,
				`tweet: ${item.tweet}`,
				`hashtags: ${item.hashtags}`,
				`created: ${item.created}`,
				'---',
				help.a.html,
				].join('\n');

				const filepath = this.lib.path.join(dir, `${item.help}.html`);
				this.lib.fs.writeFileSync(filepath, html, {encoding:'utf8',flag:'w'});

				this.lib.fs.writeFileSync(jsonpath, JSON.stringify(jsondata, null, 2), {encoding:'utf8',flag:'w'});
			}
			this.state('resolve', `algo:${packet.id}`);
			return resolve({
				text: 'workign on it',
				html: 'workign on it',
				data: algos.a.data,
			});
		}).catch(err => {
			return this.error(err, packet, reject);
		})
	});
}