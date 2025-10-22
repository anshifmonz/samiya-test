'use client';

import Link from 'next/link';
import { Card } from 'ui/card';
import { LayoutDashboard, History, Globe, Package, Gift, Users } from 'lucide-react';
import { useCurrentAdmin } from 'hooks/admin/useCurrentAdmin';

const navigationItems = [
  {
    icon: LayoutDashboard,
    label: 'Inventory',
    description: 'Overview of the store',
    href: '/admin/inventory',
    superadmin: false
  },
  {
    icon: Package,
    label: 'Order Management',
    description: 'Manage orders placed in the store',
    href: '/admin/orders',
    superadmin: true
  },
  {
    icon: Gift,
    label: 'Coupon Management',
    description: 'Manage Coupons and Discounts',
    href: '/admin/coupons',
    superadmin: true
  },
  {
    icon: History,
    label: 'Activity Logs',
    description: 'View user and system activities',
    href: '/admin/activity-logs',
    superadmin: true
  },
  {
    icon: Globe,
    label: 'IP Logs',
    description: 'Track IP addresses accessing the store',
    href: '/admin/activity-logs/ip',
    superadmin: true
  },
  {
    icon: Users,
    label: 'Admins',
    description: 'Manage admin users',
    href: '/admin/admins',
    superadmin: true
  }
];

const AdminNavigation = () => {
  const { isSuperAdmin } = useCurrentAdmin();

  const visibleItems = navigationItems.filter(item => !item.superadmin || isSuperAdmin);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground mb-6">Admin Management</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {visibleItems.map(item => (
          <Card
            key={item.label}
            className="p-0 overflow-hidden bg-profile-card border-profile-border hover:shadow-hover transition-all duration-200 cursor-pointer group"
          >
            <Link
              href={item.href}
              className="w-full h-full p-6 justify-start text-left group-hover:bg-muted/50 flex items-center transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">{item.label}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </div>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminNavigation;
