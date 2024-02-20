import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';

import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express/multer';

@Module({
    imports: [
        MulterModule.register()
    ],
    controllers: [
        UploadController,
    ],
    providers: [ 
        UploadService,
    ],
})
export class UploadModule { }
