import { Injectable, NotFoundException } from '@nestjs/common';
import {
  FilterQuery,
  HydratedDocument,
  Model,
  UpdateQuery,
  Document,
} from 'mongoose';

@Injectable()
export abstract class BaseRepository<T extends Document> {
  constructor(protected readonly model: Model<T>) {}

  async findOne(entityFilterQuery: FilterQuery<T>): Promise<T | null> {
    const document = await this.model.findOne(entityFilterQuery).exec();
    if (!document) {
      throw new NotFoundException(
        `Document not found with id ${entityFilterQuery._id}`,
      );
    }

    return document;
  }

  async findAll(entityFilterQuery: FilterQuery<T>): Promise<T[]> {
    return this.model.find(entityFilterQuery).exec();
  }

  async create(createEntityData: Partial<T>): Promise<T> {
    const entity = new this.model(createEntityData);
    return (await entity.save()) as HydratedDocument<T>;
  }

  async findOneAndUpdate(
    entityFilterQuery: FilterQuery<T>,
    updateEntityData: UpdateQuery<Partial<T>>,
  ): Promise<T | null> {
    return this.model
      .findOneAndUpdate(entityFilterQuery, updateEntityData, {
        new: true,
      })
      .exec();
  }

  async deleteOne(entityFilterQuery: FilterQuery<T>): Promise<any> {
    return await this.model.deleteOne(entityFilterQuery).exec();
  }
}
