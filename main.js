const fs = require('fs');
const cors = require('cors');
const jsonParser = require('body-parser').json();
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const axios = require('axios');
const { getUserInfo, createUserDocument, writeUser } = require('./firestoreClient')

// User defined Constants
const PORT = process.env.PORT || 5000;
const ALLOWEDHOST = 'http://localhost:3000';
const JSONFILE = 'lessonsList2.json';
const firebaseAPIKey = 'AIzaSyCXv6mFcNW0jYXr86a1hE3fRwEQflO8xbQ';

// Get lessons list from json file
const lessonsList = JSON.parse(fs.readFileSync(JSONFILE)).lessonsList;

// Configure Express Server
app.use(cors({ origin: ALLOWEDHOST }))
app.use(express.static(path.join(__dirname, 'build')));

// Set-up endpoints

app.post('/requestSignUp', jsonParser, async (req, res) => {
  const signUpURL = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${firebaseAPIKey}`;
  const { email, password } = req.body;
  console.log(email, password)

  const response = await axios.post(signUpURL, {
    email, password, returnSecureToken: true,
  })
  console.log(response)
  if (response.status === 200) {
    res.json({success: true, payload: response.data})
  } else {
    res.json({ success: false, errorMsg: 'Something went wrong :(' })
  }
});

app.post('/requestLogin', jsonParser, async (req, res) => {
  const signInURL = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${firebaseAPIKey}`;
  const { email, password } = req.body;
  const requestPayload = { email, password, returnSecureToken: true }
  const response = await axios.post(signInURL, requestPayload)
  console.log(response.data)

  if (response.data.registered) {
    res.json({ success: true, payload: response.data });
  } else {
    res.json({success: false, errorMsg: 'Invalid Credentials'})
  }
});

app.post('/requestProfileEdit', jsonParser, async (req, res) => {
  const { name, rn, semester, localId } = req.body;
  console.log(name, rn, semester, localId);
  const data = {
    name,
    rn,
    semester,
    id: localId,
  };
  const response = createUserDocument(localId, data);
  console.log(response)
  res.json({success: false})
})

app.get('/userInfo', (req, res) => {
  getUserInfo();
})

app.get('/lessons', (req, res) => {
  console.log('responding')
  res.json({ lessons: lessonsList });
})

app.post('/updateSelectedLessons', jsonParser, (req, res) => {
  console.log(req.body);
  res.send('ok')
})

app.get('/testWriteUser', () => {
  writeUser();
})

// Start Listening
app.listen(PORT, () => console.log(`Server up and listening on port ${PORT}`))