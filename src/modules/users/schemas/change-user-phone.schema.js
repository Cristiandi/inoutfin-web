import * as Yup from 'yup';

export const changeUserPhoneSchema = Yup.object().shape({
  phone: Yup.string().length(10).required()
});
