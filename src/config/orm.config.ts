import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from 'src/modules/auth/entities/user.entity';
import { Access } from 'src/modules/accesses/entities/access.entity';
import { Set } from 'src/modules/sets/entities/set.entity';
import { Word } from 'src/modules/sets/entities/word.entity';
import { UserWordLvl } from 'src/modules/sets/entities/userWordLvl.entity';

export default registerAs(
  'orm.config',
  (): TypeOrmModuleOptions => ({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [User, Set, Access, Word, UserWordLvl],
    synchronize: false,
  }),
);
