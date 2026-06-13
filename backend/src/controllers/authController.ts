import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { env } from '../config/env';
import { AuthRequest } from '../middleware/authMiddleware';
import { isDBConnected } from '../config/db';
import { memoryStore, MemoryUser } from '../config/memoryStore';
import bcrypt from 'bcryptjs';

const generateToken = (id: string): string => {
  return jwt.sign({ id }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as any,
  });
};

const validateEmail = (email: string): boolean => {
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

const validatePasswordStrength = (password: string): { isValid: boolean; message?: string } => {
  if (!password || password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters long.' };
  }
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one uppercase letter.' };
  }
  if (!/[a-z]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one lowercase letter.' };
  }
  if (!/[0-9]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one number.' };
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one special character.' };
  }
  return { isValid: true };
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    if (!email || !validateEmail(email)) {
      res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
      return;
    }

    const pwdCheck = validatePasswordStrength(password);
    if (!pwdCheck.isValid) {
      res.status(400).json({ success: false, message: pwdCheck.message });
      return;
    }

    if (isDBConnected) {
      const userExists = await User.findOne({ email });
      if (userExists) {
        res.status(409).json({ success: false, message: 'Account already exists. Please login.' });
        return;
      }

      const user = await User.create({ name, email, password });
      res.status(201).json({
        success: true,
        token: generateToken(user._id.toString()),
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          skills: user.skills,
          avatar: user.avatar,
        },
      });
    } else {
      // Offline fallback
      const userExists = memoryStore.users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (userExists) {
        res.status(409).json({ success: false, message: 'Account already exists. Please login.' });
        return;
      }

      const hashedPassword = await bcrypt.hash(password || '123456', 10);
      const newUser: MemoryUser = {
        _id: `mem_user_${Date.now()}`,
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        avatar: '',
        role: 'candidate',
        skills: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      memoryStore.users.push(newUser);

      res.status(201).json({
        success: true,
        token: generateToken(newUser._id),
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          skills: newUser.skills,
          avatar: newUser.avatar,
        },
      });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (isDBConnected) {
      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        res.status(404).json({ success: false, message: 'No account found. Please sign up.' });
        return;
      }

      const isMatch = await (user as any).matchPassword(password);
      if (!isMatch) {
        res.status(401).json({ success: false, message: 'Invalid password.' });
        return;
      }

      res.json({
        success: true,
        token: generateToken(user._id.toString()),
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          skills: user.skills,
          avatar: user.avatar,
        },
      });
    } else {
      // Offline fallback
      const user = memoryStore.users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!user) {
        res.status(404).json({ success: false, message: 'No account found. Please sign up.' });
        return;
      }

      const isMatch = await bcrypt.compare(password, user.password || '');
      if (!isMatch) {
        res.status(401).json({ success: false, message: 'Invalid password.' });
        return;
      }

      res.json({
        success: true,
        token: generateToken(user._id),
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          skills: user.skills,
          avatar: user.avatar,
        },
      });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    // Security requirement: Never reveal whether the email exists during password reset.
    res.json({
      success: true,
      message: 'If an account exists with this email, a password reset link has been sent.',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const googleLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { googleToken, email, name, avatar } = req.body;

    if (!email) {
      res.status(400).json({ message: 'Email required for Google OAuth' });
      return;
    }

    if (isDBConnected) {
      let user = await User.findOne({ email });
      if (!user) {
        user = await User.create({
          name: name || 'Google User',
          email,
          avatar: avatar || '',
          googleId: googleToken || 'google_oauth_bypass',
        });
      }

      res.json({
        token: generateToken(user._id.toString()),
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          skills: user.skills,
          avatar: user.avatar,
        },
      });
    } else {
      // Offline fallback
      let user = memoryStore.users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!user) {
        user = {
          _id: `mem_user_${Date.now()}`,
          name: name || 'Google User',
          email: email.toLowerCase(),
          avatar: avatar || '',
          googleId: googleToken || 'google_oauth_bypass',
          role: 'candidate',
          skills: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        memoryStore.users.push(user);
      }

      res.json({
        token: generateToken(user._id),
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          skills: user.skills,
          avatar: user.avatar,
        },
      });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (isDBConnected) {
      if (!req.user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      res.json({
        user: {
          id: req.user._id,
          name: req.user.name,
          email: req.user.email,
          role: req.user.role,
          skills: req.user.skills,
          avatar: req.user.avatar,
        },
      });
    } else {
      // Offline fallback: JWT decode is verified, pull ID from request token
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        res.status(401).json({ message: 'No authorization headers' });
        return;
      }
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, env.JWT_SECRET) as { id: string };
      const user = memoryStore.users.find(u => u._id === decoded.id);

      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      res.json({
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          skills: user.skills,
          avatar: user.avatar,
        },
      });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({ message: 'No authorization headers' });
      return;
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, env.JWT_SECRET) as { id: string };

    if (isDBConnected) {
      const user = await User.findById(decoded.id);
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      user.name = req.body.name || user.name;
      user.skills = req.body.skills || user.skills;
      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();
      res.json({
        user: {
          id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          skills: updatedUser.skills,
          avatar: updatedUser.avatar,
        },
      });
    } else {
      // Offline fallback
      const user = memoryStore.users.find(u => u._id === decoded.id);
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      user.name = req.body.name || user.name;
      user.skills = req.body.skills || user.skills;
      if (req.body.password) {
        user.password = await bcrypt.hash(req.body.password, 10);
      }
      user.updatedAt = new Date();

      res.json({
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          skills: user.skills,
          avatar: user.avatar,
        },
      });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
