import { Order, Customer, User } from '@/models/internal';
import { Ability, AbilityClass } from '@casl/ability';

export type OrderAbilities = [
  |'create'
  |'read'
  |'update'
  |'manage'
  |'manage_part_a'
  // |'manage_part_b'
  |'manage_part_c'
  |'review'
  |'approve'
  |'approve_part_a'
  // |'approve_part_b'
  |'approve_part_c',
  Order | typeof Order
];

export type CustomerAbilities = [
  |'create'
  |'read'
  |'update'
  |'manage'
  |'approve',
  Customer | typeof Customer
];

export type UserAbilities = [
  |'manage'
  |'order_for',
  User | typeof User
];

export type ReportAbilities = [
  |'create'
  |'read'
  |'update'
  |'manage',
  'Report'
];

export type AllAbilities = [
  |'create'
  |'read'
  |'update'
  |'manage'
  |'approve',
  'all'
];

export type AppAbilities =
  | OrderAbilities
  | CustomerAbilities
  | UserAbilities
  | ReportAbilities
  | AllAbilities;

export type AppAbility = Ability<AppAbilities>;
export const AppAbility = Ability as AbilityClass<AppAbility>;
