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
let id = 1;

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
                file['id'] = id;
                file['savedate'] = new Date().getTime()
                files_table.push(file);
                id++;
            })
        }
        if (!isArray(files.upload)) {
            files.upload['id'] = id;
            files.upload['savedate'] = new Date().getTime()
            files_table.push(files.upload)
            id++;
        }
    });
    res.redirect('/')
})

app.get('/filemanager', function (req, res) {
    res.render('filemanager.hbs', { files_table });
})

app.get('/show', function (req, res) {
    files_table.forEach(file => {
        if (file.id == req.query.id) {
            res.sendFile(file.path)
        }
    })
})

app.get('/delete', function (req, res) {
    for (n in files_table) {
        if (files_table[n].id == req.query.id) {
            files_table.splice(n, 1)
            res.redirect('/filemanager')
        }
    }
})

app.get('/download', function (req, res) {
    files_table.forEach(file => {
        if (file.id == req.query.id) {
            res.download(file.path)
        }
    })
})

app.get('/info', function (req, res) {
    files_table.forEach(file => {
        if (file.id == req.query.id) {
            res.render('info.hbs', file)
        }
    })
})

app.get('/reset', function (req, res) {
    files_table = [];
    res.redirect('/filemanager')
})


app.use(express.static('static'));
app.listen(PORT, function () {
    console.log(`Serwer działa na porcie: ${PORT}`)
})