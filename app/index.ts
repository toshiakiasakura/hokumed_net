import express from 'express'
import { Request, Response, NextFunction } from "express";
import path from 'path';
import bodyParser from 'body-parser'
const app = express();

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, '../client/build')));

// body parser for json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// An api endpoint that returns a short list of items
app.get('/api/hello', (req, res) => {
    console.log("Hello, Get method ")
  res.send({ express: 'Hello From Express' });
});

app.post('/api/world', (req:Request ,res:Response) => {
    console.log(req.body)
    res.send(`I received your POST request. ${req.body.post}`)
    console.log('Hello world!!! ');
});

// Handles any requests that don't match the ones above
app.get('*', (req:Request,res:Response) =>{
    res.sendFile(path.join(__dirname+'../client/build/index.html'));
});

//const port = process.env.PORT || 3000;
const port = 3000
app.listen(port);

console.log('App is listening on port ' + port);
