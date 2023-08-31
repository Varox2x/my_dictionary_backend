import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Set } from '../entities/set.entity';
import { CreateWordDto } from '../dto/create.word.dto';
import { Word } from '../entities/word.entity';
import { UserWordLvl } from '../entities/userWordLvl.entity';
import { User } from 'src/modules/auth/entities/user.entity';
import { PaginateOptions, paginate } from 'src/common/helpers/paginator';
import { UpdateWordDto } from '../dto/update-word.dto';

@Injectable()
export class WordsService {
  constructor(
    @InjectRepository(Set)
    private readonly setsRepository: Repository<Set>,
    @InjectRepository(Word)
    private readonly wordsRepository: Repository<Word>,
    @InjectRepository(UserWordLvl)
    private readonly UserWordsLvlRepository: Repository<UserWordLvl>,
  ) {}

  public async bulkWordUpdate(input, setId) {
    console.log('input');
    console.log(input);
    console.log('setId');
    console.log(setId);

    //to improve
  }

  public async wordUpdate(wordId: number, setId: number, input: UpdateWordDto) {
    const query = await this.wordsRepository
      .createQueryBuilder()
      .update(Word)
      .set(input)
      .where({ id: wordId, set: { id: setId } })
      .execute();

    if (query.affected == 0)
      throw new BadRequestException('Filed while updating');
  }

  public async updateUserWordsLvl(input, setId: number, user: User) {
    // this endpoint updates (or creates if doesnt exist) lvl for userId and wordId

    const insertArray = input.map(({ id, lvl }) => {
      return { user, word: { id }, lvl };
    });

    try {
      const queryBuilder =
        await this.UserWordsLvlRepository.createQueryBuilder()
          .insert()
          .into(UserWordLvl)
          .values(insertArray)
          .onConflict(
            `("userId", "wordId") DO UPDATE SET "lvl" = EXCLUDED."lvl"`,
          )
          .execute();
    } catch (e) {
      throw new Error(e);
    }

    return;
  }

  public async createOne(setId: number, input) {
    console.log('input');
    console.log(input);
    const set = await this.setsRepository.findOne({ where: { id: setId } });
    if (!set) throw new BadRequestException("Set with this id doesn't exist");
    const sourceQuery = await this.wordsRepository.save({
      ...input,
      set: { id: setId },
    });

    return {
      definition: sourceQuery.definition,
      name: sourceQuery.name,
      id: sourceQuery.id,
      setId: sourceQuery.set.id,
    };
  }

  //must implement access walidation
  public async remove(wordId: number) {
    return await this.wordsRepository
      .createQueryBuilder('word')
      .delete()
      .where('id = :id', { id: wordId })
      .execute();
  }

  public async getSetWords(
    setId: number,
    user: User,
    paginateOptions: PaginateOptions,
  ) {
    const sourceQuery = await this.wordsRepository
      .createQueryBuilder('word')
      .where('word.setId = :setId', { setId })
      .leftJoinAndMapOne(
        'word.userWordLvl',
        UserWordLvl,
        'userWordLvl',
        'userWordLvl.wordId = word.id and userWordLvl.userId = :userId',
        { userId: user.id },
      );

    return paginate<Word>(sourceQuery, paginateOptions);
  }
}
