"use strict";

import {devas} from './devas.js';
import {states} from './states.js';
import {actions} from './actions.js';
import {features} from './features.js';
import {zones} from './zones.js';
import {contexts} from './contexts.js';
import {memory} from './memory.js';
import {entities} from './entities.js';
import {algorithms} from './algorithms.js';

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
	algorithms,
	devas,
	states,
	actions,
	features,
	zones,
	contexts,
	memory,
	entities,
};