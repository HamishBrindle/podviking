import { BaseModel } from '@/models/internal';
import { OrmModel, AttrField, PrimaryKey } from 'vuex-orm-decorators';

@OrmModel('orders_items')
export class OrderItem extends BaseModel {
  /**
   * Model name (used for CASL subject detection)
   */
  static get modelName() {
    return 'OrderItem';
  }

  @PrimaryKey('sku_id')
  @AttrField()
  order_id!: string | number;

  @AttrField()
  sku_id!: string | number;
}

export default OrderItem;
