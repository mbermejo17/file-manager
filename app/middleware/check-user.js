const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  if (process.env.NODE_ENV === 'dev') console.log('middleware:check-user');
    const sessionId = req.cookies.sessionId;
    const Token = req.cookies.token;
    if (process.env.NODE_ENV === 'dev') console.log('middleware:check-user:sessionId',sessionId)
    if (process.env.NODE_ENV === 'dev') console.log('middleware:check-user:Token',Token)
    if (sessionId && Token) {
      if (process.env.NODE_ENV === 'dev') console.log('Token: ' + Token);
        next();
    } else {
      if (process.env.NODE_ENV === 'dev') console.log("render logon");
        res.render("logon", {});
    }
    /* try {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_KEY);
      console.log('Token found:', token);
      req.userData = decoded;
      next();
    } catch (error) {
      const sessionId = req.cookies.sessionId;
      const Token = req.cookies.token;
      if (sessionId && Token) {
        console.log('Token: ' + Token);
        next();
      } else {
        res.render("index", {});
      }
    } */
};