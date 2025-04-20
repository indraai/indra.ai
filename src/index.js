// COPYRIGHT (C)2025 QUINN MICHAELS. ALL RIGHTS RESERVED.
// Load INDRA CORE Mind into Deva
// set the __dirname
import {dirname} from 'node:path';
import {fileURLToPath} from 'node:url';    
const __dirname = dirname(fileURLToPath(import.meta.url));

import chalk from 'chalk';
import Deva from '@indra.ai/deva';

import devas from './devas/index.js';
import pkg  from '../package.json' with {type:'json'};

// load agent configuration file
import data from './data/index.js';
const {vars, agent, client} = data;

const info = {
	id: pkg.id,
	name: pkg.name,
	version: pkg.version,
	author: pkg.author,
	describe: pkg.description,
	dir: __dirname,
	url: pkg.homepage,
	git: pkg.repository.url,
	bugs: pkg.bugs.url,
	license: pkg.license,
	copyright: pkg.copyright,
};

const INDRA = new Deva({
	info,
	agent,
	vars,
	config: {
		dir: false,
		ports: vars.ports,
	},
	utils: {
		translate(input) {return input.trim();},
		parse(input) {return input.trim();},
		process(input) {return input.trim();}
	},
	devas,
	listeners: {},
	modules: {
		mind: false,
		psy: [],
	},
	func: {
		cliprompt(packet) {
			let text = packet.text;
			// if (this.vars.labels[packet.value]) text = `${this.vars.labels[packet.value]}:${packet.text}`;
			this.talk('cliprompt', packet.agent); // clears cli line
			console.log(chalk.rgb(packet.agent.prompt.colors.text.R, packet.agent.prompt.colors.text.G, packet.agent.prompt.colors.text.B)(text));
			this.talk('cliprompt', this.client()); // clears cli line
		},

		addHistory(item) {
			this.vars.history.items.push(item)
			if (this.vars.history.items.length > this.vars.history.max_items) {
				const removed = this.vars.history.items.shift();
			}
		},

		/**************
		func: devas
		params: packet
		describe: Build a list of devas currently loaded into the system.
		***************/
		devas(packet) {
			const agent = this.agent();
			return new Promise((resolve, reject) => {
				try {
					const devas = [
						`::BEGIN:DEVAS::${this.lib.uid()}`,
					];
					for (let deva in this.devas) {
						const d = this.devas[deva];
						const {prompt, key, profile} = d.agent();
						devas.push(`${prompt.emoji} ${profile.name}: ${this.askChr}${key} help`);
					}
					devas.push(`::END:DEVAS:${this.lib.hash(devas)}`);

					this.question(`${this.askChr}feecting parse ${devas.join('\n')}`).then(parsed => {
						return resolve({
							text:parsed.a.text,
							html:parsed.a.html,
							data:parsed.a.data,
						});
					}).catch(reject);
				} catch (e) {
					return reject(e);
				}
			});
		},

		lists(item) {
			return new Promise((resolve, reject) => {
				try {
					const items = this[item]();
					const _items = [
						`::begin:${items.key}`,
						`## ${item}`,
					];
					for (let item in items.value) {
						_items.push(`${item}: ${items.value[item]}`);
					}
					_items.push(`::end:${items.key}:${this.lib.hash(items)}`);

					this.question(`${this.askChr}feecting parse ${_items.join('\n')}`).then(parsed => {
						return resolve({
							text:parsed.a.text,
							html:parsed.a.html,
							data:parsed.a.data,
						});
					}).catch(reject)
				} catch (e) {
					return reject(d)
				}
			});
		}
	},
	methods: {

		/**************
		method: client
		params: packet
		describe: Return the current client information loaded.
		***************/
		client(packet) {
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
		agent(packet) {
			this.context('agent');
			this.action('method', 'agent');
			const text = `${this._agent.prompt.emoji} ${this._agent.key} ${this._agent.profile.name} |  ${this._agent.id}`;
			return Promise.resolve({text, data: this._agent});
		},

		/**************
		method: devas
		params: packet
		describe: Call devas function and return list of system devas.
		***************/
		devas(packet) {
			this.context('devas');
			this.action('method', 'devas');
			return this.func.devas(packet);
		},

		/**************
		method: states
		params: packet
		describe: Call states function and return list of system states.
		***************/
		states(packet) {
			this.context('states');
			this.action('method', 'states');
			return this.func.lists('states');
		},

		/**************
		method: actions
		params: packet
		describe: Call actions function and return list of system actions.
		***************/
		actions(packet) {
			this.context('actions');
			this.action('method', 'actions');
			return this.func.lists('actions');
		},

		/**************
		method: features
		params: packet
		describe: Call features function and return list of system features.
		***************/
		features(packet) {
			this.context('features');
			this.action('method', 'features');
			return this.func.lists('features');
		},

		/**************
		method: zones
		params: packet
		describe: Call zones function and return list of system zones.
		***************/
		zones(packet) {
			this.context('zones');
			this.action('method', 'zones');
			return this.func.lists('zones');
		},

		/**************
		method: contexts
		params: packet
		describe: Call contexts function and return list of system contexts.
		***************/
		contexts(packet) {
			this.context('contexts');
			this.action('method', 'contexts');
			return this.func.lists('contexts');
		},

		/**************
		method: memory
		params: packet
		describe: Return the current memory for the system deva.
		***************/
		memory(packet) {
			this.context('memory');
			this.action('method', 'memory');
			const free = this.os.freemem();
			const free_format = `${Math.round(free / 1024 / 1024 * 100) / 100} MB`;
			const total = this.os.totalmem();
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
			return Promise.resolve(ret);
		},
		
		async signature(packet) {
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
		},
	},
	onReady(data, resolve) {
		// listen for core prompt and forawrd to cliprompt function
		this.listen('devacore:prompt', packet => {
			this.func.cliprompt(packet);
		});
		// load the devas
		for (let x in this.devas) {
			this.devas[x].init(data.client);
		}
		return resolve(data);
	},
	onError(err, reject) {
		console.log('MAIN ERROR', err);
	},
	async onStop(data, resolve) {
		for (const deva in this.devas) {
			await this.devas[deva].stop();
		}
		return this.exit(data, resolve);
	},
});

export default INDRA;
