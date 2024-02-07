import { Body, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ImgsFiles } from 'src/entities/img_files.entity';
import { FilesService } from 'src/files/files.service';
import { Repository } from 'typeorm';
import * as multer from 'multer';
import { UpdloadImgFileDto } from './dto/create-img.dto';

@Injectable()
export class ImgsFilesService {
  constructor(
    @InjectRepository(ImgsFiles)
    private imgsFilesRepository: Repository<ImgsFiles>,
    private readonly fileService: FilesService,
  ) {}

  async create(req: multer.File) {
    try {
      //TODO: Add token validation admin
      let route;

      //VALIDATED LENGTH NAME
      if(req.originalname.length > 50){
        return new HttpException(
          { message: 'Name too long' },
          HttpStatus.BAD_REQUEST,
        );
      }

      //VALIDATED DUPLICATED
      const imgFile = await this.imgsFilesRepository.findOne({
        where: { image: req.filename },
      });

      if (imgFile) {
        return new HttpException(
          { message: 'Image file already exists' },
          HttpStatus.CONFLICT,
        );
      }

      //UPDLOAD FILE
      const file = await this.fileService.uploadFileMulterImage(req);

      if (file.getStatus() !== 200) {
        return file;
      }

      const fileResp = file.getResponse();
      if (
        typeof fileResp === 'object' &&
        'file_name' in fileResp
      ) {
        route = fileResp.file_name;
      } else {
        return new HttpException(
          {
            message: 'Error creating image',
            error: fileResp,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      //CREATE IMAGE FILE
      const newImgFile = this.imgsFilesRepository.create({
        image: req.originalname,
        url: route,
      });

      const respData = await this.imgsFilesRepository.save(newImgFile);

      return new HttpException(
        { message: 'Image file created', data: respData },
        HttpStatus.CREATED,
      );
    } catch (error) {
      console.log(error)
      return new HttpException(
        { message: 'Error creating image file', error: error.message},
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAll() {
    try {
      const imgsFiles = await this.imgsFilesRepository.find();

      if (imgsFiles.length === 0) {
        return new HttpException(
          { message: 'No images files found' },
          HttpStatus.NOT_FOUND,
        );
      }

      const newData = imgsFiles.map((img) => {
        img.url = 'http://localhost:4000/images_upload/' + img.url;
        return img;
      });

      return new HttpException(
        { message: 'Images files found', data: imgsFiles },
        HttpStatus.OK,
      );
    } catch (error) {
      return new HttpException(
        { message: 'Error getting images files' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
