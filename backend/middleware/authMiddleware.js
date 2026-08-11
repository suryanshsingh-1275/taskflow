import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {

    try {

        // Get Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                message: "Authentication required"
            });
        }

        // Authorization: Bearer <token>

        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                message: "Invalid authorization format"
            });
        }

        // Verify JWT
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Put decoded user information
        // on the request
        req.user = decoded;

        // Continue to controller
        next();

    } catch (error) {

        console.error("Auth Middleware Error:", error);

        return res.status(401).json({
            message: "Invalid or expired token"
        });

    }
};

export default authMiddleware;