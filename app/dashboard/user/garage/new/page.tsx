import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { CarForm } from "@/features/garage/components/CarForm";

export default async function NewCarPage() {
  const session = await getSession();
  
  if (!session) {
    redirect("/auth/login");
  }

  const userId = (session as any).userId;

  return (
    <div className="p-6 md:p-12 max-w-7xl mx-auto">
      <CarForm userId={userId} />
    </div>
  );
}
