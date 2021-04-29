const Fs = require('fs');
const Parser = require("./resource/Parser.js");

var path = "test/main.gs";
var script = Fs.readFileSync(path, "utf-8");

console.log(`Loading ${path}`);

new Parser(script);