import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StatusRequest } from 'src/entities/status_request.entity';
import { Repository } from 'typeorm';
import { CreateStatusRequestDto } from './dto/create-status_request.dto';

@Injectable()
export class StatusRequestService {
  constructor(
    @InjectRepository(StatusRequest)
    private statusRequestsRepository: Repository<StatusRequest>,
  ) { }

  async create(body: CreateStatusRequestDto) {
    try {
      const statusRequest = await this.statusRequestsRepository.findOne({
        where: {
          status: body.status,
        },
      });

      if (statusRequest) {
        return {
          message: 'Status Request already exists',
          status: 409,
        };
      }

      const newStatusRequest = this.statusRequestsRepository.create(body);
      const respData =
        await this.statusRequestsRepository.save(newStatusRequest);

      return new HttpException(
        {
          message: 'Status Request created',
          status: HttpStatus.CREATED,
          data: respData,
        },
        HttpStatus.CREATED,
      );
    } catch (error) {
      return new HttpException(
        { message: 'Error creating Status Request' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAll() {
    try {
      const statusRequests = await this.statusRequestsRepository.find();
      console.log(statusRequests);
      if (!statusRequests || statusRequests.length === 0) {
        return new HttpException(
          {
            message: 'No Status Requests found',
            status: HttpStatus.NOT_FOUND,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return new HttpException({
        message: 'Status Requests found',
        status: HttpStatus.OK,
        data: statusRequests,
      }, HttpStatus.OK);
    } catch (error) {
      return new HttpException({
        message: 'Error getting all Status Requests',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getByStatus(status: string) {
    try {
      const statusRequest = await this.statusRequestsRepository.findOne({
        where: {
          status: status.toLowerCase(),
        },
      });

      if (!statusRequest) {
        return new HttpException({
          message: 'Status Request not found',
          status: HttpStatus.NOT_FOUND,
        }, HttpStatus.NOT_FOUND);
      }

      return new HttpException({
        message: 'Status Request found',
        status: HttpStatus.OK,
        data: statusRequest,
      }, HttpStatus.OK);
    } catch (error) {
      return new HttpException({
        message: 'Error getting Status Request',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  getById(id: number) {
    try {
      const statusRequest = this.statusRequestsRepository.findOne({
        where: {
          id,
        },
      });

      if (!statusRequest) {
        return new HttpException({
          message: 'Status Request not found',
          status: HttpStatus.NOT_FOUND,
        }, HttpStatus.NOT_FOUND);
      }

      return new HttpException({
        message: 'Status Request found',
        status: HttpStatus.OK,
        data: statusRequest,
      }, HttpStatus.OK);

    } catch (error) {
      return new HttpException({
        message: 'Error getting Status Request',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
