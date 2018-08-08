const cheerio = require('cheerio');

/*
    The below code is copyright (c) 2017 Forrest Desjardins
    Utilized as per conditions of MIT License
    Originally published at https://www.npmjs.com/package/notams
*/

const parse = (html) => {
    const $ = cheerio.load(html)
    return $('div[id="resultsHomeLeft"]')
        .find('#resultsTitleLeft')
        .toArray()
        .map(el => {
            const title = $(el).find('a').attr('name')
            const notams = []

            let $next = $(el).parent().next()
            while (true) {
                // Stop if we hit the next ICAO section
                const titleText = $next.find('#resultsTitleLeft').html()
                if (titleText !== null) {
                    break
                }
                // Stop at the end of the reports
                const summaryText = $next.find('#alertFont').html()
                if (summaryText !== null) {
                    break
                }
                // Extract the current NOTAM text
                const notamText = $next.find('pre').text()
                if (notamText !== '') {
                    notams.push(notamText)
                }
                $next = $next.next()
            }
            return {
                icao: title,
                notams: notams
            }
        })
}

module.exports = parse;