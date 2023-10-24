import * as bcrypt from 'bcryptjs';
import {Injectable, UnauthorizedException, UnprocessableEntityException} from '@nestjs/common';
import {CreateUserDto} from "./dto/create-user.dto";
import {UsersRepository} from "./users.repository";
import {GetUserDto} from "./dto/get-user.dto";

@Injectable()
export class UsersService {
    constructor(private readonly usersRepository: UsersRepository) {
    }

    async create(createUserDro: CreateUserDto) {
        await this.validateCreateUserDto(createUserDro)
        return this.usersRepository.create({
            ...createUserDro,
            password: await bcrypt.hash(createUserDro.password, 10)
        });
    }

    private async validateCreateUserDto(createUserDto: CreateUserDto) {
        try {
            await this.usersRepository.findOne({email: createUserDto.email})
        } catch (err) {
            return;
        }
        throw new UnprocessableEntityException('Email already exists.')
    }

    async verifyUser(email: string, password: string) {
        const user = await this.usersRepository.findOne({email});
        const passwordIsValid = await bcrypt.compare(password, user.password);
        if (!passwordIsValid) {
            throw new UnauthorizedException(`Credential aren't valid`)
        }
        return user;
    }

    async getUser(getUserDto: GetUserDto) {
        return this.usersRepository.findOne(getUserDto)
    }
}
