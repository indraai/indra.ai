// COPYRIGHT (C)2025 QUINN MICHAELS. ALL RIGHTS RESERVED.
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
		this.prompt(this._messages.init);
		return this.start(data, resolve);
	},
	async onDone(data, resolve) {
		// load the devas
		for (let deva in this.devas) {
			await this.load(deva, data.client);
		}
		setImmediate(() => {
			this.prompt(this._messages.done);
			return this.ready(data, resolve);		
		})
	},
	onError(err, reject) {
		console.log('MAIN ERROR', err);
	},
	async onStop(data) {
		this.prompt(this.vars.messages.stop);
		for (const deva in this.devas) {
			const unloaded = await this.unload(deva);
			this.prompt(unloaded);
		}
		return this.exit();
	},
	onReady(data) {
		this.prompt(this.vars.messages.ready);
		// return Promise.resolve(data);
	},
	onExit(data) {
		console.log(this.vars.messages.exit);
		// return Promise.resolve(data);
	},
});

export default INDRA;
