import * as Yup from 'yup';

export const changeName = Yup.object().shape({
  fullName: Yup.string().min(5).required()
});
