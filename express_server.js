const express = require("express");
const app = express();
app.set("view engine", "ejs");
const PORT = process.env.PORT || 8080; // default port 8080
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
const airportDiagrams = require('airport-diagrams');
var MetarFetcher = require('metar-taf').MetarFetcher;
var TafFetcher = require('metar-taf').TafFetcher;
var metarFetcher = new MetarFetcher();
var tafFetcher = new TafFetcher();


app.listen(PORT, () => {
  console.log(`Diagram server running on port ${PORT}`);
});

app.get("/", (req, res) => {
  res.render("index");
});


app.post("/chart", (req, res) => {
  let airport = req.body['airport']
  console.log(airport);

  metarFetcher.getData(airport)
  .then(function(response) {
    console.log(`#########`);
    console.log(`# METAR #`);
    console.log(response);
  }, function(error) {
    console.error(error);
  });

  tafFetcher.getData(airport)
  .then(function(response) {
    console.log(`#########`);
    console.log(`#  TAF  #`);
    console.log(response);
  }, function(error) {
    console.error(error);
  });

  airportDiagrams.list(airport)
  .then(results => {
    let name = (JSON.stringify(results[0]['airport'], null, 2));
    let code = (JSON.stringify(results[0]['ident'], null, 2));
    // let proc = (JSON.stringify(results[0]['procedure']['name'], null, 2));
    let plateURL = (JSON.stringify(results[0]['procedure']['url'], null, 2));
    revisedURL = plateURL.substring(1, plateURL.length - 17);
    console.log(`#############################`);
    // console.log(`####${proc}####`);
    console.log(`#   AIRPORT DIAGRAM (PDF)   #`);
    console.log(`${name} ${code}`);
    console.log(`${revisedURL}`);
});

  res.redirect("/");

});
