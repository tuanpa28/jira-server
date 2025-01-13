import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { UserService } from '~/modules/users';
import { UserGoogleDto } from '~/modules/users/dto';

@Injectable()
export class GoogleSerializer extends PassportSerializer {
  constructor(private userService: UserService) {
    super();
  }

  serializeUser(user: UserGoogleDto, done: CallableFunction) {
    done(null, user.id);
  }

  async deserializeUser(id: number, done: CallableFunction) {
    return await this.userService
      .findOne(id)
      .then((user) => done(null, user))
      .catch((err) => done(err));
  }
}
