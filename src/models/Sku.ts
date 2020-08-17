import { BaseModel } from '@/models/internal';
import { AttrField, StringField, OrmModel, PrimaryKey, NumberField } from 'vuex-orm-decorators';
import { Maybe } from '@/lib/types';

@OrmModel('skus')
export class Sku extends BaseModel {
  /**
   * Model name (used for CASL subject detection)
   */
  static get modelName() {
    return 'Sku';
  }

  /**
   * Unique identifier for the SKU
   *
   * TODO: Change backend to accept `id` rather than `sku`
   */
  @PrimaryKey()
  @AttrField()
  public sku!: string;

  /**
   * SKUs parent category
   */
  @StringField()
  public category!: string;

  /**
   * PeopleSoft ID
   */
  @AttrField(null)
  public peoplesoft?: Maybe<string>;

  /**
   * Meditech ID
   */
  @AttrField(null)
  public meditech?: Maybe<string>;

  /**
   * Quantity of Product
   *
   * TODO: Move this out (OrderProduct), it's got nothing to do with model
   */
  @NumberField(0)
  public quantity!: number;

  /**
   * Maximum quantity available for this Product
   *
   * TODO: Move this out (Inventory), it's got nothing to do with model
   */
  @AttrField(Infinity)
  public max_quantity!: number | string;

  /**
   * Unit of measurement type
   */
  @StringField()
  public unit_of_measure_type!: string;

  /**
   * Unit of measurement size
   */
  @StringField()
  public unit_of_measure_size!: string;

  /**
   * Description strings
   */
  @AttrField([])
  public description!: Array<string>;

  /**
   * Form section this SKU belongs to
   */
  @StringField()
  public form_section!: 'part_a' | 'part_c';

  /**
   * Src for image
   */
  @StringField()
  public image?: string;
}

export default Sku;
