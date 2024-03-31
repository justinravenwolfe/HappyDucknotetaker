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
const fs = require('fs');   ///to save data of the notes

//This will used to deploy once finished on local
const heroku = require('heroku');

//Used to make unique ids for each note in the database 
const { v4: uuidv4 } = require('uuid');
//Made a note <- 5e6ht7s <- note_id 
//Used to allow things to be sent in a json form from front-end t back-end
const bodyParser = require('body-parser'); 

const path=require("path")

//Creating the new app
const app = express(); 

//defining a port 
const port = process.env.PORT || 3000; 

//Apps behaviors 
//Want everything to be sent as a JSON
app.use(bodyParser.json()); 
//Webpages we'll show/edit <-The node can connect to the html files
app.use(express.static('./public'));


//Path to the database 
const db_file = './db/db.json';

//Read/return all the data from the database

//Used to write to db 
const readDb = (callback) => {
    fs.readFile(db_file, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading database:', err);
            callback(err, null);
            return;
        }
        try {
            const jsonData = JSON.parse(data);
            callback(null, jsonData);
        } catch (parseErr) {
            console.error('Error parsing JSON:', parseErr);
            callback(parseErr, null);
        }
    });
};

const writeDb = (data, callback) => {
    const jsonData = JSON.stringify(data, null, 2); // Convert data to JSON string with 2 spaces indentation
    fs.writeFile(db_file, jsonData, 'utf8', (err) => {
        if (err) {
            console.error('Error writing to database:', err);
            callback(err);
        } else {
            console.log('Data written to database successfully.');
            callback(null);
        }
    });
};

//Navigation through the website
app.get('/', async(req, res) => {
    const indexPath = path.resolve(__dirname, 'public/index.html');
    res.sendFile(indexPath);
});

app.get('/notes.html', async(req, res) => {
    const indexPath = path.resolve(__dirname, 'public/notes.html');
    res.sendFile(indexPath);
});



app.get('/notes', async(req, res) => {

    
    try{
        //Wait to get the database info sent back
    
        readDb((err,db)=>{
           if(err){
            throw new Error("Error reading json")
           }
    
           //console.log(db)
            
            res.json(db.notes); 
           
           
        })
       
    }catch(error){
        console.log(error);
        res.status(500).send('Server Error'); 
    }
    //Code to load in the notes 
    
});
//Function to write to JSON-file<-Save notes to the database
app.post('/save', async(req, res) => {
    console.log("Attempting to save note");
//name attributes html <- title, text
const {title, text} = req.body; 
//data model <- Form of the database data
const newNote = {
    id: uuidv4(),//random string of letters/numbers 
    title,
    text
}; 
//try<-save note to database, catch <- send back the error message
//"notes": [_,_,_]
try{
    //Wait to get the database info sent back

    readDb((err,db)=>{
       if(err){
        throw new Error("Error reading json")
       }

       //console.log(db)
        
        db.notes.push(newNote); 
        //200 of higher <- went well no issue
        //404 error 
        writeDb(db,(err)=>{
            if(err){
                throw new Error("Error writing json")
               }
             res.status(200).json(newNote); 
        })
       
    })
   
}catch(error){
    console.log(error);
    res.status(500).send('Server Error'); 
}
}); 

//Allowing the application to run on a specific port 
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
}); 