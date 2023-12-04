const { Client, Events, GatewayIntentBits, Collection } = require('discord.js');

const dotenv = require('dotenv');
dotenv.config()
const { TOKEN, CLIENT_ID, GUILD_ID } = process.env

const fs = require('node:fs')
const path = require('node:path')

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection()

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);


for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);

        if ('data' in command && 'execute' in command) {
            const commandName = command.data.name;
            client.commands.set(commandName, command); 
            console.log(`Comando '${commandName}' registrado com sucesso!`);
        } else {
            console.log(`Esse comando em ${filePath} está com "data" ou "execute" ausentes`);
        }
    }
}



client.once('ready', () => {
    console.log(`Pronto! Login realizado como ${client.user.tag}`);
});


client.login(TOKEN);

client.on(Events.InteractionCreate, async interaction => {
	
    console.log(`Interacao recebida: ${interaction}`);
    
    if (!interaction.isChatInputCommand()) return;

    const commandName = interaction.commandName;
    const command = client.commands.get(commandName);


if (!command) {
    console.error(`Comando '${commandName}' não encontrado na coleção.`);
    return;
}

	try {
		await command.execute(interaction);
        console.log(`Comando '${command.data.name}' executado com sucesso!`);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}


	console.log(interaction);
});