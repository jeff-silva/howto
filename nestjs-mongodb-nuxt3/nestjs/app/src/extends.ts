/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Injectable } from '@nestjs/common';
import {
  FilterQuery,
  HydratedDocument,
  Model,
  UpdateQuery,
  Document,
  QueryOptions,
} from 'mongoose';

@Injectable()
export abstract class BaseRepository<T extends Document> {
  constructor(protected readonly model: Model<T>) {}

  async findOne(
    entityFilterQuery: FilterQuery<T>,
    options?: QueryOptions,
  ): Promise<T | null> {
    const document = await this.model
      .findOne(entityFilterQuery, null, options)
      .exec();

    return document;
  }

  async findAll(entityFilterQuery: FilterQuery<T>): Promise<T[]> {
    return this.model.find(entityFilterQuery).exec();
  }

  async findPaginated(
    query: Record<string, any> = {},
  ): Promise<Record<string, any>> {
    query = {
      page: 1,
      per_page: 3,
      ...query,
    };

    const results = await this.model.countDocuments({}).exec();
    const pages = Math.ceil(results / query.per_page); // Cálculo correto de pages
    const skip = (query.page - 1) * query.per_page;
    const data = await this.model
      .find()
      .limit(query.per_page)
      .skip(skip)
      .exec();

    return { pagination: { results, pages }, data };
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
