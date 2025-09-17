"use strict";
// ©2025 Quinn A Michaels; All rights reserved. 
// Legal Signature Required For Lawful Use.
// Distributed under the VLA:21524957441626894690 LICENSE.md

// Load INDRA CORE Mind into Deva
// set the __dirname
import {dirname} from 'node:path';
import {fileURLToPath} from 'node:url';    
const __dirname = dirname(fileURLToPath(import.meta.url));

import Deva from '/Users/quinnmichaels/Dev/deva/index.js';

import Devas from './devas/index.js';
import pkg  from '../package.json' with {type:'json'};
const {agent, vars} = pkg.data;

// load agent configuration file
import data from './data/index.js';
const {client} = data;


import methods from './methods/index.js';
import func from './func/index.js';

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
	devas: Devas,
	listeners: {},
	modules: {
		mind: false,
		psy: [],
	},
	func,
	methods,
	async onInit(data, resolve) {
		// listen for core prompt and forawrd to cliprompt function
		this.listen('devacore:prompt', packet => {
			this.func.cliprompt(packet);
		});
		this.prompt(`${this.vars.messages.init} VLA:${client.VLA.uid}`);
		return this.start(data, resolve);
	},
	async onStart(data, resolve) {
		this.prompt(`${this.vars.messages.start} VLA:${client.VLA.uid}`);
		return this.enter(data, resolve);
	},
	async onEnter(data, resolve) {
		this.prompt(`${this.vars.messages.enter} VLA:${client.VLA.uid}`);
		return this.done(data, resolve);
	},
	async onDone(data, resolve) {
		// load the devas
		for (let deva in this.devas) {
			await this.load(deva, data.client);
			// after the deva loads talk the event to set asset directory.
			const id = this.uid();
			const {dir} = this.devas[deva].info();
			const {key} = this.devas[deva].agent();
			this.talk(`deva:dir`, {id, key,dir});
		}

		setImmediate(() => {
			this.prompt(`${this.vars.messages.done} VLA:${client.VLA.uid}`);
			return this.ready(data, resolve);
		});
	},
	async onReady(data) {
		const uid = await this.question(`/uid`);
		this.prompt(uid.a.text);

		const sign = await this.question(`/sign:ready:${uid.id.uid} Deva Core Signature on #uid:${uid.id.uid}`);
		this.prompt(sign.a.text);
		// return Promise.resolve(data);

		this.prompt(`${this.vars.messages.ready} VLA:${client.VLA.uid}`);
	},
	async onStop(data) {
		this.prompt(this.vars.messages.stop);
		for (const deva in this.devas) {
			const unloaded = await this.unload(deva);
			this.prompt(unloaded);
		}
		return this.exit();
	},
	onExit(data) {
		this.prompt(this.vars.messages.exit);
		// return Promise.resolve(data);
	},
	onError(err, reject) {
		console.log('MAIN ERROR', err);
	},
});

export default INDRA;
