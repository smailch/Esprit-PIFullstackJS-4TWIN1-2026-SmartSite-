import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validateGroqEnv } from './analysis-ai/groq-env.validation';
import { JobsModule } from './jobs/jobs.module';
import { ResourcesModule } from './resources/resources.module';
import { ProjectsModule } from './projects/projects.module';
import { TasksModule } from './tasks/tasks.module';
import { UsersModule } from './users/users.module';
import { HumanResourcesModule } from './human-resources/human-resources.module';
import { EquipmentResourcesModule } from './equipment-resources/equipment-resources.module';
import { AnalysisAiModule } from './analysis-ai/analysis-ai.module';
import { RolesModule } from './roles/roles.module';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuditLogModule } from './audit-logs/audit-log.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.example',
      validate: validateGroqEnv,
    }),
    MongooseModule.forRoot('mongodb://localhost:27017/smartsiteloc'
    ),
    JobsModule,
    AuditLogModule,
    ResourcesModule,
    ProjectsModule, // Ajout du module Projects
    TasksModule, // Ajout du module Tasks
    UsersModule,
    RolesModule,
    AuthModule,
    HumanResourcesModule,
    EquipmentResourcesModule,
    AnalysisAiModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
