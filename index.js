const config = require('./config');
const Discord = require('discord.js')

const bot = new Discord.Client();

bot.login(config.DISCORD_TOKEN);
bot.on('ready', () =>{
    console.log("I'm ready !")   
})     


bot.on('message', msg => {    
    if(msg.content.substr(0, 19) === 'porceta create_repo'){ 
        msg.channel.send("Sim, meu mestre...")        

        let jsonData = JSON.stringify({"name": msg.content.substr(20, 30).trim(), "private": true, "auto_init": true});                               
        const fetch = require("node-fetch");

        try {
            fetch('https://api.github.com/user/repos', {            
                method: 'POST',            
                headers: {"Authorization":"token " + config.GITHUB_TOKEN, "Accept": "application/vnd.github.v3+json"},
                body: jsonData
            }).then(response => {               
                if(response.status == 201){
                    statusCode = response.status
                    author = msg.author.username
                    description = "Mestre, seu repositório '" + msg.content.substr(20, 30).trim() + "' foi criado com sucesso "
                    repository = msg.content.substr(20, 30).trim()
                    statusText = "Descrição do Status: " + response.statusText
                    msg.channel.send(buildEmbedMessageCreateRepository(statusCode, author, description, repository, statusText))
                } else {
                    statusCode = response.status
                    author = msg.author.username
                    description = "Mestre, houve um problema ao criar o repositório '" + msg.content.substr(20, 30).trim()
                    repository = msg.content.substr(20, 30).trim()
                    statusText = "Descrição do Status: " + response.statusText
                    msg.channel.send(buildEmbedMessageCreateRepository(statusCode, author, description, repository, statusText))
                }
            })                            
            
        } catch (error) {
            statusCode = 400
            author = msg.author.username
            description = "Mestre, houve um problema ao criar o repositório '" + msg.content.substr(20, 30).trim()
            repository = msg.content.substr(20, 30).trim()
            statusText = "Descrição do Status: " + response.statusText
            msg.channel.send(buildEmbedMessageCreateRepository(statusCode, author, description, repository, statusText))
        }            
    }
})

bot.on('message', msg => {            
    if(msg.content.substr(0, 14) === 'porceta invite'){ 
        try {
            msg.channel.send("Sim, meu mestre...")                
            listParams = msg.content.substr(15, 30).split("--")                  
            
            let jsonData = JSON.stringify({"owner": "bublitzjr", "repo": listParams[1].trim(), "username": listParams[0].trim(), "permission":"admin"});                                         

            const fetch = require("node-fetch");            

            fetch('https://api.github.com/repos/bublitzjr/' + listParams[1].trim() + '/collaborators/' + listParams[0].trim(), {                            
                method: 'PUT',            
                headers: {"Authorization":"token " + config.GITHUB_TOKEN, "Accept": "application/vnd.github.v3+json"},                
                body : jsonData                
            }).then(response => {               
                if(response.status == 201){
                    statusCode = response.status
                    author = msg.author.username
                    description = "Mestre, o invite foi enviado com sucesso para '" + listParams[0] + "'"
                    repository = listParams[1]
                    statusText = "Descrição do Status: " + response.statusText
                    msg.channel.send(buildEmbedMessageInviteRepository(statusCode, author, description, repository, statusText))
                } else {
                    statusCode = response.status
                    author = msg.author.username
                    description = "Mestre, houve um problema ao enviar o convite para '" +  listParams[0] + "'"
                    repository = listParams[1]
                    statusText = "Descrição do Status: " + response.statusText
                    msg.channel.send(buildEmbedMessageInviteRepository(statusCode, author, description, repository, statusText))
                }
            })                                     
            
        } catch (error) {
            statusCode = 400
            author = msg.author.username
            description = "Mestre, houve um problema ao enviar o convite para '" +  listParams[0] + "'"
            repository = listParams[1]
            statusText = "Descrição do Status: " + error
            msg.channel.send(buildEmbedMessageInviteRepository(statusCode, author, description, repository, statusText))
        }            
    }
})


function buildEmbedMessageCreateRepository(statusCode, author, description, repository, statusText){

        if(statusCode == 201){                        
            url   = "https://github.com/bublitzjr/"+repository            
            color = "#008000"
            title = "[ GITHUB REPOSITORY ]"
        }else{
            url   = ""
            color = "#FF0000"            
            title = "ERROR - " + statusCode
        }

        const embed = new Discord.MessageEmbed()
        .setTitle(title)
        .setColor(color)        
        .setURL(url)
        .setDescription(description)
        .setAuthor("Solicitante: "+author)           
        .setFooter(statusText)     
        
        return embed
}

function buildEmbedMessageInviteRepository(statusCode, author, description, repository, statusText){

    if(statusCode == 201){                        
        url   = "https://github.com/bublitzjr/"+repository+"/invitations"
        color = "#008000"
        title = "[ GITHUB INVITATIONS ]"
    }else{
        url   = ""
        color = "#FF0000"            
        title = "ERROR - " + statusCode
    }

    const embed = new Discord.MessageEmbed()
    .setTitle(title)
    .setColor(color)        
    .setURL(url)
    .setDescription(description)
    .setAuthor("Solicitante: "+author)           
    .setFooter(statusText)      
    return embed
}


