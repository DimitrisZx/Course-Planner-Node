module.exports = class ValidatorHelper {
  static registryNumberLength = 5;
  static emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

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
    const requiredFields = [
      "name",
      "day",
      "hours",
      "semester",
      "type",
      "professor",
      "days"
    ];
    return requiredFields
      .every(field => Object.keys(input).includes(field));

  }
}