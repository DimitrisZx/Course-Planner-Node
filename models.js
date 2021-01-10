class User {
  selectedLessons = [];
  registeredLessons = [];
  constructor(
    email,
    password,
    semester,
    name,
    registryNumber,
    uid
  ) {
    this.email = email;
    this.password = password;
    this.name = name;
    this.registryNumber = registryNumber;
    this.semester = semester;
    this.uuid = uid;
    this.userType = "student";
  }
  
} 

class Lesson {
  name = "";
  day = "";
  hours = [0,0];
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
  semesterName = '';
  schoolName = '';

  constructor(lessons, semesterName, schoolName) {
    this.lessons = lessons;
    this.semesterName = semesterName;
    this.schoolName = schoolName;
  }
}

class School {
  schoolName = '';
  semesters = [];
  constructor(schoolName, semesters) {
    this.schoolName = schoolName;
    this.semesters = semesters;
  }
}

module.exports = { User, Lesson, Semester, School }