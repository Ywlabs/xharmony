import { EntityRepository } from 'nestjs-typeorm-custom-repository';
import { Repository } from 'typeorm';
import { Users } from './entities/users.entity';
import { CreateUsersDto } from './dto/users.dto';

@EntityRepository(Users)
export class CustomUsersRepository extends Repository<Users> {
    //사용자 생성
    async createUsers(createUsersDto: CreateUsersDto): Promise<Users> {
        const { userid,
            username,
            password,
            email } = createUsersDto;

        const users = this.create({userid,username,password,email})
        
        await this.save(users);
        return users;
    }
}

