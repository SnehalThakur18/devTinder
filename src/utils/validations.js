const validator = require("validator");

const validateSignupData = (req) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !validator.isAlpha(firstName, "en-US", { ignore: " " })) {
    return {
      isValid: false,
      message: "Invalid first name.",
    };
  }

  if (!lastName || !validator.isAlpha(lastName, "en-US", { ignore: " " })) {
    return {
      isValid: false,
      message: "Invalid last name.",
    };
  }

  if (!email || !validator.isEmail(email)) {
    return {
      isValid: false,
      message: "Invalid email.",
    };
  }

  if (!password || !validator.isStrongPassword(password)) {
    return {
      isValid: false,
      message: "Password is not strong enough.",
    };
  }

  return {
    isValid: true,
    message: "OK",
  };
};

const validateEditProfileData = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "age",
    "gender",
    "photoUrl",
    "about",
    "skills",
  ];

  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field),
  );

  return isEditAllowed;
};

module.exports = {
  validateSignupData,
  validateEditProfileData,
};
