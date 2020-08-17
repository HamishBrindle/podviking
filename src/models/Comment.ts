import { BaseModel } from '@/models/internal';
import { AttrField, StringField, OrmModel, PrimaryKey, BelongsToField } from 'vuex-orm-decorators';
import User from './User';

@OrmModel('comments')
export class Comment extends BaseModel {
  /**
   * Model name (used for CASL subject detection)
   */
  static get modelName() {
    return 'Comment';
  }

  /**
   * Unique identifier of the Comment
   */
  @PrimaryKey()
  @AttrField()
  public id!: number;

  /**
   * Unique identifier of the User this comment belongs to
   */
  @AttrField()
  public author_id!: number;

  /**
   * Datetime Comment was created
   *
   * Warning: this field defaults to a brand new Date string if not provided
   */
  @StringField()
  public created_at!: string;

  /**
   * A Comment's content text
   */
  @StringField()
  public body!: string;

  /**
   * User record associated with this comment
   */
  @BelongsToField(User, 'author_id', 'id')
  public author?: User;
}

export default Comment;
