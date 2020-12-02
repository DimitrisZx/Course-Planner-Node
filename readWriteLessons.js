const DBKEY = require('./serviceAccountKey.json');
const fs = require('fs');
// Configure Firestore
const admin = require('firebase-admin');
admin.initializeApp({
  credential: admin.credential.cert(DBKEY)
});
const db = admin.firestore();
const JSONFILE = 'lessonsList2.json';

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