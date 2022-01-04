const fs = require('fs');


const fail_database = require('./dataBase.json');

let database = {};

const load = () => {
	console.log('[LOAD] Начата загрузка базы данных...');
	database = fail_database;
	console.log('[LOAD] База данных загружена успешно!');
	console.log(database);
}

const save = () => {
	console.log('[SAVE] Начата сохранения базы данных...');
	fs.writeFileSync('./dataBase.json', JSON.stringify(database, null, 4));
	console.log('[SAVE] База данных сохранена успешно!');
}

const Get_dataBase = () =>{
	return database;
}



module.exports = {
	load,
	save,
	Get_dataBase,

}