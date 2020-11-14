const Discord = require('discord.js');
const config = require('./config/config.json');
const jsonfile = require('jsonfile');
const getJSON = require('get-json');
let announced_races = jsonfile.readFileSync("./config/announced_races.json");
const client = new Discord.Client();
jsonfile.spaces = 4;

client.once('ready', () => {
	console.log('Ready!');
});

client.login(config.token);

client.on('message', message => {
	if (!message.content.startsWith(config.prefix) || message.author.bot) return;

	const args = message.content.slice(config.prefix.length).split(' ');
	const command = args.shift().toLowerCase();
	if (command === 'racelist') {
		getJSON('https://racetime.gg/races/data', function(error, response) {
			if (error) {
				return console.log(error);
			}
			const stringified = (JSON.stringify(response));
			const parsed = (JSON.parse(stringified));
			let noraces = true;
			const raceListEmbed = new Discord.MessageEmbed()
				.setColor('#0394fc')
				.setTitle('Current active races')
				.setTimestamp();
			if (parsed.races && parsed.races.length) {
				parsed.races.forEach(element => {
					if (JSON.stringify(element.category.slug).includes(config.filter)) {
						raceListEmbed.addFields(
							{ name: 'Game', value: element.category.name, inline: true },
							{ name: 'Category', value: element.goal.name, inline: true },
							{ name: 'Link', value: `https://racetime.gg${element.url}`, inline: true },
						);
						noraces = false;
					}
					else if (noraces) {
						raceListEmbed.setDescription('No races are currently active.')
					};
				});
			}
			else {
				raceListEmbed.setDescription('No races are currently active.')
			}
			message.channel.send(raceListEmbed);
		});
	};
});

function NewRaceCheck() {
	getJSON('https://racetime.gg/races/data', function(error, response) {
		if (error) {
			return console.log(error);
		}
		const stringified = (JSON.stringify(response));
		const parsed = (JSON.parse(stringified));
		const race_channel = client.channels.cache.get(config.channel_id);
		parsed.races.forEach(element => {
			const race_name = (JSON.stringify(element.category.slug));
			if (race_name.includes(config.filter) && !announced_races.includes(element.name)) {
				announced_races.push(element.name);
				const raceEmbed = new Discord.MessageEmbed()
					.setColor('#0394fc')
					.setTitle('A new race is happening!')
					.setURL(`https://racetime.gg${element.url}`)
					.setThumbnail(element.category.image)
					.addFields(
						{ name: 'Game', value: element.category.name },
						{ name: 'Category', value: element.goal.name },
					)
					.setTimestamp();
				race_channel.send(raceEmbed);
			}
		});
	});
}

setInterval(NewRaceCheck, 5000);

function WriteRacesToFile() {
	jsonfile.writeFile("./config/announced_races.json", announced_races);
}

setInterval(WriteRacesToFile, 60000);
