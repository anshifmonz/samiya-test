'use client';

import { Button } from 'ui/button';
import { Card } from 'ui/card';
import { Edit2 } from 'lucide-react';
import Image from 'next/image';

const ProfileOverview = () => {
  return (
    <Card className="p-8 bg-profile-card border-profile-border shadow-card mt-20">
      <div className="flex items-center gap-6">
        <div className="relative">
          <Image
            src="/images/user-avatar.jpg"
            alt="User Avatar"
            width={96}
            height={96}
            className="rounded-full object-cover border-4 border-white shadow-lg"
          />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-2 border-white rounded-full"></div>
        </div>

        <div className="flex-1">
          <h1 className="text-3xl font-bold text-foreground mb-2">Sarah Johnson</h1>
          <p className="text-muted-foreground text-lg mb-3">sarah.johnson@email.com</p>
          <p className="text-sm text-muted-foreground">Member since: January 2022</p>
        </div>

        <Button variant="outline" size="sm" className="gap-2">
          <Edit2 className="w-4 h-4" />
          Edit Profile
        </Button>
      </div>
    </Card>
  );
};

export default ProfileOverview;
