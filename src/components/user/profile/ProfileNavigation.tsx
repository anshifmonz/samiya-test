'use client';

import { Card } from 'ui/card';
import Link from 'next/link';
import { User, MapPin, ShoppingBag, Heart, CreditCard, Settings, ShieldCheck } from 'lucide-react';

const navigationItems = [
  { icon: User, label: "Personal Info", description: "Update your personal details", href: "/user/profile" },
  { icon: MapPin, label: "Address Book", description: "Manage shipping addresses", href: "/user/addresses" },
  { icon: ShoppingBag, label: "Orders", description: "View order history", href: "/user/orders" },
  { icon: Heart, label: "Wishlist", description: "Your saved items", href: "/user/wishlists" },
  { icon: CreditCard, label: "Payment Methods", description: "Manage payment options", href: "/user/payment-methods" },
  { icon: Settings, label: "Settings", description: "Account preferences", href: "/user/settings" },
  { icon: ShieldCheck, label: "Login & Security", description: "Manage login & security settings", href: "/user/security" },
];

const ProfileNavigation = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground mb-6">Account Management</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {navigationItems.map((item) => (
          <Card key={item.label} className="p-0 overflow-hidden bg-profile-card border-profile-border hover:shadow-hover transition-all duration-200 cursor-pointer group">
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

export default ProfileNavigation;
