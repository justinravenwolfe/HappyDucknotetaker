//IMPORTS:
//This is to speed app development w/ predefined routes
const express = require('express'); //Application of node.js
//To interact with the database 
const cors = require('cors'); 
/*
SELECT * FROM cats; <- Print out the whole table <- query, SQL<- structured query language 
CRUD <- Create, read, update, delete 
Cats
_______
Mini
_______
Meowy
_______

Database contains tables, tables are in a database 
*/
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

//defining a port 
const port = process.env.PORT || 3000; 

//Apps behaviors 
//Want everything to be sent as a JSON
app.use(bodyParser.json()); 
//Webpages we'll show/edit <-The node can connect to the html files


//Path to the database 
const db_file = '../Develop/db/db.json';

//Read/return all the data from the database
const readDb = async() => await fs.readJson(db_file); 
//Used to write to db 
/*const writeDb = async() => await fs.writeJson(db_file, data); */

//Navigation through the website
app.get('/', async(req, res) => {
    app.render('../Develop/index.html');
});
app.get('/notes', async(req, res) => {
    app.render('../Develop/notes.html');
    //Code to load in the notes 
    
});
//Function to write to JSON-file<-Save notes to the database
app.post('/save', async(req, res) => {
    console.log("Attempting to save note");
//name attributes html <- title, text
const {title, text} = req.body; 
//data model <- Form of the database data
const newNote = {
    id: uuid(),//random string of letters/numbers 
    title,
    text
}; 
//try<-save note to database, catch <- send back the error message
//"notes": [_,_,_]
try{
    //Wait to get the database info sent back
    const db = await readDb(); 
    db.notes.push(newNote); 
    //200 of higher <- went well no issue
    //404 error 
    res.status(200).json(newNote); 
}catch(error){
    console.log(error);
    res.status(500).send('Server Error'); 
}
}); 

//Allowing the application to run on a specific port 
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
}); 