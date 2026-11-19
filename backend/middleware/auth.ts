import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, IUser, UserRole } from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'superfast_secure_assam_secret_key_2026';

export interface AuthRequest extends Request {
  user?: IUser;
}

export function generateToken(id: string, role: UserRole): string {
  return jwt.sign({ id, role }, JWT_SECRET, {
    expiresIn: '30d',
  });
}

export async function protect(req: AuthRequest, res: Response, next: NextFunction) {
  let token: string | undefined;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no session token provided',
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; role: UserRole };
    const user = await User.findOne({ id: decoded.id }).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'The user belonging to this token no longer exists',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, token invalid or expired',
    });
  }
}

export function authorize(...roles: UserRole[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user?.role}' is not authorized to access this route`,
      });
    }
    next();
  };
}

