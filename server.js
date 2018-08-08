const PORT = process.env.PORT || 8080; // default port 8080
const cfonts = require('cfonts');
const readlineSync = require('readline-sync');
const icao = require('icao');
const axios = require('axios');
const parse = require('./lib/parse');

cfonts.say('airport-info', {
  font: 'chrome',
  align: 'left',
  colors: ['green'],
  letterSpacing: 1,
  lineHeight: 1,
  space: true,
});

function getMetar(airport) {
  return axios.get(`http://tgftp.nws.noaa.gov/data/observations/metar/stations/${airport}.TXT`);
}

function getTaf(airport) {
  return axios.get(`http://tgftp.nws.noaa.gov//data/forecasts/taf/stations/${airport}.TXT`);
}

function getNotams(airport) {
  return axios.get(`https://pilotweb.nas.faa.gov/PilotWeb/notamRetrievalByICAOAction.do?method=displayByICAOs&reportType=RAW&formatType=DOMESTIC&retrieveLocId=${airport}&actionType=notamRetrievalByICAOs`)
}

userPrompt = () => {
  let input = readlineSync.question('Please enter an ICAO code: ');
  let airport = input.toUpperCase();

  if (icao[airport]) {

    axios.all([getMetar(airport), getTaf(airport), getNotams(airport)])
      .then(axios.spread((metar, taf, notams) => {

        console.log(`\n############################`);
        console.log(`            METAR`);
        console.log(`############################\n`);
        console.log(metar.data);

        console.log(`\n############################`);
        console.log(`            TAF`);
        console.log(`############################\n`);
        console.log(taf.data);

        console.log(`\n############################`);
        console.log(`           NOTAMS`);
        console.log(`############################\n`);
        let rawNotamData = parse(notams.data);
        rawNotamData[0].notams.forEach((notam) => {
          console.log(notam);
        });
      }))
      .then(() => {
        userPrompt();
      });

  } else {
    console.log(`
      Airport ${airport} was not recognized
      Please try again
    `);
    userPrompt();
  }
}

userPrompt()