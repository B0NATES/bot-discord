const { REST, Routes } = require("discord.js")


const dotenv = require('dotenv')
dotenv.config()
const { TOKEN, CLIENT_ID, GUILD_ID } = process.env

const fs = require("node:fs")
const path = require("node:path")


const commands = []

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    
    
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);

        if ('data' in command && 'execute' in command) {
            
            commands.push(command.data);

        } else {
            console.log(`[AVISO] O comando em ${filePath} está faltando a propriedade obrigatória "data" ou "execute".`);
        }
    }
}


const rest = new REST().setToken(TOKEN);


(async () => {
    try {
        console.log(`Resentando ${commands.length} comandos...`)

        
        const data = await rest.put(
            Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
            { body: commands }
        )
        console.log("Comandos registrados com sucesso!")
    }
    catch (error) {
        console.error(error)
    }
})()