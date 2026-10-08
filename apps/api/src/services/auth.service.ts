import * as argon2 from 'argon2';
import { prisma } from '../db/prisma';
import { SignupInput, LoginInput } from '@seva/contracts';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.util';

export class AuthService {
  async signup(input: SignupInput) {
    const existing = await prisma.user.findUnique({ where: { email: input.email } });
    if (existing) {
      const err: any = new Error('An account with this email already exists.');
      err.status = 400;
      err.code = 'CONFLICT';
      throw err;
    }

    const passwordHash = await argon2.hash(input.password);
    const user = await prisma.user.create({
      data: {
        email: input.email,
        passwordHash,
        profile: {
          create: {
            displayName: input.displayName,
            visibility: 'members',
            onboardingDone: false,
          }
        }
      },
      include: { profile: true }
    });

    const jwtPayload = { userId: user.id, email: user.email, systemRole: user.systemRole };
    const accessToken = generateAccessToken(jwtPayload);
    const refreshToken = generateRefreshToken(jwtPayload);

    return {
      user: {
        id: user.id,
        email: user.email,
        displayName: user.profile?.displayName,
        systemRole: user.systemRole,
      },
      accessToken,
      refreshToken,
    };
  }

  async login(input: LoginInput) {
    const user = await prisma.user.findUnique({
      where: { email: input.email },
      include: { profile: true }
    });

    if (!user) {
      const err: any = new Error('Invalid email or password.');
      err.status = 401;
      err.code = 'UNAUTHENTICATED';
      throw err;
    }

    const valid = await argon2.verify(user.passwordHash, input.password);
    if (!valid) {
      const err: any = new Error('Invalid email or password.');
      err.status = 401;
      err.code = 'UNAUTHENTICATED';
      throw err;
    }

    const jwtPayload = { userId: user.id, email: user.email, systemRole: user.systemRole };
    const accessToken = generateAccessToken(jwtPayload);
    const refreshToken = generateRefreshToken(jwtPayload);

    return {
      user: {
        id: user.id,
        email: user.email,
        displayName: user.profile?.displayName,
        systemRole: user.systemRole,
      },
      accessToken,
      refreshToken,
    };
  }
}
