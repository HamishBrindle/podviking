import { BaseModel } from '@/models/internal';
import { AttrField, StringField, OrmModel, PrimaryKey } from 'vuex-orm-decorators';
import { ApprovalStatus } from '@/lib/enum/Status.enum';

@OrmModel('customers')
export class Customer extends BaseModel {
  /**
   * Model name (used for CASL subject detection)
   */
  static get modelName() {
    return 'Customer';
  }

  /**
   * Unique identifier for the Customer
   */
  @PrimaryKey()
  @AttrField(undefined)
  public id!: number;

  /**
   * Customer shipping address
   */
  @StringField()
  public address!: string;

  /**
   * Customer address city
   */
  @StringField()
  public city!: string;

  /**
   * Customer contact's email
   */
  @StringField()
  public contact_email!: string;

  /**
   * Customer contact's phone number
   */
  @StringField()
  public contact_phone!: string;

  /**
   * Customer contact's name
   */
  @StringField()
  public contact!: string;

  /**
   * Customer address country
   */
  @StringField()
  public country!: string;

  /**
   * Customer's first custom field (Custom1)
   */
  @AttrField()
  public approval_status!: ApprovalStatus;

  /**
   * Customer's second custom field (Custom2)
   */
  @AttrField()
  public site_requester!: string;

  /**
   * Customer name
   */
  @StringField()
  public name!: string;

  /**
   * Customer's phone number
   */
  @StringField()
  public phone!: string;

  /**
   * Customer address postal/zip
   */
  @StringField()
  public postal_zip!: string;

  /**
   * Customer address province/state
   */
  @StringField()
  public prov_state!: string;

  /**
   * Customer distribution channel
   */
  @StringField()
  public dist_channel!: string;

  /**
   * Customer cost center
   */
  @StringField()
  public cost_center!: string;

  /**
   * Customer bill-to address
   */
  @StringField()
  public bt_address!: string;

  /**
   * Customer bill-to address city
   */
  @StringField()
  public bt_city!: string;

  /**
   * Customer bill-to contact's name
   */
  @StringField()
  public bt_contact!: string;

  /**
   * Customer bill-to address country
   */
  @StringField()
  public bt_country!: string;

  /**
   * Customer bill-to contact's email
   */
  @StringField()
  public bt_email!: string;

  /**
   * Customer bill-to contact's fax number
   */
  @StringField()
  public bt_fax!: string;

  /**
   * Customer bill-to (facility) name
   */
  @StringField()
  public bt_name!: string;

  /**
   * Customer bill-to contact's phone number
   */
  @StringField()
  public bt_phone!: string;

  /**
   * Customer bill-to address postal/zip code
   */
  @StringField()
  public bt_postal_zip!: string;

  /**
   * Customer bill-to address province/state
   */
  @StringField()
  public bt_prov_state!: string;

  /**
   * Customer bill-to website
   */
  @StringField()
  public bt_web!: string;

  /**
   * Customer bill-to fields are the same as shipping
   */
  @AttrField(null)
  public btsame!: boolean;

  /**
   * Customer is a credit-hold
   */
  @AttrField(null)
  public on_credit_hold!: boolean;

  /**
   * Customer general notes
   */
  @StringField()
  public general_notes!: string;

  /*
  TODO: Redefine the Customer fields. Example:
  address: "1025 ELCHO STREET"
  allocation_lock: null
  archive_ord_units: null
  archive_ord_value: null
  archive_orders: null
  archive_ret_units: null
  archive_returns: null
  bt_address: "1025 ELCHO STREET"
  bt_city: "BELLA COOLA"
  bt_contact: "SARA CAMANO"
  bt_country: "CANADA"
  bt_email: "Sara.camano@podviking.ca, Samir.Prinja@podviking.ca"
  bt_fax: "604 730 0190"
  bt_name: "BELLA COOLA GENERAL HOSPITAL"
  bt_phone: "250-799-5311"
  bt_postal_zip: "V0T1C0"
  bt_prov_state: "BC"
  bt_web: null
  btsame: true
  city: "BELLA COOLA"
  collect_details: null
  contact: "PAULA REALE"
  country: "CANADA"
  cust_password: null
  cust_userid: null
  cust_username: null
  custom1: null
  custom2: null
  customer_rating: null
  default_discount_pctg: null
  default_freight_tax: "0"
  default_order_tax: "0"
  default_order_terms: "HR"
  default_pricelist: "---"
  default_shipping_terms: "RATE SHOP"
  dist_channel: "LTCAL"
  email: "Samir.Prinja@podviking.ca"
  enable_cust_login: null
  external_cust_acctid: "HSDA NSCG"
  external_sales_acctid: "HA"
  external_territoryid: null
  factor_fee: "0"
  factor_name: null
  factor_note: null
  factor_pctg: "0"
  fax: "604 730 0190"
  general_notes: "LTC"
  geocode_accuracy: null
  geocode_latitude: null
  geocode_longitude: null
  id: "85"
  integration_exclude_order_file: "0"
  name: "BELLA COOLA GENERAL HOSPITAL"
  newid: "85"
  on_credit_hold: false
  order_credit_limit: null
  phone: "250-799-5311"
  postal_zip: "V0T1C0"
  prov_state: "BC"
  qbo_custid: null
  qbo_custom_mapping: null
  ra_contact: null
  ra_cust_type: null
  ra_notify: null
  release_type: null
  rep_name: "LTCAL"
  rtlr_code: "BELLA COOLA GENERAL HOSPITAL - V0T1C0"
  rtlr_id: null
  rtlr_pwd: null
  shipping_instructions: ""
  tag_array: null
  tax_details: null
  user_access: ":4626"
  warehouse_instructions: ""
  web: null
  wh_assoc: ":0001"
  */
}

export default Customer;
