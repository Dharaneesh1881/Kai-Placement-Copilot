const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

function auth(req, res, next) {
    //const token = req.header.token
    const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(" ")[1]);


    if (!token) {
        return res.status(401).json({ message: "Not authenticated" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        if (decoded) {
            req.userId = decoded.id;
            next();
        }
        else {
            res.status(403).json({
                message: "incorrect cretentials"
            })
        }
    }
    catch (err) {
        res.status(401).json({ message: "Invalid token" });
    }

}

module.exports = { JWT_SECRET, auth };
