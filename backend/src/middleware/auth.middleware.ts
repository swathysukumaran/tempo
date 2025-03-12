export const auth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  passport.authenticate('jwt', { session: false }, (err: Error, user: IUser) => {
    if (err) {
      return next(err);
    }
    
    if (!user) {
      return res.status(401).json({ msg: 'Unauthorized. No token provided or token is invalid' });
    }
    
    req.user = user;
    next();
  })(req, res, next);
};

// Middleware to check if user is admin
export const adminAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  auth(req, res, () => {
    if (!req.user) {
      return res.status(401).json({ msg: 'Unauthorized' });
    }
    
    if (req.user.role !== UserRole.ADMIN) {
      return res.status(403).json({ msg: 'Access denied. Admin privileges required' });
    }
    
    next();
  });
};