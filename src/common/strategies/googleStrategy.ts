import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import * as bcrypt from 'bcryptjs';
import { Profile, Strategy } from 'passport-google-oauth20';
import * as randomstring from 'randomstring';

import { User } from '~/entities';
import { UserService } from '~/modules/users';
import { CreateUserDto } from '~/modules/users/dto';
import { getLastName } from '../utils';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private userService: UserService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.URL_SERVER}/auth/google/redirect`,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    createProfile: CreateUserDto,
  ): Promise<User> {
    const user = await this.convertProfileToUser(profile);
    const userData = { ...user, ...createProfile };

    return (
      (await this.userService.findOneOptions<{ [key: string]: string }[]>({
        field: 'where',
        payload: [{ googleId: user.googleId }, { email: user.email }],
      })) || (await this.userService.create(userData))
    );
  }

  private async convertProfileToUser(profile: Profile): Promise<User> {
    const username = this.generateUsername(profile.name.givenName);
    const hashedPassword = await this.generateRandomHashedPassword();

    return {
      googleId: profile.id,
      username,
      email: profile.emails[0].value,
      password: hashedPassword,
      avatar: profile.photos[0].value,
    } as User;
  }

  private generateUsername(givenName: string): string {
    const randomString = randomstring.generate({
      length: 4,
      charset: 'abcdefghijklmnopqrstuvwxyz0123456789',
    });
    return `${getLastName(givenName)}_${randomString}`;
  }

  private async generateRandomHashedPassword(): Promise<string> {
    const randomPassword = randomstring.generate({ length: 6, charset: 'numeric' });
    return bcrypt.hash(randomPassword, 10);
  }
}
