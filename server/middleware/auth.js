// This module is to be used when we want to protect an API endpoint with extra security.
// If we choose to protect an endpoint, the only way to access it is to
// supply the valid JWT token that is passed from backend to frontend on successful log in.
// In short, only logged in user's on the frontend can access protected backend endpoints

// TODO: Update middleware description, only checking if the Authorization header has a value,
// not whether it's a valid value
module.exports = (req, res, next) => {
  // Check token
  if (!req.headers.authorization) {
    return res.status(401).json({ error: 'Unauthorized: No Auth Token' });
  }

  next();
}