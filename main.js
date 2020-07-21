const express = require('express');
const app = express();
const cors = require('cors');
const fs = require('fs');

const PORT = 5000;
const ALLOWEDHOST = 'http://localhost:3000';
const JSONFILE = 'lessonsList.json';

// Obtain lesson list from json file
const lessonsList = JSON.parse(fs.readFileSync(JSONFILE)).lessonsList;

// CONFIGURE EXPRESS
app.use(cors({ origin: ALLOWEDHOST }))


// SET-UP endpoints
app.get('/lessons', (req, res) => {
  console.log('responding')
  res.json({ lessons: lessonsList });
})

// Start Listening
app.listen(PORT, () => console.log(`Server up and listening on port ${PORT}`))