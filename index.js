#!/usr/bin/env node
// ©2025 Quinn A Michaels; All rights reserved. 
// Legal Signature Required For Lawful Use.
// Distributed under the VLA:21524957441626894690 LICENSE.md
// Indra.ai

// setup main variables
import punycode from 'punycode';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import needle from 'needle';
import chalk from 'chalk';

import pkg from './package.json' with {type:'json'}
const {agent, vars} = pkg.data;

// set the __dirname
import {dirname} from 'node:path';
import {fileURLToPath} from 'node:url';    
const __dirname = dirname(fileURLToPath(import.meta.url));

// load agent configuration file
import data from './src/data/index.js';
const {client} = data;

import express from 'express';
const app = express();
app.use(express.json());

const port = vars.ports.api;

import readline from 'readline';
const shell = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

import INDRA from './src/index.js';
INDRA.config.dir = __dirname;

function setPrompt(pr) {
	shell.prompt();
	if (!pr) return;
	else if (!pr.prompt) return;
	else {
		const {colors} = pr.prompt;
		const setPrompt = chalk.rgb(colors.label.R, colors.label.G, colors.label.B)(`${pr.prompt.text.trim()} > `);

		shell.setPrompt(setPrompt);
		shell.prompt();
	}
}

function setText(packet) {
	shell.prompt();
	if (!packet) return;
	const {agent, text} = packet;
	const {colors} = agent.prompt;
	const chalktext = chalk.rgb(colors.text.R, colors.text.G, colors.text.B)(text);

	console.log(chalktext.trim());
}

async function indraQuestion(q) {
	// the event that fires when a new command is sent through the shell.
	if (q.toLowerCase() === '/exit') return shell.close();
	const answer = await INDRA.question(q);

			// sen the necessary returned values to the shell prompt.
	setPrompt(answer.a.agent);
	setText(answer.a);

	setPrompt(answer.a.client);
	// if (answer.a.data) console.log(answer.a.data);
	INDRA.talk(`data:history`, answer);
	return answer;
}

// get network interfaces
const ipv4 = [];
const networks = os.networkInterfaces();
for (const x in networks) {
	networks[x].forEach(net => {
		let label = '🔶 EXT';
		if (net.internal) label = '🔷 INT';
		if (net.family == 'IPv4') ipv4.push(`${label}: http://${net.address}`);
	})
}


const line_break = `░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░`;
const devaFlash = (opts) => `
██╗███╗   ██╗██████╗ ██████╗  █████╗     █████╗ ██╗
██║████╗  ██║██╔══██╗██╔══██╗██╔══██╗   ██╔══██╗██║
██║██╔██╗ ██║██║  ██║██████╔╝███████║   ███████║██║
██║██║╚██╗██║██║  ██║██╔══██╗██╔══██║   ██╔══██║██║
██║██║ ╚████║██████╔╝██║  ██║██║  ██║██╗██║  ██║██║
╚═╝╚═╝  ╚═══╝╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝╚═╝  ╚═╝╚═╝

🪪   License:   ${pkg.license}
📝  Describe:  ${pkg.description}

👤  Client:    ${opts.client.profile.name} (${opts.client.id})
👤  Agent:     ${opts.agent.profile.name} (${opts.agent.id})

📛  Name:      ${pkg.name}
💚  Ver:       ${pkg.version}
✍️   Author:    ${pkg.author.name}
📌 Company:    ${pkg.author.company}
📧   Email:    ${pkg.author.email}

🔗  Url:       ${pkg.homepage}
🐣  Git:       ${pkg.repository.url}

${opts.ip}

${pkg.copyright}

${line_break}
`;

// log the main server information to the console

console.log(chalk.green(devaFlash({
	client,
	agent,
	ip: ipv4.map(ip => `${ip}:${vars.ports.api}`).join('\n\r'),
})));

// create the static routes for the local server.
// public is used to deliver local assets
const pubOpts = {
	dotfiles: 'ignore',
	extensions: ['htm', 'html', 'json'],
	index: 'index.html, index.json',
};

app.get('/assets/{*splat}', (req, res, next) => {
	const opts = {
	root: path.join(__dirname, 'assets'),
	dotfiles: 'deny',
	headers: {
		'x-timestamp': Date.now(),
		'x-sent': true
	}
	};
	return res.sendFile(req.params.splat.join('/'), opts, (err) => {
		if (err) {
			console.log('some stupid error here', req.params.splat.join('/'));
			next(err);
		}
	});
		
});

app.get('/', (req, res, next) => {
	const opts = {
		root: path.join(__dirname, 'src', 'ui'),
		dotfiles: 'deny',
		headers: {
			'x-timestamp': Date.now(),
			'x-sent': true
		}
	};
	return res.sendFile('index.html', opts, (err) => {
		if (err) next(err);
	});
});

app.post('/question', (req, res, next) => {
	indraQuestion(req.body.question).then(answer => {
		return res.json(answer)
	}).catch(err => {
		return res.send(err);
	});
});

function DevaDir(opts) {
	app.get(`/devas/${opts.key}/{*splat}`, (req, res, next) => {
		const devadir = {
		root: path.join(opts.dir, 'assets'),
		dotfiles: 'deny',
		headers: {
			'x-timestamp': Date.now(),
			'x-sent': true
		}
		};
		return res.sendFile(req.params.splat.join('/'), devadir, (err) => {
			if (err) {
				next(err);
			}
		});
	});
}

	// initialize the INDRA
INDRA.init(client).then(_init => {
	setPrompt(INDRA.client());  
	// cli prompt listener for relaying from the deva to the prompt.
	INDRA.listen('cliprompt', ag => {
		setPrompt(ag);
	});		
	INDRA.listen('clitext', ag => {
		setText(ag);
	});		
	INDRA.listen('deva:dir', opts => {
		DevaDir(opts);
	});
	INDRA.belief('vedic');
	app.listen(vars.ports.api, () => {
		INDRA.prompt(`${vars.messages.listening} PORT:${vars.ports.api}`);
	});
});

// run operation when new line item in shell.
shell.on('line', question => {
	indraQuestion(question);
}).on('pause', () => {

}).on('resume', () => {

}).on('close', () => {
	// begin close procedure to clear the system and close other devas properly.
	INDRA.stop().then(stop => {
		shell.prompt();
		process.exit(0);
	}).catch(console.error);

}).on('SIGCONT', () => {
}).on('SIGINT', data => {
	shell.close();
}).on('SIGSTOP', () => {});

