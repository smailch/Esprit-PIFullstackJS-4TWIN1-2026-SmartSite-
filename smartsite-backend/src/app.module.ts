import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JobsModule } from './jobs/jobs.module';
import { ResourcesModule } from './resources/resources.module';
import { HumanResourcesModule } from './human-resources/human-resources.module';
import { EquipmentResourcesModule } from './equipment-resources/equipment-resources.module';
import { TaskModule } from './task/task.module';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
@Module({
  imports: [
    // Connexion MongoDB Atlas
    MongooseModule.forRoot(
  'mongodb+srv://mourad:mourad@smartsite.poyscqk.mongodb.net/smartsite?retryWrites=true&w=majority'
    ),
    JobsModule,
    ResourcesModule,
    HumanResourcesModule,
    EquipmentResourcesModule,
    TaskModule,
    
    
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
