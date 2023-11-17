const express = require('express')
const app = express()
const PORT = 3000;
const path = require("path")

const hbs = require('express-handlebars');
app.set('views', path.join(__dirname, 'views'));         // ustalamy katalog views
app.engine('hbs', hbs({ defaultLayout: 'main.hbs' }));
app.set('view engine', 'hbs');                           // określenie nazwy silnika szablonów

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
        if (!isArray(files)) {
            files = [files]
        }

        files.forEach(file => {
            files_table.push(file);
        });

    });
    res.redirect('/')
})

app.get('/filemanager', function (req, res) {
    res.render('filemanager.hbs');
})

app.use(express.static('static'));
app.listen(PORT, function () {
    console.log(`Serwer działa na porcie: ${PORT}`)
})