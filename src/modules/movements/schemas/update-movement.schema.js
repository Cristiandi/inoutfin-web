import * as Yup from 'yup';

export const updateMovementSchema = Yup.object().shape({
  description: Yup.string().min(5).required(),
  amount: Yup.number().positive().required(),
  movementCategoryId: Yup.number().positive()
    .test('required', 'movementCategoryId is a required field', (value) => {
      console.log('value', value);

      return true;
    }),
  image: Yup.mixed()
    .test('fileSize', 'The file is too large', (value) => {
      if (!value?.length) return true; // attachment is optional
      return value[0].size <= 6e+6;
    })
    .test('fileExt', 'The file ext is not allowed', (value) => {
      if (!value) return true;

      if (!value[0]) return true;

      const file = value[0];

      const { type = '' } = file;

      if (type.startsWith('image')) return true;

      return false;
    })
    .notRequired()
});
