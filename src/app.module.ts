import { Module } from '@nestjs/common';

import { AuthModule } from '@/auth/auth.module';
import { CategoriesModule } from '@/categories/categories.module';
import { ColumnsModule } from '@/columns/columns.module';
import { CommentsModule } from '@/comments/comments.module';
import { AppConfigModule } from '@/libs/common/appConfig';
import { DatabaseModule } from '@/libs/common/database';
import { ProjectsModule } from '@/projects/projects.module';
import { TasksModule } from '@/tasks/tasks.module';
import { UserModule } from '@/users/users.module';

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
