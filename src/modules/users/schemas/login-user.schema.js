import * as Yup from 'yup';

export const loginUser = Yup.object().shape({
  email: Yup.string().email().required(),
  password: Yup.string().min(6).required()
});
