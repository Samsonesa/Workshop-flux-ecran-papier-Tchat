
var express = require('express'); // on appel le framework 'express' qui est framework pour node.js
var app = express(); // la variable 'app' contient 'express'

var fs = require('fs-extra'); // framework requis pour l'envoi d'image

var http = require('http').Server(app); // dans la var 'http' on créer un serveur
var io = require('socket.io')(http); // on ajoute socket.io à ce serveur

// on créer une route pour que ça aille chercher la page html quand tu te connecte à l'application
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

// on définit un dossier où on va mettre des fichiers statiques /!\le dossier s'appel public!!
app.use('/static', express.static(__dirname + '/public'));

// on définit un dossier où on va mettre des fichiers image
app.use('/img', express.static(__dirname + '/img'));

// on démarre une connection socket
io.on('connection', function(socket){
    // quand le serveur reçoit un message il réexpédit ce message au client
  socket.on('chat message', function(msg, user){
    io.emit('chat message', msg, user);
  });
// le serveur reçoit une image et la réexpédit au client
  socket.on("chat image", onNewLocalMedia);

});

// vérifier dans la console que le serveur est fonctionnel
http.listen(3000, function(){
  console.log('listening on *:3000');
});

// Fonction pour créer un nouveau fichier image
function onNewLocalMedia(data){
    // lit l'image en base64?
	var imageBuffer = decodeBase64Image(data.file);
	var date = Date.now();
	filename = 'img/' + data.fileName;
	fs.writeFile(filename , imageBuffer.data, function(err) {
		console.log(err);
	});
    io.emit("displayNewImage", filename);
}


//Décode les images en base64
function decodeBase64Image(dataString) {
	var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
	response = {};

	if (matches.length !== 3) {
		return new Error('Invalid input string');
	}

	response.type = matches[1];
	response.data = new Buffer(matches[2], 'base64');

	return response;
}
