import * as Yup from 'yup';

export const resetUserPassword = Yup.object().shape({
  email: Yup.string().email().required()
});
