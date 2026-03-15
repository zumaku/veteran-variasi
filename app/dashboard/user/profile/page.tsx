import UserProfieSection from "@/features/profile/components/UserProfileSection";
import UserCarsSection from "@/features/garage/components/UserCarsSection";

export default async function ProfilePage() {
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-12">
      {/* Profile Section */}
      <UserProfieSection />

      {/* Cars Section */}
      <UserCarsSection />
    </div>
  );
}
