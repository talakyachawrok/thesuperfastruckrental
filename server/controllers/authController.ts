import { Request, Response } from 'express';
import { User, UserRole } from '../models/User';
import { generateToken, AuthRequest } from '../middleware/auth';

export async function registerUser(req: Request, res: Response) {
  try {
    const { name, email, password, role, phone, companyName, city, avatar } = req.body;

    if (!name || !email || !role || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, role, and phone number',
      });
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'A user with this email address already exists',
      });
    }

    const id = `usr-${Date.now().toString().slice(-6)}`;
    const user = await User.create({
      id,
      name,
      email: email.toLowerCase(),
      password: password || 'superfast123',
      role,
      phone,
      companyName: companyName || (role === 'customer' ? 'Independent Shipper' : 'Owner Operator Fleet'),
      city: city || (role === 'customer' ? 'Guwahati, Assam' : 'Tinsukia, Assam'),
      avatar: avatar || (role === 'driver'
        ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'
        : 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80'),
      isVerified: role === 'customer',
    });

    const token = generateToken(user.id, user.role);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
        companyName: user.companyName,
        city: user.city,
        isVerified: user.isVerified,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Server error during registration' });
  }
}

export async function loginUser(req: Request, res: Response) {
  try {
    const { email, password, role } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please enter your email address',
      });
    }

    let user = await User.findOne({ email: email.toLowerCase() });

    // If user doesn't exist yet, auto-provision demo user session
    if (!user) {
      const id = `usr-${Date.now().toString().slice(-6)}`;
      const selectedRole: UserRole = role || 'customer';
      user = await User.create({
        id,
        name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
        email: email.toLowerCase(),
        role: selectedRole,
        phone: '+91 98540 ' + Math.floor(10000 + Math.random() * 90000),
        avatar: selectedRole === 'driver'
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
          : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
        companyName: selectedRole === 'customer' ? 'Brahmaputra Freight Traders' : 'Assam SuperFast Express',
        city: selectedRole === 'customer' ? 'Guwahati, Assam' : 'Tinsukia, Assam',
        isVerified: true,
      });
    }

    const token = generateToken(user.id, user.role);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
        companyName: user.companyName,
        city: user.city,
        isVerified: user.isVerified,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Server error during login' });
  }
}

export async function demoLogin(req: Request, res: Response) {
  try {
    const { role } = req.params;
    const targetEmail =
      role === 'driver'
        ? 'rahul.gogoi@superfast.in'
        : role === 'admin'
        ? 'admin@superfastassam.in'
        : 'priyanka.barua@brahmaputrademo.in';

    const user = await User.findOne({ email: targetEmail });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: `Demo user for role '${role}' not found. Please initialize seed data.`,
      });
    }

    const token = generateToken(user.id, user.role);

    res.json({
      success: true,
      message: `Logged in as ${user.name} (${user.role.toUpperCase()})`,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
        companyName: user.companyName,
        city: user.city,
        isVerified: user.isVerified,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error during demo login' });
  }
}

export async function getMe(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }
    res.json({
      success: true,
      user: req.user,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
}

