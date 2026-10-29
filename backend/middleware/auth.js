
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Protect routes by verifying the JWT and checking the current account.
 * Rejects expired tokens, deleted accounts, and outdated sessions.
 */
export async function protect(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        message: 'No authorization token provided',
      });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        message: 'No authorization token provided',
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error('FATAL: JWT_SECRET environment variable is missing');
      return res.status(500).json({
        message: 'Internal server configuration error',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.id) {
      return res.status(401).json({ message: 'Token is invalid' });
    }

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        message: 'Account no longer exists. Please log in again.',
      });
    }

    // Reject tokens issued before a password change or session reset.
    if (
      typeof decoded.tokenVersion !== 'number' ||
      decoded.tokenVersion !== user.tokenVersion
    ) {
      return res.status(401).json({
        message: 'Your session has expired. Please log in again.',
      });
    }

    req.user = {
      _id: user._id,
      name: user.name,
      email: user.email,
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        message: 'Token has expired, please log in again',
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        message: 'Token is invalid or corrupted',
      });
    }

    console.error('Authentication check failed:', error);
    return res.status(500).json({
      message: 'Unable to verify authentication',
    });
  }
}

export default protect;
