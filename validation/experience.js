const Validator = require('validator');
const isEmpty = require('../validation/is-empty');

module.exports = function validateExperienceInput(data) {
  let errors = {};
  data.title = !isEmpty(data.title) ? data.title : '';
  data.company = !isEmpty(data.company) ? data.company : '';
  data.from = !isEmpty(data.from) ? data.from : '';

  if (Validator.isEmpty(data.title)) {
    errors.title = 'Job Title is required.';
  }
  if (Validator.isEmpty(data.company)) {
    errors.company = 'Company Field is required.';
  }
  if (Validator.isEmpty(data.from)) {
    errors.from = 'From Date Field is required.';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};