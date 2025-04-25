"use strict";

import {devas} from './devas.js';
import {states} from './states.js';
import {actions} from './actions.js';
import {features} from './features.js';
import {zones} from './zones.js';
import {contexts} from './contexts.js';
import {memory} from './memory.js';
import {signature} from './signature.js';
import {entities} from './entities.js';

export default {

	/**************
	method: client
	params: packet
	describe: Return the current client information loaded.
	***************/
	async client(packet) {
		this.context('client');
		this.action('method', 'client');
		const text = `${this._client.prompt.emoji} ${this._client.key} | ${this._client.profile.name} |  ${this._client.id}`;
		return Promise.resolve({text, data:this._client});
	},
	
	/**************
	method: agent
	params: packet
	describe: Return the current agent information loaded.
	***************/
	async agent(packet) {
		this.context('agent');
		this.action('method', 'agent');
		const text = `${this._agent.prompt.emoji} ${this._agent.key} ${this._agent.profile.name} |  ${this._agent.id}`;
		return Promise.resolve({text, data: this._agent});
	},

	devas,
	states,
	actions,
	features,
	zones,
	contexts,
	memory,
	signature,
	
	/*********
	name: algo
	describe: algo is the method that publishes 
						the algorithms to the /algorithms directory
	*********/
	algo(packet) {
		this.context('entities', packet.id);
		return new Promise((resolve, reject) => {
			this.action('method', `algo:${packet.id}`);

			this.question(`${this.askChr}algorithm list`).then(async algos => {
				const {dir} = this.config;
				const jsondata = [];
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

					const jsonpath = this.lib.path.join(dir, '_data', 'algorithms.json');
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
	},
	entities,
};