
import ProfileOverview from "components/user/profile/ProfileOverview";
import ProfileNavigation from "components/user/profile/ProfileNavigation";

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-profile-bg">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="space-y-8">
          <ProfileOverview />
          <ProfileNavigation />
        </div>
      </div>
    </div>
  );
}
