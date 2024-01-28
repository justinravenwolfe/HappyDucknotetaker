//IMPORTS:
//This is to speed app development w/ predefined routes
const express = require('express'); //Application of node.js
//To interact with the database 
const mysql = require('mysql');
//To interact with json 
const fs = require('fs');
//This will used to deploy once finished on local
const heroku = require('heroku');
//Used to make unique ids for each note in the database 
const uuid = require('uuid');
//Made a note <- 5e6ht7s <- note_id 
//Used to allow things to be sent in a json form from front-end t back-end
const bodyParser = require('body-parser'); 

//Creating the new app
const app = express(); 

//Apps behaviors 
//Want everything to be sent as a JSON
app.use(bodyParser.json()); 

//Path to the database 
const db_file = './Develop/db/db.json';

//Read/return all the data from the database
const readDb = async() => await fs.readJson(db_file); 
//Used to write to db 
/*const writeDb = async() => await fs.writeJson(db_file, data); */

