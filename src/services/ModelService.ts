import { BaseModel } from '@/models/BaseModel';
import {
  Create, Insert, InsertOrUpdate, UpdateObject,
} from '@vuex-orm/core/lib/modules/payloads/Actions';
import {
  Collection, Collections, InstanceOf, Item, Query,
} from '@vuex-orm/core';
import { ApiService } from './ApiService';

export abstract class ModelService<T extends typeof BaseModel> {
  /**
   * Model that this service deals with
   */
  protected abstract readonly model: T;

  /**
   * Model-specific path appended to the API endpoint. Must start
   * with a "/".
   */
  protected abstract readonly path: ((args: any) => string) | string | null;

  /**
   * Service for making requests to the API
   */
  protected readonly apiService: ApiService = ApiService.getInstance();

  /**
   * Create model record(s) and return list of records created, including
   * through associations, and also clearing out existing records of this
   * type
   * @param payload Args
   */
  public create(payload: Create): Promise<Collections> {
    return this.model.create(payload);
  }

  /**
   * Update model record(s) and return list of records updated, including
   * through associations
   * @param payload Args
   */
  public update(payload: UpdateObject): Promise<Collections> {
    return this.model.update(payload);
  }

  /**
   * Insert model record(s) and return list of records inserted, including
   * through associations
   * @param payload Args
   */
  public insert(payload: Insert): Promise<Collections> {
    return this.model.insert(payload);
  }

  /**
   * Insert or update model record(s) and return list of records inserted and/or
   * updated, including through associations
   * @param payload Args
   */
  public insertOrUpdate(payload: InsertOrUpdate): Promise<Collections> {
    return this.model.insertOrUpdate(payload);
  }

  /**
   * Search ORM for single record
   * @param options
   */
  public find(options: string | number | (string | number)[]): Item<InstanceOf<T>> {
    return this.model.find(options);
  }

  /**
   * Search ORM for multiple records
   * @param options
   */
  public findIn(options: (string | number | (string | number)[])[]): Collection<InstanceOf<T>> {
    return this.model.findIn(options);
  }

  /**
   * Retrieve all records from ORM
   */
  public all(): Collection<InstanceOf<T>> {
    return this.model.all();
  }

  /**
   * Return a query builder for searching the ORM
   */
  public query(): Query<InstanceOf<T>> {
    return this.model.query();
  }

  /**
   * Model's API wrapper
   */
  public abstract api: any;
}

export default ModelService;
