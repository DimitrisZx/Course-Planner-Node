const { User } = require('./models');
let DBKEY;

try {
  DBKEY = require('./serviceAccountKey.json');
} catch {
  DBKEY = JSON.parse(process.env.dbkey);
}

const {v4: uuid } = require('uuid');
const fs = require('fs');
const JSONFILE = 'lessonsList2.json';

// Configure Firestore
const admin = require('firebase-admin');
admin.initializeApp({
  credential: admin.credential.cert(DBKEY)
});
const db = admin.firestore();

// Collections References
const USERS_COLL = db.collection('users');
const SCHOOLS_COLL = db.collection('schools');

async function getdb(collection) {
  const snapshot = await db.collection(collection).get();
  snapshot.forEach(doc => console.log(doc.data().lessonsList));
}

const getAllUserIds = async() => {
  const users = await USERS_COLL.get()
  let ids = []
  users.forEach(doc => {
    ids.push(doc.id);
  });
  console.log(ids)
  return ids;
}

const isNumber = (input) => {
  return !isNaN(input);
}

const isInRange = (input) => {
  return ['1','2','3','4','5','6','7','8'].includes(input);
}

const signUpUser = async({ email, password, semester, registryNumber, name, schoolCode }) => {
  if ( !isNumber(semester)) {
    return { errorMsg: 'Ο αριθμός εξαμήνου πρέπει να είναι απλός αριθμός, για παράδειγμα "4"' }
  }
  if(!isInRange(semester)) {
    return { errorMsg: 'Ο αριθμός εξαμήνου πρέπει να είναι από 1 έως 8' }
  }
  const userIds = await getAllUserIds();
  if (userIds.includes(registryNumber)) {
    return { errorMsg: 'Ο χρήστης έχει ήδη εγγραφεί.' };
  }
  const uniqueId = uuid();
  const user = new User(email, password, semester, name, registryNumber, uniqueId, schoolCode)
  const res = await USERS_COLL.doc(registryNumber).set({ ...user });

  return res;
}

const createUserDocument = async (userId, data) => {
  const res = await USERS_COLL.doc(userId).set(data);
  return res;
}

const loginUser = async ({ email, password }) => {
  const dbRef = USERS_COLL.where('email', '==', email).where('password', '==', password);
  const snapshot = await dbRef.get();
  let user;

  snapshot.forEach(doc => {
    user = doc.data() 
  });
  return user;
}

const getUserInfo = async () => {
  const snapshot = await USERS_COLL.get();
  snapshot.forEach((doc) => {
    console.log(doc.id, '=>', doc.data());
  });
}

const updateUserInfo = async (payload) => {
  const dbRef = USERS_COLL.where('uuid', '==', payload.uuid);
  const snapshot = await dbRef.get();
  let user;

  snapshot.forEach((item) => {
    user = item.data()
  })
  await USERS_COLL.doc(user.registryNumber).update({ registeredLessons: payload.registeredLessons }) 
  const res = await (await USERS_COLL.doc(user.registryNumber).get()).data();
  return res.registeredLessons;
}

const updateSchedule = async (requestBody) => {
  const { userId, selectedlessons } = requestBody;
  console.log(requestBody)
  const res = await USERS_COLL.doc(userId).update({selectedLessons: selectedlessons});
  console.log(res)
  return res;
}

const getSavedSelectedLessons = async (requestBody) => {
  const { userId } = requestBody;
  const doc = await USERS_COLL.doc(userId).get();
  console.log(doc)
}

async function writeSingleEntry() {
  const lessonsList = JSON.parse(fs.readFileSync(JSONFILE)).lessonsList;
  const savableStruct = {};
  lessonsList.forEach(lesson => {
    savableStruct[lesson.name] = JSON.stringify(lesson);
  })
  // await db.collection('lessons').doc('lessons').set(savableStruct)
  console.log(savableStruct)
  const resp = await SCHOOLS_COLL.doc('LIS_PADA').collection('semesters').doc('springSemester').set(savableStruct)
}

async function getLessonsFromFirestore(schoolCode="LIS_PADA", semester="springSemester") {
  // const resp = await db.collection('lessons').doc('lessons').get()
  const resp = await SCHOOLS_COLL.doc(schoolCode).collection('semesters').doc(semester).get()
  const list = [];
  for (let lesson in resp.data()) {
    list.push(JSON.parse(resp.data()[lesson]))
  }

  return list;
}

async function getUserRegisteredLessons(uuid) {
  const dbRef = USERS_COLL.where('uuid', '==', uuid);
  const snapshot = await dbRef.get();
  let user;

  snapshot.forEach((item) => {
    user = item.data()
  })
  const res = await (await USERS_COLL.doc(user.registryNumber).get()).data();
  return res.registeredLessons;
}

async function uploadSchedule(schoolName, semester) {
  writeSingleEntry();
}

async function submitSchedule(scheduleObject, semesterType='winterSemester', schoolCode='LIS_PADA') {
  console.log(schoolCode, semesterType)
  const savableStruct = {};
  scheduleObject.lessons.forEach(lesson => {
    savableStruct[lesson.name] = JSON.stringify(lesson);
  })
  const resp = await SCHOOLS_COLL.doc(schoolCode).collection('semesters').doc(semesterType).set(savableStruct)

}

async function getAvailableSchoolNames() {
  const ref = await db.collection('schools').get();
  let schoolNames = []
  ref.forEach(ref => schoolNames.push(
    {
      schoolName: ref.data().schoolName,
      schoolCode: ref.data().schoolCode
    }
  ));
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
  getAvailableSchoolNames,
  writeSingleEntry,
  getAllUserIds
};

// async function writeSingleEntry(schoolName, semesterType, schedule) {
//   const lessonsList = JSON.parse(fs.readFileSync(JSONFILE)).lessonsList; // REPLACE WITH UPLOADED JSON
//   const savableStruct = {};
//   lessonsList.forEach(lesson => {
//     savableStruct[lesson.name] = JSON.stringify(lesson);
//   });
//   await db.collection('lessons').doc(schoolName).set(savableStruct);
// }