import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

const TOKEN_COOKIE = 'sf_token';

function extractCookieToken(req: any): string | null {
  if (!req) {
    return null;
  }

  const cookieFromParser =
    typeof req.cookies?.[TOKEN_COOKIE] === 'string' ? req.cookies[TOKEN_COOKIE] : null;
  if (cookieFromParser) {
    return cookieFromParser;
  }

  const cookieHeader = typeof req.headers?.cookie === 'string' ? req.headers.cookie : '';
  if (!cookieHeader) {
    return null;
  }

  const cookiePart = cookieHeader
    .split(';')
    .map((part: string) => part.trim())
    .find((part: string) => part.startsWith(`${TOKEN_COOKIE}=`));
  if (!cookiePart) {
    return null;
  }

  const value = cookiePart.slice(`${TOKEN_COOKIE}=`.length);
  return value || null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        extractCookieToken,
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    return {
      id: payload.sub,
      email: payload.email,
      username: payload.username,
      fullName: payload.fullName,
      roles: payload.roles,
    };
  }
}
