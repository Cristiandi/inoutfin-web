import * as Yup from 'yup';

export const changeUserEmail = Yup.object().shape({
  email: Yup.string().email().required()
});
