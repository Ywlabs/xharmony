import { Bind, Body, Controller, HttpStatus, Post, Res, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express/multer';
import { multerDiskDestinationOutOptions, multerDiskOptions, multerMemoryOptions } from 'src/config/multer/multer.config';
import { UploadService } from './upload.service';
import { Response } from 'express';

@Controller({ path: "upload", version: "1" })
export class UploadController { 
    constructor(private readonly uploadService: UploadService) {}
    /**
     * @author Masasiki
     * @description 디스크 방식 파일 업로드 (1)-> Destination 옵션 설정
     *
     * @param {File[]} files 다중 파일
     * @param res Response 객체
     */
    @Post('/disk_upload1')
    @UseInterceptors(FilesInterceptor('files', null, multerDiskOptions))
    @Bind(UploadedFiles())
    uploadFileDisk(files: File[], @Res() res: Response) {
        res.status(HttpStatus.OK).json({
            success: true,
            data: this.uploadService.uploadFileDisk(files),
        });
    }

    /**
     * @author Masasiki
     * @description 디스크 방식 파일 업로드 (2)-> Destination 옵션 미설정
     *
     * @param {File[]} files 다중 파일
     * @param  user_id 유저 아이디
     * @param res Response 객체
     */
    @Post('/disk_upload2')
    @UseInterceptors(FilesInterceptor('files', null, multerDiskDestinationOutOptions),)
    @Bind(UploadedFiles())
    uploadFileDiskDestination(files: File[],@Body('user_id') user_id: string,@Res() res: Response) {
        if (user_id != undefined) {
            user_id = 'amma76';
        }

        res.status(HttpStatus.OK).json({
            success: true,
            data: this.uploadService.uploadFileDiskDestination(user_id, files),
        });
    }

    /**
     * @author Masasiki
     * @description 메모리 방식 파일 업로드
     *
     * @param {File[]} files 다중 파일
     * @param  user_id 유저 아이디
     * @param res Response 객체
     */
    @Post('/memory_upload')
    @UseInterceptors(FilesInterceptor('files', null, multerMemoryOptions))
    @Bind(UploadedFiles())
    uploadFileMemory(files: File[], @Body('user_id') user_id: string, @Res() res: Response) {
        if (user_id != undefined) {
            user_id = 'amma76';
        }
        res.status(HttpStatus.OK).json({
            success: true,
            data: this.uploadService.uploadFileMemory(user_id, files),
        });
    }
}
