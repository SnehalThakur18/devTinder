const adminAuth = (req, res, next) => {
  console.log("Admin authentication middleware executed.");
  const authToken = "xyz123";
  const isAdminAuthorized = authToken === "xyz123";

  if (isAdminAuthorized) {
    next();
  } else {
    res.status(401).send("Unauthorized request.");
  }
};

const userAuth = (req, res, next) => {
  const userToken = "xyz123";
  const isUserAuthorized = userToken === "xyz123";
  if (isUserAuthorized) {
    next();
  } else {
    res.status(401).send("Unauthorized request.");
  }
};

module.exports = {
  adminAuth,
  userAuth,
};
