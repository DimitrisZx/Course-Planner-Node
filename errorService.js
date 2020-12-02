export class ErrorMaker {
  
  errorTypeToErrorMessageMap = {
    invalidRegistryNumber: 'The registry number provided is not valid',
  }

  produceError(errorType) {
    return this.mapErrorTypeToErrorMessage(errorType)
  }

  mapErrorTypeToErrorMessage(errorType) {
    // check if errorType exists
    return this.errorTypeToErrorMessageMap[errorType];
  }
}