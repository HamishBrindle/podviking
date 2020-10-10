import { AppAbility } from '@/lib/types';
import { Auth } from '@/models/internal';
import { defineAbility as caslDefineAbility } from '@casl/ability';

/**
 * Define a User's abilities via their roles on the Auth
 * object
 * @param auth
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function ability(auth: Auth) {
  return caslDefineAbility<AppAbility>((can) => {
    can('manage', 'all');
  });
}
