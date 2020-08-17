import { BaseModel } from '@/models/internal';

/**
 * Item type can be the type of its parameter (extends from BaseModel)
 * or can be null
 */
export type Item<M extends BaseModel = BaseModel> = M | null;
