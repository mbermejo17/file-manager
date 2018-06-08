const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    console.log('middeleware:check-user');
    const sessionId = req.cookies.sessionId;
    const Token = req.cookies.token;
    if (sessionId && Token) {
        console.log('Token: ' + Token);
        next();
    } else {
        res.render("index", {});
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