export const sleep = (ms = 0) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
* function to get something from the object path when the object is parsed.
*
* @param {object} [object={}]
* @param {string} [path='']
* @returns {any}
*/
export const getFromObjectPathParsed = (object = {}, path = '') => {
  const keysToEvaluete = path.split('.');

  let iteraingObject = object;
  for (const key of keysToEvaluete) {
    iteraingObject = iteraingObject[key];
    if (!iteraingObject) return;
  }
  return iteraingObject;
};

export const getErrorMessage = (object = {}) => {
  let message = 'something went wrong...';

  const { response } = object;

  if (!response) return message;

  const { errors } = response;

  if (!errors) return message;

  if (!Array.isArray(errors)) return message;

  if (!errors.length) return message;

  const [error] = errors;

  const { extensions } = error;

  if (!extensions) return message;

  const { exception } = extensions;

  if (!exception) return message;

  const { response: innerResponse } = exception;

  if (!innerResponse) return message;

  if (typeof innerResponse === 'number') {
    const { status } = exception;

    if (typeof status === 'string') {
      message = status;
      return message;
    }

    message = status.map(item => item).join(' | ');

    return message;
  } else if (innerResponse.statusCode) {
    message = innerResponse.message;

    return message;
  }

  message = 'it could not get the message from the server...';
};
