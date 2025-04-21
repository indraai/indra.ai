"use strict";

export async function cliprompt(packet) {
	let text = packet.text;
	this.talk('cliprompt', packet.agent); // clears cli line
	console.log(chalk.rgb(packet.agent.prompt.colors.text.R, packet.agent.prompt.colors.text.G, packet.agent.prompt.colors.text.B)(text));
	this.talk('cliprompt', this.client()); // clears cli line	
}