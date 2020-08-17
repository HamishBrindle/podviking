import { Form } from './Form';
import Order from '../Order';
import { FormBaseSchema } from '@/lib/types';
import { countries } from '@/constants.json';

/**
 * Canadian provinces
 *
 * TODO: Dynamic country/province selections
 *
 */
const [provinces] = countries
  .filter((country) => country.value === 'CANADA')
  .map((country) => country.provinces);

/**
 * Form structure representing the Order model
 */
export class OrderForm extends Form<Order> {

  public schema: FormBaseSchema = {
    ship_address: {
      type: 'group',
      label: 'Shipping Address',
      disabled: true,
      schema: {
        contact_name: {
          label: 'Contact Name',
          type: 'text',
          prependIcon: 'mdi-account',
          flex: 6,
          rules: [
            Form.rules.required(),
          ],
        },
        contact_phone: {
          label: 'Contact Phone',
          type: 'text',
          prependIcon: 'mdi-phone',
          flex: 6,
          rules: [
            Form.rules.required(),
          ],
        },
        contact_email: {
          label: 'Contact Email',
          type: 'email',
          prependIcon: 'mdi-at',
          flex: 6,
          rules: [
            Form.rules.required(),
          ],
        },
        facility_name: {
          label: 'Company Name',
          type: 'text',
          prependIcon: 'mdi-domain',
          flex: 6,
          rules: [
            Form.rules.required(),
          ],
        },
        city: {
          label: 'City',
          type: 'text',
          prependIcon: 'mdi-city',
          flex: 6,
          rules: [
            Form.rules.required(),
          ],
        },
        delivery_address: {
          label: 'Address',
          type: 'text',
          prependIcon: 'mdi-map-marker',
          flex: 6,
          rules: [
            Form.rules.required(),
          ],
        },
        postal: {
          label: 'Postal',
          type: 'text',
          prependIcon: 'mdi-mailbox-up-outline',
          flex: 6,
          rules: [
            Form.rules.required(),
          ],
        },
        province: {
          label: 'Province',
          type: 'select',
          items: provinces,
          prependIcon: 'mdi-map-marker',
          flex: 12,
          rules: [
            Form.rules.required(),
          ],
        },
        country: {
          label: 'Country',
          type: 'select',
          items: countries,
          prependIcon: 'mdi-map-marker',
          flex: 12,
          rules: [
            Form.rules.required(),
          ],
        },
        cost_center: {
          label: 'Cost Center #',
          prependIcon: 'mdi-domain',
          type: 'text',
          flex: 12,
        },
      },
    },
    bill_address: {
      type: 'group',
      label: 'Billing Address',
      disabled: true,
      schema: {
        contact_name: {
          label: 'Contact Name',
          type: 'text',
          prependIcon: 'mdi-account',
          flex: 6,
          rules: [
            Form.rules.required(),
          ],
        },
        contact_phone: {
          label: 'Contact Phone',
          type: 'text',
          prependIcon: 'mdi-phone',
          flex: 6,
          rules: [
            Form.rules.required(),
          ],
        },
        contact_email: {
          label: 'Contact Email',
          type: 'email',
          prependIcon: 'mdi-at',
          flex: 6,
          rules: [
            Form.rules.required(),
          ],
        },
        facility_name: {
          label: 'Company Name',
          type: 'text',
          prependIcon: 'mdi-domain',
          flex: 6,
          rules: [
            Form.rules.required(),
          ],
        },
        city: {
          label: 'City',
          type: 'text',
          prependIcon: 'mdi-city',
          flex: 6,
          rules: [
            Form.rules.required(),
          ],
        },
        delivery_address: {
          label: 'Address',
          type: 'text',
          prependIcon: 'mdi-map-marker',
          flex: 6,
          rules: [
            Form.rules.required(),
          ],
        },
        postal: {
          label: 'Postal',
          type: 'text',
          prependIcon: 'mdi-mailbox-up-outline',
          flex: 6,
          rules: [
            Form.rules.required(),
          ],
        },
        province: {
          label: 'Province',
          type: 'select',
          items: provinces,
          prependIcon: 'mdi-map-marker',
          flex: 12,
          rules: [
            Form.rules.required(),
          ],
        },
        country: {
          label: 'Country',
          type: 'select',
          items: countries,
          prependIcon: 'mdi-map-marker',
          flex: 12,
          rules: [
            Form.rules.required(),
          ],
        },
      },
    },
    order_detail: {
      type: 'group',
      key: 'OrderDetails',
      label: 'Order Details',
      flex: 12,
      schema: {
        priority: {
          label: 'Priority',
          type: 'select',
          items: [
            { text: 'Standard', value: 'standard' },
            { text: 'Rush', value: 'rush'},
            { text: 'Rush - Emergency', value: 'emergency'},
          ],
          prependIcon: 'mdi-truck-fast-outline',
          class: 'mb-4',
          flex: 6,
          rules: [
            Form.rules.required(),
          ],
        },
        delivery_instructions: {
          flex: 6,
          label: 'Delivery Instructions',
          type: 'textarea',
          prependIcon: 'mdi-playlist-edit',
        },
      },
    },
  };

  protected getDefault(field: string): string | number {
    switch (field) {
    case 'country': {
      return 'Canada';
    }
    case 'province': {
      return 'British Columbia';
    }
    default: {
      return '';
    }
    }
  }
}
