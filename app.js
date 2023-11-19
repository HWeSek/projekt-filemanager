const express = require('express')
const app = express()
const PORT = 3000;
const path = require("path")

let imghelper = function (type) {
    let src;
    switch (type) {
        case "audio/x-flac":
            src = '774673_format_flac_document_extension_file.png';
            break;
        case "image/png":
            src = '774683_format_file_extension_document_png file firmat.png';
            break;
        case "image/jpeg":
            src = '774688_format_jpg_document_extension_file.png';
            break;
        case "application/msword":
            src = '774674_format_doc_document_extension_file.png';
            break;
        case "video/mp4":
            src = '774675_extension_mp4_format_file_document.png';
            break;
        case "text/plain":
            src = '774680_format_file_extension_document_txt.png';
            break;
        case "application/pdf":
            src = '774684_extension_pdf_document_file_format.png';
            break;
        case "audio/mpeg":
            src = '774685_file_documents_document_mp3_format.png';
            break;
        case "application/javascript":
            src = '774687_file_js file firmat_extension_document_format_file_document_js file firmat_extension_format.png';
            break;
        case "text/html":
            src = '774689_document_extension_format_file_html.png';
            break;
        case "image/gif":
            src = '774690_gif_ducument_format_extension_file_filetype.png';
            break;
        default:
            src = "199231_format_file_extension_blank_icon.png"
            break;
    }
    return `<img src="gfx/icons/${src}"  alt="${type}">`
}

const hbs = require('express-handlebars');
app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', hbs({
    extname: 'hbs',
    defaultLayout: 'main',
    partialsDir: __dirname + '/views/partials/',
    helpers: {
        idinc: function (id) {
            return id + 1;
        },
        fileImg: imghelper
    }
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