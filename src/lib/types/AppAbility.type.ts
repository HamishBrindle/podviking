import { User } from '@/models/internal';
import { Ability, AbilityClass } from '@casl/ability';

export type AllAbilities = [
  |'create'
  |'read'
  |'update'
  |'manage'
  |'approve',
  'all'
];

export type UserAbilities = [
  |'manage',
  User | typeof User
];

export type AppAbilities =
  | AllAbilities
  | UserAbilities;

export type AppAbility = Ability<AppAbilities>;
export const AppAbility = Ability as AbilityClass<AppAbility>;
