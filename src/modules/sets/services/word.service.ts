import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Set } from '../entities/set.entity';
import { CreateWordDto } from '../dto/create.word.dto';
import { Word } from '../entities/word.entity';

@Injectable()
export class WordsService {
  constructor(
    @InjectRepository(Set)
    private readonly setsRepository: Repository<Set>,
    @InjectRepository(Word)
    private readonly wordsRepository: Repository<Word>,
  ) {}

  public async createOne(setId: number, input: CreateWordDto) {
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
}
