import { getAuth } from '@clerk/express';

export const requireAdmin = (req, res, next) => {
  const { userId, sessionClaims } = getAuth(req);
  const role = sessionClaims?.metadata?.role || sessionClaims?.public_metadata?.role;
  if (!userId || role !== 'admin') return res.status(403).json({ success: false, message: 'Admin access is required' });
  next();
};
