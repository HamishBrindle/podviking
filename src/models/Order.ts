import { AttrField, OrmModel, PrimaryKey, BelongsToManyField, HasManyByField, BelongsToField } from 'vuex-orm-decorators';
import { ApprovalStatus, OrderStatus } from '@/lib/enum';
import { Collection, Maybe } from '@/lib/types';
import { BaseModel, OrderItem, Sku, Comment, Customer } from '@/models/internal';
import { ShippingAddress, BillingAddress } from '@/lib/types/Address.type';
import { ICommentable } from '@/lib/interfaces/Commentable.interface';

/**
 * Default values for initializing the ShippingAddress
 * object in the instance
 */
const rootShippingAddress: ShippingAddress = {
  facility_name: '',
  city: '',
  delivery_address: '',
  postal: '',
  country: 'CAN',
  province: 'BC',
  contact_name: '',
  contact_phone: '',
  contact_email: '',
  cost_center: '',
};

/**
 * Default values for initializing the BillingAddress
 * object in the instance
 */
const rootBillingAddress: BillingAddress = {
  facility_name: '',
  city: '',
  delivery_address: '',
  postal: '',
  country: 'CAN',
  province: 'BC',
  contact_name: '',
  contact_phone: '',
  contact_email: '',
};

/**
 * Default values for initializing the OrderDetails
 * object in the instance
 */
const rootOrderDetails: OrderDetails = {
  date: new Date().toISOString(),
  delivery_instructions: '',
  priority: 'standard',
};

/**
 * Default status' for the various sections of a
 * Order form
 */
const rootApprovals: OrderApprovals = {
  'info': ApprovalStatus.Pending,
  'part_a': ApprovalStatus.Pending,
  // 'part_b': ApprovalStatus.Pending,
  'part_c': ApprovalStatus.Pending,
};

@OrmModel('orders')
export class Order extends BaseModel implements ICommentable {
  /**
   * Model name (used for CASL subject detection)
   */
  static get modelName() {
    return 'Order';
  }

  /**
   * Unique identifier for the Order
   */
  @PrimaryKey()
  @AttrField()
  public id!: number;

  /**
   * Array of Comment id's
   */
  @AttrField([])
  public comment_ids!: number[];

  /**
   * Customer id associated to the order
   */
  @AttrField(null)
  public customer_id!: number;

  /**
   * Email of the submitter
   */
  @AttrField(null)
  public submitters_email!: Maybe<string>;

  /**
   * An array of JSON objects detailing the previous states
   * of the Order form
   */
  @AttrField()
  public previous_form_states!: Array<any>;

  /**
   * A notes field showing the most
   */
  @AttrField('')
  public notes!: string;

  /**
   * The Order's status according to the back end
   */
  @AttrField(null)
  public status!: OrderStatus

  /**
   * Approvals object indicating which portion of the Order
   * has been approved/denied
   */
  @AttrField(rootApprovals)
  public approvals!: OrderApprovals;

  /**
   * Shipping address information
   */
  @AttrField(rootShippingAddress)
  public ship_address!: ShippingAddress;

  /**
   * Billing address information
   */
  @AttrField(rootBillingAddress)
  public bill_address!: BillingAddress;

  /**
   * Order details
   */
  @AttrField(rootOrderDetails)
  public order_detail!: OrderDetails;

  /**
   * Creation timestamp
   */
  @AttrField(null)
  public created_at!: string;

  /**
   * Updated timestamp
   */
  @AttrField(null)
  public updated_at!: string;

  /**
   * Top level summary of which items are currently present in this order
   */
  @AttrField([])
  public section_counts!: SectionCount[];

  /**
   * Comments made on an Order
   */
  @HasManyByField(Comment, 'comment_ids')
  public comments!: Collection<Comment>;

  /**
   * Skus existing on an Order
   */
  @BelongsToManyField(Sku, OrderItem, 'order_id', 'sku_id', 'id', 'sku')
  public order_items!: Collection<Sku>;

  /**
   * Customer that the order is placed for
   * (Optional since certain roles allow manual customer info entry)
   */
  @BelongsToField(Customer, 'customer_id')
  public customer?: Customer;
}

/**
 * Order Details type
 */
export type OrderDetails = {
  date: string;
  priority: 'standard' | 'rush' | 'emergency';
  delivery_instructions: string;
}

/**
 * Mapping of various approval status' for sections of
 * a Order form
 */
export type OrderApprovals = {
  [section: string]: ApprovalStatus;
}

/**
 * Total item quantity for a given section
 */
export type SectionCount = {
  name: string;
  total_units: number;
}

export default Order;
