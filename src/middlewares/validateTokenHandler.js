const CustomError = require("../utils/CustomError");
const jwt = require("jsonwebtoken");
const attempt = require("../utils/appAsyncErrorHandler");

const validateToken = attempt(async (req, res, next) => {
  let authHeader = req.headers.authorization || req.headers.Authorization;
  let token = null;

  // // Check if the authorization header is present and starts with Bearer
  // if (authHeader && authHeader.startsWith("Bearer ")) {
  //   token = authHeader.split(" ")[1];
  // } else {
  //   token = req?.query?.token;
  // }

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  } else if (req.method === "GET") {
    token = req?.query?.token;
  }
  

  if (token) {
    // Verify the JWT token
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        // If token is invalid or expired
        return res.status(403).json({ message: "Forbidden" });
      }
      // Store the decoded user information in the request object
      req.user = decoded.user;
      next(); // Move to the next middleware or route handler
    });
  } else {
    // If the token is missing or the authorization header is not properly set
    return res.status(401).json({ message: "User is not authorized" });
  }
});

module.exports = validateToken;
