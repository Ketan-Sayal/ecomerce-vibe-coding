import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";

const authMiddleware = (req, res, next) => {
  try {
    // Get token from Authorization header or cookies
    let token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      token = req.cookies?.authToken;
    }

    if (!token) {
      const error = new ApiError(401, "Authorization token is required");
      return next(error);
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
    req.user = decoded;
    return next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      const apiError = new ApiError(401, "Token has expired");
      return next(apiError);
    }
    if (error instanceof jwt.JsonWebTokenError) {
      const apiError = new ApiError(401, "Invalid token");
      return next(apiError);
    }
    return next(error);
  }
};

export default authMiddleware;
