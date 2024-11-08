//* Used at deploy-commands.js to deploy the commands into the BOT

import { REST } from "@discordjs/rest";
import { Routes } from "discord.js";
import "dotenv/config";

import { bot } from "../config/config.json";

module.exports = async (commands: any[], globally = false): Promise<void> => {
	const token: string = process.env.BOT_TOKEN as string;
	console.log(">>>>>>>> Assign commands >>>>>>>>", token);
	const rest = new REST({ version: "10" }).setToken(token);

	//* Use for Production (Updates the commands globally)
	if (globally) {
		await rest.put(Routes.applicationCommands(bot.clientId), {
			body: commands,
		});
		console.log("Successfully registered commands globally");
		return;
	}

	//* Use for Development (Updates only the passed guild data)
	await rest.put(Routes.applicationGuildCommands(bot.clientId, bot.guildId), {
		body: commands,
	});
	console.log("Successfully registered commands to the guild server");
	return;
};
