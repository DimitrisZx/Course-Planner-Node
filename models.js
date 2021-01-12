class User {
  selectedLessons = [];
  registeredLessons = [];
  constructor(
    email,
    password,
    semester,
    name,
    registryNumber,
    uid,
    schooCode
  ) {
    this.email = email;
    this.password = password;
    this.name = name;
    this.registryNumber = registryNumber;
    this.semester = semester;
    this.uuid = uid;
    this.userType = "student";
    this.schoolCode = schooCode;
  }
  
} 

class Lesson {
  name = "";
  semester = 0;
  type = "";
  professor = "";
  days = [
    { 
      day: "",
      hours: [0,0] 
    }
  ]
}

class Semester {
  lessons = [];
  semesterType = '';
  schoolCode = '';

  constructor(lessons, semesterName, schoolName) {
    this.lessons = lessons;
    this.semesterName = semesterName;
    this.schoolName = schoolName;
  }
}

class School {
  schoolName = '';
  schoolCode = '';
  semesters = {springSemester: {}, winterSemester: {}}
  activeSemester = "";
  constructor(schoolName, schoolCode, activeSemester="w", springSemester=[], winterSemester=[]) {
    this.schoolName = schoolName;
    this.schoolCode = schoolCode;
    this.springSemester = springSemester;
    this.winterSemester = winterSemester;
    this.activeSemester = activeSemester;
  }
}

function testModels () {

  return new School(
    'Αρχειονομίας Βιβλιοθηκονομίας και Συστημάτων Πληροφόρησης - ΠΑΔΑ',
    'PADA-LIS',
    "w",
    new Semester(
      [
        new Lesson(
          "Κατι Εφαρμογών",
          4,
          "spring",
          "Ταδε",
          [
            { 
              day: "Δευτέρα",
              hours: [9,11] 
            }
          ]
        )
      ],
      'winter',
      'PADA-LIS'
    ),
    new Semester(
      [],
      'spring',
      'PADA-LIS'
    )
  )
}

module.exports = { User, Lesson, Semester, School }