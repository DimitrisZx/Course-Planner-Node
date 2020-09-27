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

const writeUser = async ({ email, password }) => {
  const newUser = new User(email, password);
  const res = await db.collection('users').doc('TEST').set(newUser);
  return res;
}

const updateUserInfo = async (userId, data) => {

}

const getUserInfo = async () => {
  const snapshot = await db.collection('users').get();
  snapshot.forEach((doc) => {
    console.log(doc.id, '=>', doc.data());
  });
}

const createUserDocument = async (userId, data) => {
  const res = await db.collection('users').doc(userId).set(data);
  console.log(res)
  return res
}


module.exports = {updateUserInfo, getUserInfo, createUserDocument, writeUser};