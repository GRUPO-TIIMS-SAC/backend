import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { promisify } from 'util';
import { Request } from 'express';
import { writeFile } from 'fs';
import * as fs from 'fs';
import * as path from 'path';
import * as multer from 'multer';
import { InjectRepository } from '@nestjs/typeorm';
import { ImgsFiles } from 'src/entities/img_files.entity';
import { Repository } from 'typeorm';
import { DeleteFileDto } from './dto/delete-file.dto';

const writeFileAsync = promisify(writeFile);
const mkdirAsync = promisify(fs.mkdir);
const uploadDirectoryPdf = path.join(__dirname, './uploads/documents_upload');
const uploadDirectoryImg = path.join(__dirname, './uploads/images_upload');

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(ImgsFiles)
    private imgsFilesRepository: Repository<ImgsFiles>,
  ) {}

  async uploadFileMulterPdf(req: multer.File, id: String, document: String) {
    const file = req;
    const fileName = document + '-' + new Date().getTime() + id + '.pdf';
    // const uploadDirectory = path.resolve(__dirname, './uploads/documents_upload');
    console.log(uploadDirectoryPdf);
    const filePath = path.join(uploadDirectoryPdf, fileName);

    // Crear el directorio si no existe
    if (!fs.existsSync(uploadDirectoryPdf)) {
      await mkdirAsync(uploadDirectoryPdf, { recursive: true });
    }

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
        { message: 'Tamaño máximo 1Mb' },
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

  async uploadFileMulterImage(req: multer.File) {
    const file = req;
    let extension;
    console.log(req);
    console.log(file.mimetype);

    if(file.mimeType){
      extension = file.mimeType.split('/')[1];
      console.log(extension);
    }else{
      extension = 'png';
    }

    const fileName = new Date().getTime().toString() + '.' + extension;
    // const uploadDirectory = path.resolve(__dirname, './uploads/documents_upload');
    console.log(fileName);
    const filePath = path.join(uploadDirectoryImg, fileName);
    console.log(filePath);

    // Crear el directorio si no existe
    if (!fs.existsSync(uploadDirectoryImg)) {
      await mkdirAsync(uploadDirectoryImg, { recursive: true });
    }

    // Validar que el archivo es de tipo PDF
    //TODO VALIDAR MÁS ADELANTE
    /* if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpg') {
      return new HttpException(
        { message: 'Invalid file type. Only PNG and JPG is allowed' },
        HttpStatus.BAD_REQUEST,
      );
    } */

    // Validar que el tamaño del archivo no supera 1MB
    if (file.size > 1024 * 1024 * 0.5) {
      return new HttpException(
        { message: 'Tamaño máximo 500Kb' },
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
      console.log(error)
      return new HttpException(
        { message: 'Error creating extra document', error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteStorageFile(body: DeleteFileDto) {
    // Define la ruta al archivo que quieres eliminar
    const filePath = path.join(__dirname, 'uploads', body.dir, body.file);
    console.log(filePath);

    fs.unlink(filePath, (err) => {
      if (err) {
        console.log(err);
        return new HttpException(
          { message: 'Error deleting file', error: err.message },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      } else {
        return new HttpException({ message: 'File deleted' }, HttpStatus.OK);
      }
    });
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
