# racetimegg-discord-bot
A simple Discord bot for racetime.gg written in JavaScript

# Install

> npm install  
> node index.js

# Config
In config/config.json, you need to do the following:
* Add your bot account token. The discord.js guide tells you how to do that, and you can find it [here](https://discordjs.guide/).
* Add the ID of the channel you want the bot to post new races in. Enabling the developer tools in Discord allows you to get that.
* A filter keyword. The bot filters using the URL, so putting in `gta` will only show games from the GTA series.

You can also change the prefix if you want. The default is `!`.


