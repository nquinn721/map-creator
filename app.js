var express = require('express'),
	app = express(),
	jade = require('pug'),
	fs = require('fs'),
	bodyParser = require('body-parser'),
	port = process.env.PORT || 8000,
	exec = require('child_process').exec;

app.listen(port, function() {
	console.log('Server running on port ' + port);
});

// exec('gulp', function(error, stdout, stderror) {
// 	console.log(error, stdout, stderror);
// })
var jsonParser = bodyParser.json()
String.prototype.capitalize = function() {
	return this.substr(0,1).toUpperCase() + this.substr(1);
}
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/bower_components/font-awesome'));
app.use(express.static(__dirname + '/bowerthemes'));
app.use(express.static(__dirname + '/'));
app.use(express.static(__dirname + '/bower_components/jquery-ui/themes/ui-darkness'));
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'pug');

app.get('/', function(req, res) {
	var sprites = getTileMaps();
	var backgrounds = fs.readdirSync('tilemaps/backgrounds');
	var maps = fs.readdirSync('tilemaps');
	res.render('index', {
		sprites : sprites,
		maps : maps,
		backgrounds : backgrounds
	});
});

function getTileMaps() {
	var sprites = fs.readdirSync('tilemaps/img').map(function(v){
		if(v.match(/[^\.DS_Store]/))return v;
	}).filter(v => v !== undefined);
	return sprites;
}

app.get('/tilemap-names', function(req, res) {
	var files = fs.readdirSync('tilemaps');
	files = files.map(function(file) {
		if(file.indexOf('.js') > -1)return file;
	});
	res.send(files);
});

app.get('/spritesheet-names', function(req, res) {
	var files = fs.readdirSync('spritesheets');
	files = files.map(function(file) {
		if(file.indexOf('.js') > -1)return file;
	});
	res.send(files);
});

app.get('/manifest', function(req, res) {
	var images = getTileMaps(),
		manifest = [];
	for(var i = 0; i < images.length; i++)
		manifest.push({
			src : images[i], 
			element : images[i].split('.')[0].toLowerCase(),
			id : images[i].split('.')[0].toLowerCase(),
			file : images[i],
			name : images[i].replace(/([A-Z])/g, ' $1').split('.')[0].capitalize()
		});
	res.send(manifest);
});

app.get('/maps', function(req, res) {
	var maps = fs.readdirSync('tilemaps');
	res.send(maps);
});

app.get('/load-tilemap/:map', function(req, res) {
	if(!req.params.map)return;
	res.sendFile(__dirname + '/tilemaps/' + req.params.map);
});

app.get('/load-spritesheet/:spritesheet', function(req, res) {
	if(!req.params.spritesheet)return;
	res.sendFile(__dirname + '/spritesheets/' + req.params.spritesheet);
});


app.post('/save-tilemap', jsonParser, function(req, res) {
	if (!req.body) return res.sendStatus(400);

	fs.writeFile('tilemaps/'+req.body.name, JSON.stringify(req.body.data), function (err) {
		console.log(err);
	});
});
app.post('/save-spritesheet', jsonParser, function(req, res) {
	if (!req.body) return res.sendStatus(400);

	fs.writeFile('spritesheets/'+req.body.name, JSON.stringify(req.body.data), function (err) {
		console.log(err);
	});
});

app.get('/getfile/:type/:name', function(req, res) {
	if(!req.params.name)return;
	res.sendFile(__dirname + '/' + req.params.type + 's/' + '/' + req.params.name);
});


