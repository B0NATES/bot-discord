const {SlashCommandBuilder} = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Responde com 'Pong!'"),

        async execute(interaction) {
            console.log("Comando 'ping' recebido!");
            try {
                await interaction.reply("Pong!");
                console.log("Resposta enviada com sucesso!");
            } catch (error) {
                console.error("Erro ao enviar resposta:", error);
            }
        }
        
}