import * as Yup from 'yup';

export const updateMovementSchema = Yup.object().shape({
  description: Yup.string().min(5).required(),
  amount: Yup.number().positive().required(),
  movementCategoryId: Yup.number().integer().positive().required()
});
