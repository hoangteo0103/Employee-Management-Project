import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import mongoose from 'mongoose';
import { async } from 'rxjs';
import { User, UserDocument } from './schemas/user.schema';
import { UsersController } from './users.controller';
import { UsersModule } from './users.module';
import { UsersService } from './users.service';
describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot('mongodb://127.0.0.1:27017'),
        UsersModule,
      ],
    })
      .overrideProvider(UsersService)
      .useValue(usersService)
      .compile();

    usersService = module.get<UsersService>(UsersService);
    usersController = module.get<UsersController>(UsersController);
  });

  describe('findEmployee', () => {
    it('should return employee by id', async () => {
      const result = {
        Skills: [],
        __v: 0,
        contactNumber: '123213213',
        dateOfBirth: new Date('2222-03-01T00:00:00.000Z'),
        department: 'Human Resource',
        designation: 'Accounts Manager',
        email: 'buinguyenhoang0103@gmail.com',
        name: 'Bùi Nguyên Hoàng',
        password:
          '$argon2id$v=19$m=65536,t=3,p=4$H3hpItjhpD7x3V2hBMD65g$YfrUhJsRbbv+hkt/vtoRof8R73Iofc3OSFxSnQCE0Ic',
        role: 'employee',
        username: 'buinguyenhoang',
      };
      let employee = await (
        await usersService.findById('63f5deeb11e92a69941c7639')
      ).toObject();
      delete employee._id;
      expect(employee).toStrictEqual(result);
    });
    it('should return employee by username', async () => {
      const result = {
        Skills: [],
        __v: 0,
        contactNumber: '123213213',
        dateOfBirth: new Date('2222-03-01T00:00:00.000Z'),
        department: 'Human Resource',
        designation: 'Accounts Manager',
        email: 'buinguyenhoang0103@gmail.com',
        name: 'Bùi Nguyên Hoàng',
        password:
          '$argon2id$v=19$m=65536,t=3,p=4$H3hpItjhpD7x3V2hBMD65g$YfrUhJsRbbv+hkt/vtoRof8R73Iofc3OSFxSnQCE0Ic',
        role: 'employee',
        username: 'buinguyenhoang',
      };
      let employee = await (
        await usersService.findByUsername('buinguyenhoang')
      ).toObject();
      delete employee._id;
      expect(employee).toContain(result);
    });
  });
});
