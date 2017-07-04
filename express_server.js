const express = require("express");
const app = express();
app.set("view engine", "ejs");
const PORT = process.env.PORT || 8080; // default port 8080
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
const airportDiagrams = require('airport-diagrams');
const notams = require('notams');
const MetarFetcher = require('metar-taf').MetarFetcher;
const metarFetcher = new MetarFetcher();
const TafFetcher = require('metar-taf').TafFetcher;
const tafFetcher = new TafFetcher();


app.listen(PORT, () => {
  console.log(`Diagram server running on port ${PORT}`);
});

app.get("/", (req, res) => {
  res.render("index");
});


app.post("/chart", (req, res) => {
  let input = req.body['airport']
  let airport = input.toUpperCase();

  console.log(`----`);
  console.log(`\n${airport}\n`);

  metarFetcher.getData(airport)
  .then((response) => {
    console.log(`#########`);
    console.log(`# METAR #`);
    console.log(response);
  }), ((error) => {
    console.error(error);
  });


  tafFetcher.getData(airport)
  .then((response) => {
    console.log(`#########`);
    console.log(`#  TAF  #`);
    console.log(response);
  }), ((error) => {
    console.error(error);
  });

  airportDiagrams.list(airport)
  .then(results => {
    let result = results[0];
    let plateURL = (result['procedure']['url']);
    revisedURL = plateURL.substring(0, plateURL.length - 16);
    console.log(`#############################`);
    console.log(`#   AIRPORT DIAGRAM (PDF)   #`);
    console.log(`${result['airport']} / ${result['ident']}`);
    console.log(`${revisedURL}\n`);
  })
  .then
  (notams(airport, { format: 'DOMESTIC' })
  .then(results => {
    console.log(`#############################`);
    console.log(`#          NOTAMS           #`);
    var notams = results[0]['notams'];
    notams.forEach((notam) => {
      console.log(notam);
    });
  }));

  res.redirect("/");

});
