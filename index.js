"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const body_parser_1 = __importDefault(require("body-parser"));
const app = express_1.default();
// Serve the static files from the React app
app.use(express_1.default.static(path_1.default.join(__dirname, 'client/build')));
// body parser for json
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
// An api endpoint that returns a short list of items
app.get('/api/hello', (req, res) => {
    console.log("Hello, Get method ");
    res.send({ express: 'Hello From Express' });
});
app.post('/api/world', (req, res) => {
    console.log(req.body);
    res.send(`I received your POST request. ${req.body.post}`);
    console.log('Hello world!!! ');
});
// Handles any requests that don't match the ones above
app.get('*', (req, res) => {
    res.sendFile(path_1.default.join(__dirname + '/client/build/index.html'));
});
//const port = process.env.PORT || 3000;
const port = 3000;
app.listen(port);
console.log('App is listening on port ' + port);
