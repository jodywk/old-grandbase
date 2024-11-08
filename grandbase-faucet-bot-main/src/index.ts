// Starting Point of the project : run `node .`
import { Collection } from "discord.js";
import "dotenv/config";
import Keyv from "keyv";
import fs from "node:fs";
import path from "node:path";

import client from "./client"; // Get Client
import { InitializeDb } from "./database";

// KeyV Creation and Handling
const keyv = new Keyv();
keyv.on("error", (err?: Error) => {
	console.error("Keyv connection error:", err.message);
	throw new Error("Error KEYV: " + err.message);
});

// Run the Events
const eventsPath = path.join(__dirname, "events");
const eventFiles = fs.readdirSync(eventsPath);

for (const file of eventFiles) {
	const ePath = path.join(eventsPath, file);
	const event = require(ePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(keyv, client, ...args));
	}
}

// Gets all command files, and sets them
client.commands = new Collection();
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath);

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	//Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
}

// Database Connection
InitializeDb();

// Login to Bot with token
try {
	const token: string = process.env.BOT_TOKEN as string;
	console.log(">>>>>>>> Discord login >>>>>>>>", token);
	client.login(token);
} catch (error) {
	console.error(`Error login to BOT at index : ${error}`);
}
