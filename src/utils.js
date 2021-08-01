const getBrowserLocales = (options = {}) => {
  const defaultOptions = {
    languageCodeOnly: false
  };

  const opt = {
    ...defaultOptions,
    ...options
  };

  const browserLocales =
    navigator.languages === undefined
      ? [navigator.language]
      : navigator.languages;

  if (!browserLocales) {
    return undefined;
  }

  return browserLocales.map(locale => {
    const trimmedLocale = locale.trim();

    return opt.languageCodeOnly
      ? trimmedLocale.split(/-|_/)[0]
      : trimmedLocale;
  });
};

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

export const currencyFormat = (value = 0) => {
  const locales = getBrowserLocales();
  const locale = locales.length ? locales[0] : 'en-US';

  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'USD'
    // These options are needed to round to whole numbers if that's what you want.
    // minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    // maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
  });

  return formatter.format(value);
};

export const dateFormat = (value) => {
  const locales = getBrowserLocales();
  const locale = locales.length ? locales[0] : 'en-US';

  const formatter = new Intl.DateTimeFormat(locale);

  return formatter.format(value);
};

export const setFirebaseProviderId = (value = '') => {
  localStorage.setItem('firebaseProviderId', value);
};

export const getFirebaseProviderId = () => {
  const providerId = localStorage.getItem('firebaseProviderId');

  return providerId || 'none';
};
