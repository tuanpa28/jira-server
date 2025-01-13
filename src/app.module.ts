import { Module } from '@nestjs/common';

import { AppConfigModule } from '~/config/app';
import { DatabaseModule } from '~/config/database';
import { UserModule } from '~/modules/users';
import { AuthModule } from '~/modules/auth';
import { CategoriesModule } from '~/modules/categories';
import { ColumnsModule } from '~/modules/columns';
import { CommentsModule } from '~/modules/comments';
import { ProjectsModule } from '~/modules/projects';
import { TasksModule } from '~/modules/tasks';

@Module({
  imports: [
    AppConfigModule,
    DatabaseModule,
    UserModule,
    AuthModule,
    CategoriesModule,
    ColumnsModule,
    CommentsModule,
    ProjectsModule,
    TasksModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
