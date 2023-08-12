const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

const ADMINPATH = path.join(__dirname, 'files', 'admin.json');

try {
	console.log('hello world');
} catch {
	ADMINS = [];
	USERS = [];
	COURSES = [];
}

app.get('/', (req, res) => {
	console.log('get method');
	res.json('recieved');
});

app.listen(3000);
