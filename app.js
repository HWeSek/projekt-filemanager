const express = require('express')
const app = express()
const PORT = 3000;
const path = require("path")

const hbs = require('express-handlebars');
app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', hbs({
    extname: 'hbs',
    defaultLayout: 'main',
    partialsDir: __dirname + '/views/partials/'
}));
app.set('view engine', 'hbs');

const formidable = require('formidable');

const bodyParser = require('body-parser');
const { isArray } = require('underscore');
app.use(bodyParser.urlencoded({ extended: true }));

//////Tablica plików
let files_table = [];

app.get("/", function (req, res) {
    res.render('index.hbs');
})

app.post("/", function (req, res) {
    let form = formidable({});

    form.uploadDir = __dirname + '/static/upload/';
    form.keepExtensions = true;
    form.multiples = true

    form.parse(req, function (err, fields, files) {

        if (isArray(files.upload)) {
            files.upload.forEach(file => {
                files_table.push(file);
            })
        }
        if (!isArray(files.upload)) {
            console.log('plik dodany');
            files_table.push(files.upload)
        }
        console.log(files_table);
    });
    res.redirect('/')
})

app.get('/filemanager', function (req, res) {
    console.log(files_table);
    res.render('filemanager.hbs', { files_table });
})

app.use(express.static('static'));
app.listen(PORT, function () {
    console.log(`Serwer działa na porcie: ${PORT}`)
})