class User {
  selectedLessons = [];
  constructor(
    email,
    password,
    semester,
    name,
    registryNumber,
  ) {
    this.email = email;
    this.password = password;
    this.name = name;
    this.registryNumber = registryNumber;
    this.semester = semester;
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

module.exports = { User, Lesson }