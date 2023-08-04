async function authenticateJwt(req, res, next) {
  let authheader = req.headers.authorization;
  if (authheader) {
    let token = authheader.split(" ")[1];

    jwt.verify(token, SECRET, async (err, data) => {
      if (err) {
        res.status(403).json({
          message: "Invaild token or expried",
        });
      }

      if (data.role == "Admin") {
        var response = await Admin.findById(data.id);
      } else {
        var response = await User.findById(data.id);
      }
      console.log(response);
      let payload = {
        id: response.id,
        username: response.username,
        role: response.role,
      };

      req.user = payload;

      next();
    });
  }
}

export default authenticateJwt;
