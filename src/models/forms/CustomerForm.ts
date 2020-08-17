import { Form } from './Form';
import Customer from '../Customer';
import { FormBaseSchema } from '@/lib/types';

/**
 * List of Canadian provinces
 */
const PROVINCES: Array<any> = [
  { text: 'Alberta', value: 'AB' },
  { text: 'British Columbia', value: 'BC' },
  { text: 'Manitoba', value: 'MB' },
  { text: 'New Brunswick', value: 'NB' },
  { text: 'Newfoundland and Labrador', value: 'NL' },
  { text: 'Nova Scotia', value: 'NS' },
  { text: 'Northwest Territories', value: 'NT' },
  { text: 'Nunavut', value: 'NU' },
  { text: 'Ontario', value: 'ON' },
  { text: 'Prince Edward Island', value: 'PE' },
  { text: 'Québec', value: 'QC' },
  { text: 'Saskatchewan', value: 'SK' },
  { text: 'Yukon', value: 'YT' },
];

/**
 * Form structure representing the Customer model
 */
export class CustomerForm extends Form<Customer> {

  public schema: FormBaseSchema = {
    name: {
      label: 'Name',
      type: 'text',
      prependIcon: 'mdi-form-textbox',
      rules: [
        Form.rules.required(),
        Form.rules.maxLength(50),
      ],
    },
    address: {
      label: 'Address',
      type: 'text',
      prependIcon: 'mdi-map-marker',
      rules: [
        Form.rules.required(),
      ],
    },
    city: {
      label: 'City',
      type: 'text',
      prependIcon: 'mdi-city',
      rules: [
        Form.rules.required(),
      ],
    },
    postal_zip: {
      label: 'Postal',
      type: 'text',
      prependIcon: 'mdi-mailbox-up-outline',
      rules: [
        Form.rules.required(),
      ],
    },
    phone: {
      label: 'Phone',
      type: 'text',
      prependIcon: 'mdi-phone',
      rules: [
        Form.rules.required(),
      ],
    },
    country: {
      label: 'Country',
      type: 'text',
      prependIcon: 'mdi-map-marker',
      rules: [
        Form.rules.required(),
      ],
    },
    prov_state: {
      label: 'Province',
      type: 'select',
      items: PROVINCES,
      prependIcon: 'mdi-map-marker',
      rules: [
        Form.rules.required(),
      ],
    },
    contact: {
      label: 'Contact',
      type: 'text',
      prependIcon: 'mdi-account',
      rules: [
        Form.rules.required(),
      ],
    },
    contact_email: {
      label: 'Contact Email',
      type: 'text',
      prependIcon: 'mdi-email',
      rules: [
        Form.rules.required(),
      ],
    },
    contact_phone: {
      label: 'Contact Phone',
      type: 'text',
      prependIcon: 'mdi-phone',
      rules: [
        Form.rules.required(),
      ],
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
