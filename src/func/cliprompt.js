"use strict";
// ©2025 Quinn A Michaels; All rights reserved. 
// Legal Signature Required For Lawful Use.
// Distributed under the VLA:21524957441626894690 LICENSE.md

export async function cliprompt(packet) {
	let text = packet.text;
	this.talk('cliprompt', packet.agent); // clears cli line
	console.log(chalk.rgb(packet.agent.prompt.colors.text.R, packet.agent.prompt.colors.text.G, packet.agent.prompt.colors.text.B)(text));
	this.talk('cliprompt', this.client()); // clears cli line	
}