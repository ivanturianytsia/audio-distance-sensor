"use strict"

const io = require('socket.io').listen("8080")
const ss = require('socket.io-stream');

const fs = require('fs');

io.sockets.on("connection", function(socket) {
	socket.on("start-recording", function() {
		io.emit("start-recording")
	})
	ss(socket).on("done-recording", function(stream, data) {
		data.start = data.start || (Date.now() + "-false")
		stream.pipe(fs.createWriteStream('./recording/' + data.start + '.wav'));
	});
})

const express = require("express");
const path = require("path");
const serveStatic = require("serve-static")

let app = express()

app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "views/index.html"))
})

app.use("/public", serveStatic('public'))

app.listen("3000")
