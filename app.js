const { google } = require('googleapis');
const keys = require('./keys.json');
const ejs = require('ejs');
const express = require('express');
const path = require('path');
const app = express();


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');




const client = new google.auth.JWT(
    keys.client_email,
    null,
    keys.private_key,
    ['https://www.googleapis.com/auth/spreadsheets.readonly']
);


client.authorize(function (err, tokens) {

    if (err) {
        console.log(err);
        return;
    } else {
        console.log('Connected!');
        gsrun(client);
    }
});


async function gsrun(cl) {
    const gsapi = google.sheets({ version: 'v4', auth: cl });


    const optcoordinates = {
        spreadsheetId: '18f7rUUJ_0Vq7IJ20v4Rm_uPp75g0aXHNsjWLqNnW6Ec',
        range: 'coordinates!B1:C90'
    };
    const opteki = {
        spreadsheetId: '18f7rUUJ_0Vq7IJ20v4Rm_uPp75g0aXHNsjWLqNnW6Ec',
        range: 'coordinates!A1:A90'
    };


    app.get('/', async function (req, res) {
        let coordinates = await gsapi.spreadsheets.values.get(optcoordinates);
        let dataArray = coordinates.data.values;
        let eki = await gsapi.spreadsheets.values.get(opteki);
        let ekiArray = eki.data.values;
        res.render('index', { coordinates: dataArray ,len: dataArray.length ,eki: ekiArray});
    });

};


app.listen(7122, () => console.log('Server up and running'));