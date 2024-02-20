import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { extname } from 'path';
import { uploadFileURL } from 'src/config/multer/multer.config';

@Injectable()
export class UploadService { 
    /**
     * @author Ryan
     * @description 디스크 방식 파일 업로드 (1)
     *
     * @param files 파일 데이터
     * @returns {String[]} 파일 경로
     */
    uploadFileDisk(files: File[]): string[] {
        return files.map((file: any) => {
            //파일 이름 반환
            return uploadFileURL(file.filename);
        });
    }

    /**
     * @author Ryan
     * @description 디스크 방식 파일 업로드 (2)
     *
     * @param user_id 유저 아이디
     * @param files 파일 데이터
     * @returns {String[]} 파일 경로
     */
    uploadFileDiskDestination(user_id: string, files: File[]): string[] {
        //유저별 폴더 생성
        const uploadFilePath = `uploads/${user_id}`;

        if (!fs.existsSync(uploadFilePath)) {
            // uploads 폴더가 존재하지 않을시, 생성합니다.
            fs.mkdirSync(uploadFilePath);
        }
        return files.map((file: any) => {
            //파일 이름
            const fileName = Date.now() + extname(file.originalname);
            //파일 업로드 경로
            const uploadPath =
                __dirname + `/../../${uploadFilePath + '/' + fileName}`;

            //파일 생성
            fs.writeFileSync(uploadPath, file.path); // file.path 임시 파일 저장소
            return uploadFileURL(uploadFilePath + '/' + fileName);
        });
    }

    /**
     * @author Ryan
     * @description 메모리 방식 파일 업로드
     *
     * @param user_id 유저 아이디
     * @param files 파일 데이터
     * @returns {String[]} 파일 경로
     */
    uploadFileMemory(user_id: string, files: File[]): any {
        //유저별 폴더 생성
        const uploadFilePath = `uploads/${user_id}`;

        if (!fs.existsSync(uploadFilePath)) {
            // uploads 폴더가 존재하지 않을시, 생성합니다.
            fs.mkdirSync(uploadFilePath);
        }

        return files.map((file: any) => {
            //파일 이름
            const fileName = Date.now() + extname(file.originalname);
            //파일 업로드 경로
            const uploadPath = __dirname + `/../../${uploadFilePath + '/' + fileName}`;

            //파일 생성
            fs.writeFileSync(uploadPath, file.buffer);

            //업로드 경로 반환
            return uploadFileURL(uploadFilePath + '/' + fileName);
        });
    }
}
