"use strict";
import chalk from 'chalk';

export default {
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
}