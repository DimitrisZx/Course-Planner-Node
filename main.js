const fs = require('fs');
const cors = require('cors');
const jsonParser = require('body-parser').json();
const express = require('express');
const app = express();
const path = require('path');
const {v4: uuid } = require('uuid');
const { parseBufferToJsObject } = require('./helper');
const {
  getUserInfo,
  createUserDocument,
  signUpUser,
  loginUser,
  updateSchedule,
  getSavedSelectedLessons, 
  getLessonsFromFirestore,
  getUserRegisteredLessons,
  updateUserInfo,
  uploadSchedule,
  submitSchedule,
  getAvailableSchoolNames,
} = require('./firestoreClient');

const ValidatorHelper = require('./validationService');
const multer = require('multer');
const upload = multer();

// User defined Constants
const PORT = process.env.PORT || 5000;
const ALLOWEDHOST = 'http://localhost:3000';
const JSONFILE = 'lessonsList2.json';

// Get lessons list from json file
// const lessonsList = JSON.parse(fs.readFileSync(JSONFILE)).lessonsList;
let lessonsListNew = [];

async function populateList() {
  lessonsListNew = await getLessonsFromFirestore()
};

function returnLessonList() {
  return lessonsListNew;
};

populateList();
// Configure Express Server
app.use(cors({ origin: ALLOWEDHOST }))
app.use(express.static(path.join(__dirname, 'build')));

// TODO:
/*
  Check for existing emails/registry numbers on sign-up
*/



// Endpoints
app.get('/checklist', () => console.log(lessonsListNew[0].days))
app.post('/requestSignUp', jsonParser, async (req, res) => {
  await signUpUser(req.body);
  const  userDataResponse = await loginUser({email: req.body.email, password: req.body.password})
  const {name, registryNumber, semester, email, uuid} = userDataResponse;

  if (userDataResponse) {
    res.json({ success: true, payload: {name, registryNumber, semester, email, uuid} })
  } else {
    res.json({ success: false, errorMsg: 'Something went wrong :(' })
  }
});

app.post('/requestLogin', jsonParser, async (req, res) => {
  const  userDataResponse = await loginUser({email: req.body.email, password: req.body.password})
  const {name, registryNumber, semester, email, selectedLessons, registeredLessons, uuid, userType} = userDataResponse;
  if (userDataResponse) {
    res.json({ success: true, payload: {name, registryNumber, semester, email, selectedLessons, registeredLessons, uuid, userType} })
  } else {
    res.json({ success: false, errorMsg: 'Something went wrong :(' })
  }
});

app.post('/requestProfileEdit', jsonParser, async (req, res) => {
  const { name, rn, semester, localId } = req.body;
  const data = {
    name,
    rn,
    semester,
    id: localId,
  };
  const response = createUserDocument(localId, data);
  res.json({success: false})
});

app.get('/getuuid', (req, res) => res.json({id:uuid()}))
app.get('/userInfo', (req, res) => {
  getUserInfo();
});

app.post('/updateRegisteredLessons',jsonParser, async (req, res) => {
  const response = await updateUserInfo(req.body);
  console.log(response)
  res.json({ payload: response });
});

app.post('/getAvailableSchools', async function (req, res) { 
  res.json(await getAvailableSchoolNames());
});

app.get('/lessons', jsonParser, async (req, res) => {
  /* 
    use function to get lessons because getting them is asynchronous 
    and setting the plain variable would always provide an emtpy array. 
  */
 const userUuid = req.query.uuid;
 const registeredLessons = await getUserRegisteredLessons(userUuid);

 const lessonList = returnLessonList();
 const lessonNames = lessonList.map(item => item.name)
 console.log(lessonNames)
  if (registeredLessons.length > 0) {
    res.json({ 
      lessons: lessonList.filter(lesson => registeredLessons.includes(lesson.name)),
      lessonNames
    });
  } else {
    res.json({ lessons: [], lessonNames }); 
  }

})
app.post('/updateSelectedLessons', jsonParser, (req, res) => {
  res.send('ok');
})

// NEW API
app.post('/signUpUser', async function (req, res) {
  const response = await signUpUser(req.body);
  res.send('user signed up');
})

app.post('/updateSchedule', jsonParser, async function (req, res) {
  const response = await updateSchedule(req.body);
})

app.post('/uploadSchedule', upload.single('myfile'), async function (req, res) {

  const jsonSchedule = parseBufferToJsObject(req.file.buffer);

  if (ValidatorHelper.isValidScheduleSchema(jsonSchedule)) {
    const response = await submitSchedule(jsonSchedule.schoolName, jsonSchedule.semester, jsonSchedule);
  }
})

// Start Listening
app.listen(PORT, () => console.log(`Server up and listening on port ${PORT}`));