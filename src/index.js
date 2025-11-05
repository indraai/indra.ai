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
	VLA: pkg.VLA,
	copyright: pkg.copyright,
};

const INDRA = new Deva({
	info,
	agent,
	vars,
	config: {
		dir: false,
		ports: vars.ports,
		hash: {},
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
		this.prompt(`⏱️  ${this.lib.formatDate(Date.now(), 'long', true)}`);
		this.prompt(`uid: ${data.id.uid}`);
		this.prompt(`warning: ${data.id.warning}`);
		this.prompt(`md5: ${data.id.md5}`);
		this.prompt(`sha256: ${data.id.sha256}`);
		this.prompt(`sha512: ${data.id.sha512}`);
		this.prompt(`${this.vars.messages.init} > uid:${data.id.uid}`);
		return this.start(data, resolve);
	},
	async onStart(data, resolve) {
		this.prompt(`${this.vars.messages.start} > uid:${data.id.uid}`);
		return this.enter(data, resolve);
	},
	async onEnter(data, resolve) {
		this.prompt(`${this.vars.messages.enter} > uid:${data.id.uid}`);
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
			this.prompt(`${this.vars.messages.done} > uid:${data.id.uid}`);
			return this.ready(data, resolve);
		});
	},
	async onReady(data) {
		this.prompt(`${this.vars.messages.ready} > uid:${data.id.uid}`);
		this.prompt(`⏱️  ${this.lib.formatDate(Date.now(), 'long', true)}`);
	},
	async onStop(data, resolve) {
		for (const deva in this.devas) {
			const unloaded = await this.unload(deva);
			this.prompt(deva);
		}
		this.prompt(`${this.vars.messages.stop} > uid:${data.id.uid}`);
		return this.close(data, resolve);
	},
	async onClose(data, resolve) {
		this.prompt(`${this.vars.messages.close} > uid:${data.id.uid}`);
		return this.leave(data, resolve);
	},
	async onLeave(data, resolve) {
		this.prompt(`${this.vars.messages.leave} > uid:${data.id.uid}`);
		return this.exit(data, resolve);
	},
	async onExit(data, resolve) {
		this.prompt(`${this.vars.messages.exit} > uid:${data.id.uid}`);
		return this.shutdown(data, resolve);
	},
	async onShutdown(data, resolve) {
		this.prompt(`${this.vars.messages.shutdown} > uid:${data.id.uid}`);
		return resolve(data);
	},
	onError(err, reject) {
		console.log('MAIN ERROR', err);
	},
});

export default INDRA;
