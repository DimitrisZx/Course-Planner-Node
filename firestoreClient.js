const { User } = require('./models');
const DBKEY = require('./serviceAccountKey.json');
const {v4: uuid } = require('uuid');

// Configure Firestore
const admin = require('firebase-admin');
admin.initializeApp({
  credential: admin.credential.cert(DBKEY)
});
const db = admin.firestore();

async function getdb(collection) {
  const snapshot = await db.collection(collection).get();
  snapshot.forEach(doc => console.log(doc.data().lessonsList));
}

const signUpUser = async({ email, password, semester, registryNumber, name }) => {
  const uniqueId = uuid();
  const user = new User(email, password, semester, name, registryNumber, uniqueId)
  const res = await db.collection('users').doc(registryNumber).set({ ...user });
  return res;
}

const createUserDocument = async (userId, data) => {
  const res = await db.collection('users').doc(userId).set(data);
  console.log(res);
  return res;
}

const loginUser = async ({ email, password }) => {
  const dbRef = db.collection('users').where('email', '==', email).where('password', '==', password);
  const snapshot = await dbRef.get();
  let user;

  snapshot.forEach(doc => {
    user = doc.data() 
  });
  return user;
}

const getUserInfo = async () => {
  const snapshot = await db.collection('users').get();
  snapshot.forEach((doc) => {
    console.log(doc.id, '=>', doc.data());
  });
}

const updateUserInfo = async (payload) => {
  const dbRef = db.collection('users').where('uuid', '==', payload.uuid);
  const snapshot = await dbRef.get();
  let user;

  snapshot.forEach((item) => {
    user = item.data()
  })
  await db.collection('users').doc(user.registryNumber).update({ registeredLessons: payload.registeredLessons }) 
  const res = await (await db.collection('users').doc(user.registryNumber).get()).data();
  return res.registeredLessons;
}

const updateSchedule = async (requestBody) => {
  const { userId, selectedlessons } = requestBody;
  console.log(requestBody)
  const res = await db.collection('users').doc(userId).update({selectedLessons: selectedlessons});

}

const getSavedSelectedLessons = async (requestBody) => {
  const { userId } = requestBody;
  const doc = await db.collection('users').doc(userId).get();
  console.log(doc)
}

async function writeSingleEntry() {
  const lessonsList = JSON.parse(fs.readFileSync(JSONFILE)).lessonsList;
  const savableStruct = {};
  lessonsList.forEach(lesson => {
    savableStruct[lesson.name] = JSON.stringify(lesson);
  })
  await db.collection('lessons').doc('lessons').set(savableStruct)
}

async function getLessonsFromFirestore() {
  const resp = await db.collection('lessons').doc('lessons').get()
  const list = [];
  for (let lesson in resp.data()) {
    list.push(JSON.parse(resp.data()[lesson]))
  }

  return list;
}

async function getUserRegisteredLessons(uuid) {
  const dbRef = db.collection('users').where('uuid', '==', uuid);
  const snapshot = await dbRef.get();
  let user;

  snapshot.forEach((item) => {
    user = item.data()
  })
  const res = await (await db.collection('users').doc(user.registryNumber).get()).data();
  return res.registeredLessons;
}

async function uploadSchedule(schoolName, semester) {
  writeSingleEntry();
}

async function submitSchedule(schoolName, semester, scheduleObject) {
  console.log(
    "Saving Schedule to firebase:",
    schoolName,
    semester,
    scheduleObject,
  )
  // db.collection('lessons').doc(schoolName).set(savableStruct);
}

async function getAvailableSchoolNames() {
  const ref = await db.collection('schools').get();
  let schoolNames = []
  ref.forEach(ref => schoolNames.push(ref.data().schoolName));
  return schoolNames;
}

module.exports = {
  getSavedSelectedLessons,
  updateUserInfo,
  getUserInfo,
  createUserDocument,
  signUpUser,
  loginUser,
  updateSchedule,
  getLessonsFromFirestore,
  getUserRegisteredLessons,
  uploadSchedule,
  submitSchedule,
  getAvailableSchoolNames
};

async function writeSingleEntry(schoolName, semesterType, schedule) {
  const lessonsList = JSON.parse(fs.readFileSync(JSONFILE)).lessonsList; // REPLACE WITH UPLOADED JSON
  const savableStruct = {};
  lessonsList.forEach(lesson => {
    savableStruct[lesson.name] = JSON.stringify(lesson);
  });
  await db.collection('lessons').doc(schoolName).set(savableStruct);
}