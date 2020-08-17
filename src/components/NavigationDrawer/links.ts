import { AppAbilities } from '@/lib/types';
import { Customer, User } from '@/models/internal';
import { Location } from 'vue-router';

const links: NavigationLink[] = [
  {
    title: 'Home',
    action: 'mdi-home',
    to: { name: 'home' },
    access: ['read', 'Report'],
  },
  {
    title: 'Reports',
    action: 'mdi-chart-tree',
    to: null,
    access: ['read', 'Report'],
    items: [
      {
        title: 'Order Summary',
        to: { name: 'order-summary' },
        action: 'mdi-table',
      },
      {
        title: 'EOC PPE Supply',
        to: { name: 'eoc-ppe-supply' },
        action: 'mdi-table',
      },
      {
        title: 'PPE Supply By Category',
        to: { name: 'ppe-supply-by-category' },
        action: 'mdi-table',
      },
      {
        title: 'PPE Supply By Sku',
        to: { name: 'ppe-supply-by-sku' },
        action: 'mdi-table',
      },
      {
        title: 'PHSA Order Calculation',
        to: { name: 'phsa-order-calculation' },
        action: 'mdi-table',
      },
    ],
  },
  {
    title: 'Sites',
    action: 'mdi-map-marker-multiple',
    to: null,
    access: ['read', Customer],
    items: [
      {
        title: 'View Sites',
        to: { name: 'customers-list' },
        action: 'mdi-format-list-bulleted-square',
      },
      {
        title: 'Create Site',
        to: { name: 'customers-create' },
        action: 'mdi-map-marker-plus',
      },
    ],
  },
  {
    title: 'Orders',
    to: null,
    action: 'mdi-cart',
    items: [
      {
        title: 'View Orders',
        to: { name: 'orders-list' },
        action: 'mdi-format-list-bulleted-square',
      },
      {
        title: 'Create Order',
        to: { name: 'orders-setup' },
        action: 'mdi-cart-plus',
      },
    ],
  },
  {
    title: 'Users',
    action: 'mdi-account-supervisor',
    to: { name: 'users-list' },
    access: ['manage', User],
  },
  {
    title: 'Settings',
    action: 'mdi-cog',
    to: { name: 'settings' },
    divider: true,
  },
  {
    title: 'Help',
    action: 'mdi-help-circle',
    to: null,
    items: [
      {
        title: 'User Manual',
        action: 'mdi-account-question',
        to: {
          name: 'docs-md',
          params: { doc: 'user-manual' },
        },
      },
    ],
  },
];

type NavigationLink = {
  title: string;
  action: string;
  to: Location | null;
  access?: AppAbilities;
  items?: Pick<NavigationLink, 'to'|'title'|'action'>[];
  divider?: boolean;
}

export default links;
