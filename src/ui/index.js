// Copyright (c)2025 Quinn Michaels
"use strict";
import {io} from 'socket.io-client';

const emojis = {
	weather:'🌦',
	get:'⏬',
	put: '⏫',
	key: '🔑',
	eat: '🥗',
	drink:'🥛',
	pos: '🚹',
	exp: '🪖',
	gold: '💰',
	depart: '🚶',
	arrive: '🚶',
	player: '🧑',
	alert: '🚨',
	trigger: '🔫',
	save: '💾',
	light: '🔦',
	wield: '🔪',
	head: '🧢',
	legs: '🦿',
	feet: '🥾',
	hands: '✋',
	waist: '🥋',
	rwrist: '👉',
	lwrist: '👈',
	body: '👕',
	arms: '🦾',
	shield: '🛡',
	about: '🎒',
	say: '💬',
	door: '🚪',
	info: '💁',
	error: '❌',
	fight: '🥊',
	sound: '🔊'
};

class DevaInterface {
	constructor() {
		this.client = false;
		this._content = false;
		this.socket = false;
		this._shell = [];        // used for keeping track of items in the console.
		this._console = {
			context: [],
			feature: [],
			zone: [],
			action: [],
			state: [],
			intent: [],
			belief: [],
			alerts: [],
			panel: [],
		}
		this._features = [
			'security',
			'support',
			'services',
			'systems'
		];
		this.history_count = 25;
	}

	set content(txt) {
		this._content = txt;
	}
	get content() {
		return this._content;
	}

	_logData(data) {
		const _html = [
			`<div class="item datalog">`,
			this._keyValue(data),
			`</div>`,
		].join('\n');
		$('#PanelConsole').prepend(_html);
	}

	_scrollTop(elem) {
		return setTimeout(() => {
			const so = document.getElementById(elem);
			so.scrollTop = 0;
		}, 100);
	}

	Question(text, log=true) {
		$('.event-panel > article').empty();
		if (log) this.Console({
			type: 'question',
			format: 'client',
			text,
			agent: this.client,
		});
		
		return new Promise((resolve, reject) => {
			// this.Clear(q);
			axios.post('/question', {
				question: text,
			}).then(response => {
				const answer = response.data;
				this._logData({[answer.id]: answer});
				return this.processor(answer.a);
			}).catch(err => {
				console.log('error', err);
				return reject(err);
			});
		});
	}

	// the key value pair processor for output into html of recursive structures.
	_keyValue(obj) {
		// create html key pair format
		const output = [];
		for (let key in obj) {
			const v = obj[key];
			if (typeof v === 'object') {
				output.push(`<div class="child"><div class="key">${key}</div><div class="values">${this._keyValue(v)}</div></div>`);
			}
			else if (Array.isArray(v)) {
				v.forEach((av,idx) => {
					output.push(`<div class="row"><div class="value">${idx}. ${av}</div></div>`);
				});
			}
			else {
				let _temp = v;
				if (_temp && _temp.toString().startsWith('/')) _temp = `<button class="jump" data-data="${v}">${v}</button>`;
				if (key !== 'html') output.push(`<div class="row"><div class="key">${key}:</div><div class="value">${_temp}</div></div>`);
			};
		}
		return output.join('\n');
	}


	// load key value pair objects into the this scope and output to a data container
	GetKeyPair(opts) {
		this[opts.var] = opts.data;
		const content =`<div class="DataContainer" id="${opts.id}"><h1>${opts.var}</h1>${this._keyValue(opts.data)}</div>`;
		this.Viewer(content)
	}

	Client(data) {
		if (this.client) return;

		this.client = data;

		this.GetKeyPair({
			data,
			id: 'Client',
			var: 'client'
		});

		const shell = document.getElementById('Prompt');
		const label = document.getElementById('PromptLabel');
		const $header = $('#PromptHeader');
		const $footer = $('#PromptFooter');

		const {prompt} = this.client;
		
		$header.val(prompt.header);
		$footer.val(prompt.footer);

		const {colors} = prompt;
		if (shell) {
			shell.style.color = `rgb(${colors.text.R}, ${colors.text.G}, ${colors.text.B})`;
		}
		if (label) {
			label.style.color = `rgb(${colors.label.R}, ${colors.label.G}, ${colors.label.B})`;
			label.innerHTML = `${prompt.emoji} ${prompt.text}`;
		}
	}

	Viewer(html) {
		// first let's add the class
		$('#Viewer').removeClass('fade-in').addClass('fade-out');
		setTimeout(() => {
			$('#Viewer').html(html);
			const so = document.getElementById('Viewer');
			so.scrollTop = 0;
			$('#Viewer').removeClass('fade-out').addClass('fade-in');
			return Promise.resolve(true);
		}, 1000);
	}

	Console(opts) {
		if (!opts.text) return;

		if (this._shell.length > this.history_count) {
			this._shell.shift();
			$('#ConsoleItems .item').first().remove();
		}

		this._shell.push(opts);

		const {type, format, agent, text, data} = opts;
		const {prompt, profile, key} = agent;
		const {colors} = prompt;
		const prompt_color = `rgb(${colors.label.R}, ${colors.label.G}, ${colors.label.B})`;
		const text_color = `rgb(${colors.text.R}, ${colors.text.G}, ${colors.text.B})`;
		let theHtml = `
		<div class="item ${type} ${format}">
			<div class="person" style="color: ${prompt_color}"><span class="avatar"><img src="${profile.emoji}"/></span><span class="agent">${prompt.text}</span></div>
			<div class="text" style="color: ${text_color}">${text}</div>
		</div>`;

		$('#ConsoleItems').append(theHtml);
		return setTimeout(() => {
			const so = document.getElementById('ConsoleItems');
			if (so) so.scrollTop = so.scrollHeight;
		}, 250);
	}

	PanelContent(data) {
		console.log('panel content data', data);
		$('#PanelContent').html('');
		$('#PanelContent').html(data.html)
	}

	devacore(data) {
		if (!this._console[data.key]) return;
		const selector = `.deva-core.${data.key} > article`;
		const {colors} = data.agent.prompt;
		const html = [
			`<div class="item ${data.key} ${data.value}" data-id="${data.id}" data-hash="${data.hash}">`,
			`<span class="emoji"><img src="${data.agent.profile.emoji}"></span>`,
			`<span class="label" style="color:rgb(${colors.label.R},${colors.label.G},${colors.label.B});">#${data.agent.key}</span>`,
			`<span class="text" style="color:rgb(${colors.text.R},${colors.text.G},${colors.text.B});">${data.text}<span>`,
			'</div>',
		].join('\n');

		this._console[data.key].push(data);
		$(selector).prepend(html)
	}
	
	docs(data) {
		console.log('DOCS DATA', data);
		if (data.meta.method === 'view') {
			if (data.meta.params[2] && data.meta.params[2] === 'panel') $('#Panel').html(data.html)
			else this.Viewer(data.html);
			return;
		}
		this.Console({
			type: data.meta.key,
			method: data.meta.method,
			agent: data.agent,
			meta: data.meta,
			text: data.html ? data.html : data.text,
		});
	}
	
	legal(data) {
		console.log('LEGAL DATA', data);
		if (data.meta.method === 'file') {
			if (data.meta.params[2] && data.meta.params[2] === 'panel') $('#Panel').html(data.html)
			else this.Viewer(data.html);
			return;
		}
		this.Console({
			type: data.meta.key,
			method: data.meta.method,
			agent: data.agent,
			meta: data.meta,
			text: data.html ? data.html : data.text,
		});
	}

	veda(data) {
		console.log('DOCS DATA', data);
		if (data.meta.method === 'hymn') {
			// if (data.meta.params[2] && data.meta.params[2] === 'panel') $('#Panel').html(data.html)
			return this.Viewer(data.html);
		}
		return this.Console({
			type: data.meta.key,
			method: data.meta.method,
			agent: data.agent,
			meta: data.meta,
			text: data.html ? data.html : data.text,
		});
	}

	processor(data) {
		if (!data.text) return;
		const { meta } = data;
		const metaKey = meta.key;
		// here in the processor we want to check for any strings that also match from the first index.
		const viewer = ['help','file', 'laws'];
		const menu = ['devas', 'menu', 'books', 'book']

		if (menu.includes(meta.params[2])) return this.PanelContent(data);    
		if (menu.includes(meta.method)) return this.PanelContent(data);
		if (this._features.includes(meta.method)) return this.feature(data);
		if (viewer.includes(meta.method)) return this.Viewer(data.html);
		if (this[metaKey] && typeof this[metaKey] === 'function') return this[meta.key](data);
		// editor

		return this.Console({
			type: data.meta.key,
			format: data.meta.method,
			agent:data.agent,
			meta: data.meta,
			text: data.html ? data.html : data.text,
		});

	}

	Init(socket) {
		return new Promise((resolve, reject) => {
			this.socket = socket;

			$('body').on('click', '.child > .key', e => {
				$(e.target).toggleClass('open');

			}).on('click', '.art .text .box .image', e => {
				e.stopPropagation();
				e.preventDefault();
				$(e.target).closest('.image').toggleClass('artwork');

			}).on('click', '[data-law]', e => {
				e.stopPropagation()
				e.preventDefault();
				const law = $(e.target).closest('[data-law]').data('law');
				this.Question(law);

			}).on('click', '[data-cmd]', e => {
				e.stopPropagation()
				e.preventDefault();
				const cmd = $(e.target).closest('[data-cmd]').data('cmd');
				this.Question(cmd);

			}).on('click', '[data-prompt]', e => {
				e.stopPropagation()
				e.preventDefault();
				const cmd = $(e.target).closest('[data-tty]').data('tty');
				$('#Prompt').val(cmd);
				document.getElementById('Prompt').focus();

			}).on('click', '[data-button]', e => {
				e.stopPropagation()
				e.preventDefault();
				const cmd = $(e.target).closest('[data-button]').data('button')
				this.Question(cmd, false);
			});

			$('#PromptForm').on('submit', e => {
				e.stopPropagation();
				e.preventDefault();
				const question = $('#Prompt').val();
				this.Question(question).catch(console.error);
				$('#Prompt').val('');
			});

			// emit the socket event for the client data
			socket.on('socket:clientdata', data => {
				this.Client(data);
			});

			socket.on('socket:global', data => {
				return this.processor(data.a);
			});

			socket.on('socket:devacore', data => {
				this.Log(data)
			});

			socket.on('devacore:context', data => {
				return this.devacore(data);
			});
			socket.on('devacore:feature', data => {
				return this.devacore(data);
			});
			socket.on('devacore:zone', data => {
				return this.devacore(data);
			});
			socket.on('devacore:action', data => {
				return this.devacore(data);
			});
			socket.on('devacore:state', data => {
				return this.devacore(data);
			});
			socket.on('devacore:intent', data => {
				return this.devacore(data);
			});
			socket.on('devacore:belief', data => {
				console.log('belief data', data);
				return this.devacore(data);
			});

			return resolve();
		});
	}
}

const socket = io('http://localhost:9001');
const Deva = new DevaInterface();
Deva.Init(socket);
