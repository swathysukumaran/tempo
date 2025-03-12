import { PassportStatic } from 'passport';
import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions } from 'passport-jwt';
import dotenv from 'dotenv';
import User from '../models/User';
import { JwtPayload } from '../types/user.types';

dotenv.config();

const options: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || 'default_jwt_secret'
};

export default (passport: PassportStatic) => {
  passport.use(
    new JwtStrategy(options, async (jwt_payload: JwtPayload, done) => {
      try {
        const user = await User.findById(jwt_payload.user.id);
        
        if (user) {
          return done(null, user);
        }
        
        return done(null, false);
      } catch (err) {
        console.error(err);
        return done(err, false);
      }
    })
  );
};
