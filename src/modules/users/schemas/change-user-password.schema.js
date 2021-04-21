import * as Yup from 'yup';

export const changeUserPassword = Yup.object().shape({
  oldPassword: Yup.string().min(6).max(16),
  newPassword: Yup.string().min(6).max(16)
});
