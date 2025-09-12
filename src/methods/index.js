"use strict";
// ©2025 Quinn A Michaels; All rights reserved. 
// Legal Signature Required For Lawful Use.
// Distributed under the VLA:21524957441626894690 LICENSE.md

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
		this.zone('client', `client:${packet.id.uid}`);
		this.feature('client', `client:${packet.id.uid}`);
		this.context('client', `client:${packet.id.uid}`);
		this.action('method', `client:${packet.id.uid}`);
		this.state('set', `client:${packet.id.uid}`);
		const client = await this.methods.sign('client', 'default', packet);
		this.state('return', `client:${packet.id.uid}`);
		return client;
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