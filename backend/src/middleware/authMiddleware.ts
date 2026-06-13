import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { User } from '../models/User';
import { isDBConnected } from '../config/db';
import { memoryStore } from '../config/memoryStore';

export interface AuthRequest extends Request {
  user?: any;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, env.JWT_SECRET) as { id: string };

      if (isDBConnected) {
        req.user = await User.findById(decoded.id).select('-password');
      } else {
        // Offline check: resolve from memoryStore
        req.user = memoryStore.users.find(u => u._id === decoded.id);
      }

      if (!req.user) {
        res.status(401).json({ message: 'Not authorized, user not found' });
        return;
      }
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};
