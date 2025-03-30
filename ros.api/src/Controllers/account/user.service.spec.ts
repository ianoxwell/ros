import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';
import { MailService } from '@services/mail/mail.service';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { IRegisterUser } from './models/register-user.dto';

const mockUserRepository = {
  save: jest.fn().mockResolvedValue({ id: 1, givenNames: 'John', familyName: 'Doe', verificationToken: '123Token' }),
  find: jest.fn(),
  findOne: jest.fn().mockResolvedValue(null),
  delete: jest.fn()
};

describe('UserService', () => {
  let service: UserService;
  let repo: Repository<User>;
  let mailServiceSpy: MailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
        { provide: MailService, useValue: { sendRegistrationEmail: jest.fn().mockResolvedValue(true) } },
        { provide: JwtService, useValue: { sign: jest.fn().mockResolvedValue('mockJwtToken') } }
      ]
    }).compile();

    service = module.get<UserService>(UserService);
    repo = module.get<Repository<User>>(getRepositoryToken(User));
    mailServiceSpy = module.get<MailService>(MailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should create a user', async () => {
    const user = await service.registerUser(
      {
        givenNames: 'John',
        familyName: 'Doe',
        email: 'john@example.com',
        password: '123JohnTestDoePassword',
        photoUrl: [],
        loginProvider: 'ros'
      } as IRegisterUser,
      'http://localTesting.co'
    );
    expect(user).toBeDefined();
    expect(mailServiceSpy.sendRegistrationEmail).toHaveBeenCalled();
    expect((user as User).id).toBeDefined();
  });

  // it('should find all users', async () => {
  //   const users = await service.findAll();
  //   expect(users.length).toBeGreaterThan(0);
  // });
});
