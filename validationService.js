export class Validator {
  registryNumberLength = 5;
  emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

  validateRegistryNumber = input =>
    !isNaN(input) &&
    input.length === this.registryNumberLength;

  validateSemester = input => 
    !isNaN(input) &&
    +input > 0

  validateEmail = input =>
    this.emailRegex.test(input);
}