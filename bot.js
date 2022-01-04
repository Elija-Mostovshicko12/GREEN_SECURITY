
//зона бота
const { Client, Intents} = require("discord.js");
const fs = require('fs');
const express = require('express')
const app = express()
const database = require('./database.js')
const DOMIN = 'localhost:3000';
const request = require('request')
const axios = require('axios'); 

const bot = new Client();
bot.on("ready", () => {
    bot.user.setActivity('Метро Люмино, работем')
    database.load()
    console.log("[START] Бот готов к работе");
});
process.on("SIGINT", ()=>{
    console.log("[END] Данные сохраняются...")
    database.save()
    console.log("[END] Данные сохранены")
    console.log("[END] Работа завершина")
    process.exit();
})
bot.login("OTI3OTczNDg0MTIwODk5NjQ0.YdSApw.xNSqx-3xKTnNtAOEBcVicEmHEUY");

bot.on("message", (msg) => {
    if(msg.author.bot) return;
    for(let i = 0;i < database.Get_dataBase().F_MUT.length; i++){
        if(msg.author.id === database.Get_dataBase().F_MUT[i]){
            return;
        }
    }
    if(database.Get_dataBase().server.d_code[msg.author.id]){
        if(database.Get_dataBase().server.d_code[msg.author.id].FF == 10){
            msg.channel.send('К сожелению из-за спама в отправляетесь в вечный мут!');
            database.Get_dataBase().F_MUT.push(msg.author.id);
        }
        if(database.Get_dataBase().server.d_code[msg.author.id].TO){
            const d = new Date();
            if(d.getTime() >= database.Get_dataBase().server.d_code[msg.author.id].TO){
                delete database.Get_dataBase().server.d_code[msg.author.id].TO
            }else{
                database.Get_dataBase().server.d_code[msg.author.id].FF = 0
                database.Get_dataBase().server.d_code[msg.author.id].FF ++
                return
            }
        }
    }
    const args = ((msg.content).split(' '));
    const prefex = ((msg.content).slice(0));
    const server = bot.guilds.cache.get("908342551768096778");
    const role_TH = server.roles.cache.get("927974851396911115");
    if(msg.channel.type == 'dm'){
        const member = server.members.cache.get(msg.author.id);
        if(!member.roles.cache.get(role_TH.id)) return msg.channel.send("К сожелению ты не находишься в команде!!")
        const d = database.Get_dataBase().server.players[msg.author.id]
        const url = encodeURI('http://'+DOMIN +"/acs_1/"+args[0]+"/"+msg.author.id)
        request( url, async function (error, response, body) {
            let bboorr = JSON.parse(body);
            if(bboorr.Error){
                msg.channel.send('К сожелению таких данных не существует!!!')
                if(!database.Get_dataBase().server.d_code[msg.author.id]){
                    database.Get_dataBase().server.d_code[msg.author.id] = {};
                    database.Get_dataBase().server.d_code[msg.author.id].fail = 0
                    database.Get_dataBase().server.d_code[msg.author.id].fail ++
                    return;
                }
                if(!database.Get_dataBase().server.d_code[msg.author.id].fail){
                    database.Get_dataBase().server.d_code[msg.author.id].fail = 0
                }
                database.Get_dataBase().server.d_code[msg.author.id].fail ++

            }else{
                const number_r = await random_num(4);
                database.Get_dataBase().server.d_code[msg.author.id] = {}
                database.Get_dataBase().server.d_code[msg.author.id].code = number_r;
                msg.channel.send(`Привет, ${msg.author.username}! Ты успешно прошёл первый уровень авторизации, пожалуйста введи этот код на сервере в Майнкрафт используя команду /acs\nВот код => ${number_r}`)
            }
        });
        if(database.Get_dataBase().server.d_code[msg.author.id].fail == 5){
            msg.channel.send("Упс!! Кажется ты слишком много раз провалил авторизацию! Ты отправляешься в игнор на 5 мин");
            let Date1 = new Date()
            let Date2 = new Date(Date1.setMinutes(5 + Number(Date1.getMinutes())));
            database.Get_dataBase().server.d_code[msg.author.id].TO = 0;
            database.Get_dataBase().server.d_code[msg.author.id].TO = Date2.getTime();
        }
    }
})


//API зона
const num = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
const EN = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

app.listen(3000, ()=>{
    console.log("[API] API готово к работе")
})

app.get('/r/:nick_m', async (req, res)=>{
    if(req.params == null) return res.json({
                                "result": false,
                                "Error":1
                            })
    const number_r = await random_num(4);
    if(!database.Get_dataBase().server.m_code[req.params.nick_m]){
        database.Get_dataBase().server.m_code[req.params.nick_m] = {
            "code":number_r
        }

    }
    database.Get_dataBase().server.m_code[req.params.nick_m].code = number_r;
    return res.json({
        "result": true,
        "num": number_r
    })
        
})

app.get('/acs_1/:code/:id_d', async (req, res)=>{
    if(req.params == null) return res.json({
                                "result": false,
                                "Error":11
                            })
    
    let dt = req.params;
    let data = database.Get_dataBase().server.m_code
    let allD = Object.values(data)
    let fail = 0;
    for(let i = 0; i < allD.length; i++){
        if(allD[i].code === dt.code){
            return res.json({
                "result": true
            })
        }else{
            fail ++
        }
    }
    if(fail == allD.length){
        return res.json({
            "result": false,
            "Error": 12
        })
    }
})
app.get('/acs_2/:code/:nick_m', async (req, res)=>{
    if(req.params == null) return res.json({
                                "result": false,
                                "Error":11
                            })
    
    let dt = req.params;
    let data = database.Get_dataBase().server.d_code
    let allD = Object.values(data)
    let fail = 0;
    for(let i = 0; i < allD.length; i++){
        if(allD[i].code === dt.code){
            if(!database.Get_dataBase().server.players[Object.keys(data)[i]]){
                database.Get_dataBase().server.players[Object.keys(data)[i]] = {}
                database.Get_dataBase().server.players[Object.keys(data)[i]].nick_m = dt.nick_m
            }
            database.Get_dataBase().server.d_code[Object.keys(data)[i]] = {};
            database.Get_dataBase().server.m_code[dt.nick_m] = {};
            return res.json({
                "result": true
            })
        }else{
            fail ++
        }
    }
    if(fail == allD.length){
        return res.json({
            "result": false,
            "Error": 12
        })
    }
})
async function random_num (numu){
    let res = [];
    for(let i = 0; i < numu;i++){
            let it = Math.floor(Math.random() * num.length);
            let tii = num[it];
            res.push(tii);
    }
    return res.join('')
}