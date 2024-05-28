import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePutUserDto } from './dto/update-put-user.dto';
import { UpdatePatchUserDto } from './dto/update-patch-user.dto';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { UserEntity } from './entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async create(data: CreateUserDto) {
    if (
      await this.userRepository.exist({
        where: {
          email: data.email,
        },
      })
    ) {
      throw new BadRequestException('Email already exists');
    }
    data.password = await bcrypt.hash(data.password, await bcrypt.genSalt());
    const user = this.userRepository.create(data);
    this.userRepository.save(user);
  }

  async list() {
    return this.userRepository.find();
  }

  async readOne(id: number) {
    await this.exists(id);
    return this.userRepository.findOneBy({
      id,
    });
  }

  async update(
    id: number,
    { email, name, password, birthAt, role }: UpdatePutUserDto,
  ) {
    await this.exists(id);
    password = await bcrypt.hash(password, await bcrypt.genSalt());

    await this.userRepository.update(id, {
      email,
      name,
      password,
      birthAt: birthAt ? new Date(birthAt) : null,
      role,
    });

    return this.readOne(id);
  }

  async updatePartial(
    id: number,
    { email, name, password, birthAt, role }: UpdatePatchUserDto,
  ) {
    await this.exists(id);

    const data: any = {};

    if (birthAt) {
      data.birthAt = new Date(birthAt);
    }

    if (email) {
      data.email = email;
    }

    if (name) {
      data.name = name;
    }

    if (password) {
      data.password = await bcrypt.hash(password, await bcrypt.genSalt());
    }
    if (role) {
      data.role = role;
    }

    await this.userRepository.update(id, data);
    return this.readOne(id);
  }

  async delete(id: number) {
    await this.exists(id);

    return this.userRepository.delete(id);
  }

  async exists(id: number) {
    if (
      !(await this.userRepository.exists({
        where: {
          id,
        },
      }))
    ) {
      throw new NotFoundException('User not found');
    }
  }
}
