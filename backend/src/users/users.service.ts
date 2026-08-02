import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UploadsService } from '../uploads/uploads.service';
import { UploadFolder } from '../uploads/enums/upload-folder.enum';
import slugify from 'slugify';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly uploadsService: UploadsService,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { email: email.toLowerCase() },
    });
  }

  async findByEmailWithPassword(email: string): Promise<User | null> {
    return await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('LOWER(user.email) = LOWER(:email)', { email })
      .getOne();
  }

  async findById(id: string): Promise<User | null> {
    return await this.userRepository.findOneBy({ id });
  }

  async findByUsername(username: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { username: username.toLowerCase() },
    });
  }

  async findByGoogleId(googleId: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { googleId } });
  }

  async generateUniqueUsername(base: string): Promise<string> {
    let cleanBase = slugify(base, { lower: true, strict: true });
    if (!cleanBase || cleanBase.length < 3) {
      cleanBase = 'user';
    }
    cleanBase = cleanBase.slice(0, 30);

    let username = cleanBase;
    let count = 1;

    while (await this.findByUsername(username)) {
      const suffix = `${count}${Math.floor(100 + Math.random() * 900)}`;
      username = `${cleanBase.slice(0, 40)}-${suffix}`;
      count++;
    }

    return username;
  }

  async create(user: DeepPartial<User>): Promise<User> {
    const newUser = this.userRepository.create(user);
    return await this.userRepository.save(newUser);
  }

  async save(user: User): Promise<User> {
    return await this.userRepository.save(user);
  }

  async getAllUsers(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async deleteUser(id: string): Promise<User> {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException(`User with id:${id} not found`);
    return this.userRepository.remove(user);
  }

  async updateProfile(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException('User not found');

    if (
      dto.username &&
      dto.username.toLowerCase() !== user.username.toLowerCase()
    ) {
      const existingUser = await this.findByUsername(dto.username);
      if (existingUser && existingUser.id !== id) {
        throw new ConflictException('Username is already taken');
      }
    }

    Object.assign(user, dto);
    return this.userRepository.save(user);
  }

  async updateProfilePicture(
    id: string,
    file: Express.Multer.File,
  ): Promise<User> {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException('User not found');

    const filePath = await this.uploadsService.uploadSingle(
      file,
      UploadFolder.USERS,
    );

    if (user.profilePicture) {
      await this.uploadsService
        .deleteFile(user.profilePicture)
        .catch(() => null);
    }

    user.profilePicture = filePath;
    return await this.userRepository.save(user);
  }

  async updateCoverPicture(
    id: string,
    file: Express.Multer.File,
  ): Promise<User> {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException('User not found');

    const filePath = await this.uploadsService.uploadSingle(
      file,
      UploadFolder.USERS,
    );

    if (user.coverPicture) {
      await this.uploadsService.deleteFile(user.coverPicture).catch(() => null);
    }

    user.coverPicture = filePath;
    return await this.userRepository.save(user);
  }

  async verifyEmail(email: string): Promise<void> {
    const user = await this.findByEmail(email);
    if (!user) throw new NotFoundException('User not found');
    user.isEmailVerified = true;
    await this.userRepository.save(user);
  }

  async updateLastLogin(id: string): Promise<void> {
    await this.userRepository.update(id, { lastLoginAt: new Date() });
  }
}
