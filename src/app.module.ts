import { Module } from '@nestjs/common';

import { AppConfigModule } from '@/libs/common/appConfig';
import { DatabaseModule } from '@/libs/common/database';
import { UserModule } from '@/users/users.module';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { ColumnsModule } from './columns/columns.module';
import { CommentsModule } from './comments/comments.module';
import { ProjectsModule } from './projects/projects.module';
import { TasksModule } from './tasks/tasks.module';

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
