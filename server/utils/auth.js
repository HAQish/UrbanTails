const validator = require('validator');  //A library of string validators and sanitizers.

// checking the the sign up form data
function validateSignupForm(formData) {
  const errors = {};
  let isFormValid = true;
  let message = '';
  return new Promise(resolve => {
    if (!formData || typeof formData.email !== 'string' || !validator.isEmail(formData.email)) {
      isFormValid = false;
      errors.email = 'Please provide a correct email address.';
    }

    if (!formData || typeof formData.password !== 'string' || formData.password.trim().length < 8) {
      isFormValid = false;
      errors.password = 'Password must have at least 8 characters.';
    }

    if (!formData || typeof formData.username !== 'string' || formData.username.trim().length === 0) {
      isFormValid = false;
      errors.username = 'Please provide your username.';
    }

    if (!formData || typeof formData.profileUrl !== 'string' || !validator.isURL(formData.profileUrl)) {
      isFormValid = false;
      errors.profileUrl = 'Please provide a correct url.';
    }

    if (!formData || typeof formData.location.address !== 'string' || formData.location.address.trim().length === 0) {
      isFormValid = false;
      errors.location = 'Please provide a Street Address.';
    }
    if (!formData || typeof formData.location.city !== 'string' || formData.location.city.trim().length === 0) {
      isFormValid = false;
      errors.location = 'Please provide a City.';
    }
    if (!formData || typeof formData.location.state !== 'string' || formData.location.state.trim().length === 0) {
      isFormValid = false;
      errors.location = 'Please provide a State.';
    }

    if (!isFormValid) {
      message = 'Check the form for errors.';
    }

    let result = {
      success: isFormValid,
      message,
      errors
    };
    resolve(result);
  });
}

// checking the the login form data
function validateLoginForm(formData, callback) {
  const errors = {};
  let isFormValid = true;
  let message = '';

  if (!formData || typeof formData.username !== 'string' || formData.username.trim().length === 0) {
    isFormValid = false;
    errors.username = 'Please provide your username.';
  }

  if (!formData || typeof formData.password !== 'string' || formData.password.trim().length === 0) {
    isFormValid = false;
    errors.password = 'Please provide your password.';
  }

  if (!isFormValid) {
    message = 'Check the form for errors.';
  }

  let result = {
    success: isFormValid,
    message,
    errors
  };

  callback(result);
}

module.exports.validateLoginForm = validateLoginForm;
module.exports.validateSignupForm = validateSignupForm;