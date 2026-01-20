import { Request } from 'express';

export interface AuthRequest extends Request {
  userId?: string;
}

/// USE IT