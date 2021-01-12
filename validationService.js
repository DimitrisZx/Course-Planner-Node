module.exports = class ValidatorHelper {
  static registryNumberLength = 5;
  static emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

  static schemaRequiredFields = {
    outerFields: [
      "schoolCode",
      "semesterType",
      "lessons"
    ],
    innerFields: [
      "lessons",
      "name",
      "day",
      "hours",
      "semester",
      "type",
      "professor",
      "days"
    ]
  }

  static validateRegistryNumber (input) {
    return !isNaN(input) && input.length === this.registryNumberLength;
  }

  static validateSemester (input) {
    return !isNaN(input) && +input > 0;
  } 

  static validateEmail (input) {
    return this.emailRegex.test(input);
  }

  static isValidScheduleSchema (input) {

    const { innerFields, outerFields} = this.schemaRequiredFields 
    const sentObjectOuterKeys = Object.keys(input);
    const outerFieldsValid = sentObjectOuterKeys.every(key => outerFields.includes(key));
    if (outerFieldsValid) {
      const allLessonsValid = input.lessons.every(
        lesson => Object.keys(lesson).every(lessonKey => innerFields.includes(lessonKey))
      );
      if (allLessonsValid) {
        return true;
      } else {
        return false;
      } 
    } else {
      return false;
    } 
    // TODO: maybe return an object with boolean value and specific error msg!
  }
}