import { Module } from '@nestjs/common';

import { AppConfigModule } from '~/config/appConfig';
import { AuthModule } from '~/modules/auth/auth.module';
import { CategoriesModule } from '~/modules/categories/categories.module';
import { ColumnsModule } from '~/modules/columns/columns.module';
import { CommentsModule } from '~/modules/comments/comments.module';
import { ProjectsModule } from '~/modules/projects/projects.module';
import { TasksModule } from '~/modules/tasks/tasks.module';
import { UserModule } from '~/modules/users/users.module';
import { DatabaseModule } from './database';

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
