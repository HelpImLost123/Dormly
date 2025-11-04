// Authentication middleware to protect routes
const requireAuth = (req, res, next) => {
  if (req.session && req.session.user) {
    // User is authenticated
    return next();
  } else {
    // User is not authenticated
    return res.status(401).json({
      success: false,
      message: 'Authentication required',
      code: 'AUTH_REQUIRED'
    });
  }
};

// Middleware to check if user is already logged in
const requireGuest = (req, res, next) => {
  if (req.session && req.session.user) {
    // User is already logged in
    return res.status(400).json({
      success: false,
      message: 'Already logged in',
      code: 'ALREADY_AUTHENTICATED'
    });
  } else {
    // User is not logged in, proceed
    return next();
  }
};

// Middleware to optionally add user info to request
const addUserInfo = (req, res, next) => {
  if (req.session && req.session.user) {
    req.user = req.session.user;
  }
  next();
};

// Middleware to check if user owns a resource
const requireOwnership = (userIdField = 'user_id') => {
  return (req, res, next) => {
    if (!req.session || !req.session.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
        code: 'AUTH_REQUIRED'
      });
    }

    const resourceUserId = req.params[userIdField] || req.body[userIdField];
    if (req.session.user.user_id !== parseInt(resourceUserId)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied - insufficient permissions',
        code: 'ACCESS_DENIED'
      });
    }

    next();
  };
};

module.exports = {
  requireAuth,
  requireGuest,
  addUserInfo,
  requireOwnership
};