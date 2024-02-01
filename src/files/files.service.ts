import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { promisify } from 'util';
import { Request } from 'express';
import { writeFile } from 'fs';
import * as fs from 'fs';
import * as multer from 'multer';

const writeFileAsync = promisify(writeFile);

@Injectable()
export class FilesService {
  constructor() {}

  async uploadFileMulterPdf(req: multer.File, id: String, document: String) {
    const file = req;
    const fileName = document + '-' + new Date().getTime() + id + '.pdf';
    const filePath = './uploads/documents_upload/' + fileName;

    // Validar que el archivo es de tipo PDF
    if (file.mimetype !== 'application/pdf') {
      return new HttpException(
        { message: 'Invalid file type. Only PDF is allowed' },
        HttpStatus.BAD_REQUEST,
      );
    }

    // Validar que el tamaño del archivo no supera 1MB
    if (file.size > 1024 * 1024) {
      return new HttpException(
        { message: 'Max size 1Mb. File too large' },
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      await writeFileAsync(filePath, file.buffer);
      return new HttpException(
        { message: 'File uploaded', file_name: fileName },
        HttpStatus.OK,
      );
      // ...
    } catch (error) {
      return new HttpException(
        { message: 'Error creating extra document', error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async uploadFile(req: Request, id: String, document: String) {
    console.log(req.is('multipart/form-data'));
    try {
      if (!req.is('multipart/form-data')) {
        return new HttpException(
          {
            message:
              'Invalid request type. Only multipart/form-data is allowed',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const storage = multer.diskStorage({
        destination: './uploads/documents',
        filename: (req, file, cb) => {
          if (file.mimetype !== 'application/pdf') {
            return cb(
              new HttpException(
                {
                  message: 'Invalid file type. Only PDF is allowed',
                },
                HttpStatus.BAD_REQUEST,
              ),
              false,
            );
          }

          cb(null, document + '-' + new Date().getTime() + id + '.pdf');
        },
      });

      const upload = multer({
        storage,
        limits: {
          fileSize: 1024 * 1024 * 1,
        },
      }).single('file');

      return new Promise((resolve, _rej) => {
        upload(req, undefined, (err) => {
          if (
            err instanceof multer.MulterError &&
            err.code === 'LIMIT_FILE_SIZE'
          ) {
            resolve(
              new HttpException(
                { message: 'Max size 1Mb. File to large' },
                HttpStatus.BAD_REQUEST,
              ),
            );
          } else if (err) {
            resolve(err);
          } else {
            resolve(
              new HttpException(
                { message: 'File uploaded', route: req['file'].filename },
                HttpStatus.OK,
              ),
            );
          }
        });
      });
    } catch (error) {
      return new HttpException(
        { message: 'Error uploading file' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  getFilesInDirectory(directory: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
      fs.readdir(directory, (err, files) => {
        if (err) {
          reject(err);
        } else {
          resolve(files);
        }
      });
    });
  }
}
