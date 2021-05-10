import * as Yup from 'yup';

export const getOutcomePerCategoriesSchema = Yup.object().shape({
  startDate: Yup.date().required('the start date is required.').typeError('not valid value.'),
  endDate: Yup.date().required('the end date is required.').typeError('not valid value.')
});
