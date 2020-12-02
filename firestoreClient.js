const { User } = require('./models');
const DBKEY = require('./serviceAccountKey.json');

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

const signUpUser = async({email, password, semester, registryNumber, name}) => {
  const user = new User(email, password, semester, name, registryNumber)
  const res = await db.collection('users').doc(registryNumber).set({...user});
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
  console.log(user)
  return user;
}

const getUserInfo = async () => {
  const snapshot = await db.collection('users').get();
  snapshot.forEach((doc) => {
    console.log(doc.id, '=>', doc.data());
  });
}

const updateUserInfo = async (userId, data) => {

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

module.exports = {
  getSavedSelectedLessons,
  updateUserInfo,
  getUserInfo,
  createUserDocument,
  signUpUser,
  loginUser,
  updateSchedule,
  getLessonsFromFirestore,
};
