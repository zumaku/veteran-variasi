import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { EditProfileForm } from "@/features/profile/components/EditProfileForm";

export default async function EditProfilePage() {
  const session = await getSession();

  if (!session) {
    redirect("/auth/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: (session as any).userId },
  });

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <EditProfileForm user={user} />
    </div>
  );
}
