import { defineAbility as caslDefineAbility } from '@casl/ability';
import { Order, Customer, User, Auth } from '@/models/internal';
import { OrderStatus, ApprovalStatus } from '@/lib/enum';
import { AppAbility } from '@/lib/types';

/**
 * Define a User's abilities via their roles on the Auth
 * object
 * @param auth
 */
export default function defineAbility(auth: Auth) {
  return caslDefineAbility<AppAbility>((can, cannot) => {
    // Default application abilities
    can('manage_part_a', Order);
    // can('manage_part_b', Order);
    can('manage_part_c', Order);

    auth.roles.forEach((role: string) => {
      switch (role) {
      // admin & project_admin are interchangeable roles currently
      case 'admin':
      case 'project_admin': {
        can('manage', 'all');
        break;
      }
      case 'site_user': {
        can('read', Customer);
        can(['read', 'create'], Order);
        break;
      }
      case 'contract_advisor': {
        can(['read', 'create'], Order);
        can(['update', 'review'], Order, {
          status: OrderStatus.Submitted,
        });
        can('order_for', User);
        break;
      }
      case 'helpdesk': {
        can('manage', Customer);
        can(['read', 'create'], Order);
        can(['update', 'approve'], Order, {
          status: OrderStatus.Reviewed,
        });
        can('read', 'Report');
        can('order_for', User);
        break;
      }
      case 'professional_practice': {
        can('read', Order);
        can('update', Order, {
          status: OrderStatus.Approved,
          'approvals.part_a': ApprovalStatus.Pending,
          'section_counts': {
            $elemMatch: {
              name: 'part_a',
              total_units: { $gt: 0 },
            },
          },
        });
        can('approve_part_a', Order, {
          status: OrderStatus.Approved,
          'section_counts': {
            $elemMatch: {
              name: 'part_a',
              total_units: { $gt: 0 },
            },
          },
        });
        // Hybrid helpdesk/PP role should be able to approve
        // and approve_part_a in same step
        // (ie. approve_part_a from 'reviewed' order status)
        if (auth.roles.includes('helpdesk')) {
          can('update', Order, {
            status: {
              $in: [
                OrderStatus.Reviewed,
                OrderStatus.Approved,
              ],
            },
            'approvals.part_a': ApprovalStatus.Pending,
            'section_counts': {
              $elemMatch: {
                name: 'part_a',
                total_units: { $gt: 0 },
              },
            },
          });
          can ('approve_part_a', Order, {
            status: {
              $in: [
                OrderStatus.Reviewed,
                OrderStatus.Approved,
              ],
            },
            'section_counts': {
              $elemMatch: {
                name: 'part_a',
                total_units: { $gt: 0 },
              },
            },
          });
        }
        can('read', 'Report');
        can('order_for', User);
        break;
      }
      // case 'swab_lead': {
      //   can('read', Order);
      //   can('update', Order, {
      //     status: OrderStatus.Approved,
      //     'approvals.part_b': ApprovalStatus.Pending,
      //     'section_counts': {
      //       $elemMatch: {
      //         name: 'part_b',
      //         total_units: { $gt: 0 },
      //       },
      //     },
      //   });
      //   can('approve_part_b', Order, {
      //     status: OrderStatus.Approved,
      //     'section_counts': {
      //       $elemMatch: {
      //         name: 'part_b',
      //         total_units: { $gt: 0 },
      //       },
      //     },
      //   });
      //   break;
      // }
      case 'occ_health_lead': {
        can('read', Order);
        can('update', Order, {
          status: OrderStatus.Approved,
          'approvals.part_c': ApprovalStatus.Pending,
          'section_counts': {
            $elemMatch: {
              name: 'part_c',
              total_units: { $gt: 0 },
            },
          },
        });
        can('approve_part_c', Order, {
          status: OrderStatus.Approved,
          'section_counts': {
            $elemMatch: {
              name: 'part_c',
              total_units: { $gt: 0 },
            },
          },
        });
        break;
      }
      case 'management': {
        can('read', Order);
        can('read', 'Report');
        break;
      }
      case 'finance': {
        can('read', Order);
        can('read', 'Report');
        break;
      }
      default: {
        break;
      }
      }
    });

    /**
     * Final-Say abilities
     */
    cannot('review', Order, {
      status: { $ne: OrderStatus.Submitted },
    });

    cannot('approve', Order, {
      status: { $ne: OrderStatus.Reviewed },
    });

    cannot([
      'approve_part_a',
      // 'approve_part_b',
      'approve_part_c',
    ], Order, {
      status: {
        $nin: [
          OrderStatus.Reviewed,
          OrderStatus.Approved,
        ],
      },
    });

    // Cannot approve/deny Order parts A-C when already denied
    cannot('approve_part_a', Order, {
      'approvals.part_a': {
        $in: [
          ApprovalStatus.Denied,
          ApprovalStatus.Approved,
        ],
      },
    });
    // cannot('approve_part_b', Order, {
    //   'approvals.part_b': {
    //     $in: [
    //       ApprovalStatus.Denied,
    //       ApprovalStatus.Approved,
    //     ],
    //   },
    // });
    cannot('approve_part_c', Order, {
      'approvals.part_c': {
        $in: [
          ApprovalStatus.Denied,
          ApprovalStatus.Approved,
        ],
      },
    });

    cannot([
      'approve',
      'approve_part_a',
      // 'approve_part_b',
      'approve_part_c',
      'update',
    ], Order, {
      status: {
        $in: [
          OrderStatus.Denied,
          OrderStatus.Complete,
        ],
      },
    });

    // Only allow approvals for 'pending' Customer
    cannot('approve', Customer, {
      approval_status: {
        $in: [
          ApprovalStatus.Approved,
          ApprovalStatus.Denied,
          ApprovalStatus.NotSet,
        ],
      },
    });
  });
}
