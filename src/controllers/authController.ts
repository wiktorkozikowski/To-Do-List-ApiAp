import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import userModel from '../models/userModel';
import { CreateUserDTO } from '../types/user';

class AuthController {
  getMe(req: Request, res: Response): void {
    if (!req.session.userId) {
      res.status(401).json({ success: false, error: 'Not authenticated' });
      return;
    }

    const user = userModel.getById(req.session.userId);
    if (!user) {
      res.status(401).json({ success: false, error: 'Not authenticated' });
      return;
    }

    res.json({ success: true, data: user });
  }

  register(req: Request, res: Response): void {
    try {
      const { email, login, password } = req.body as CreateUserDTO;

      if (!email || !login || !password) {
        res.status(400).json({ success: false, error: 'Email, login and password required' });
        return;
      }

      if (!email.includes('@')) {
        res.status(400).json({ success: false, error: 'Invalid email' });
        return;
      }

      if (login.trim().length < 3 || login.length > 50) {
        res.status(400).json({ success: false, error: 'Login must be 3-50 characters' });
        return;
      }

      if (password.length < 6) {
        res.status(400).json({ success: false, error: 'Password must be at least 6 characters' });
        return;
      }

      if (userModel.getByEmail(email.trim().toLowerCase())) {
        res.status(409).json({ success: false, error: 'Email already in use' });
        return;
      }

      if (userModel.getByLogin(login.trim())) {
        res.status(409).json({ success: false, error: 'Login already in use' });
        return;
      }

      const passwordHash = bcrypt.hashSync(password, 10);
      const newUser = userModel.createUser({
        email: email.trim().toLowerCase(),
        login: login.trim(),
        password_hash: passwordHash
      });

      req.session.userId = newUser.id;

      res.status(201).json({ success: true, data: newUser });
    } catch (error) {
      console.error('Register error:', error);
      res.status(500).json({ success: false, error: 'Server error' });
    }
  }

  login(req: Request, res: Response): void {
    try {
      const { identifier, password } = req.body as { identifier?: string; password?: string };

      if (!identifier || !password) {
        res.status(400).json({ success: false, error: 'Identifier and password required' });
        return;
      }

      const user = userModel.getByEmailOrLogin(identifier.trim());
      if (!user) {
        res.status(401).json({ success: false, error: 'Invalid credentials' });
        return;
      }

      const ok = bcrypt.compareSync(password, user.password_hash);
      if (!ok) {
        res.status(401).json({ success: false, error: 'Invalid credentials' });
        return;
      }

      req.session.userId = user.id;

      res.status(200).json({
        success: true,
        data: {
          id: user.id,
          email: user.email,
          login: user.login,
          created_at: user.created_at
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ success: false, error: 'Server error' });
    }
  }

  logout(req: Request, res: Response): void {
    req.session.destroy(() => {
      res.status(200).json({ success: true });
    });
  }
}

export default new AuthController();
