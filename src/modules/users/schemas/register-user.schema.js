import * as Yup from 'yup';

export const registerUser = Yup.object().shape({
  fullName: Yup.string().min(5).required(),
  email: Yup.string().email().required(),
  phoneNumber: Yup.string().length(10).required(),
  password: Yup.string().min(6).required(),
  confirmPassword: Yup.string()
    .required()
    .oneOf([Yup.ref('password')], 'Passwords do not match')
});
