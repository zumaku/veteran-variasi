import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Mail, Phone, MapPin, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

export default async function ProfilePage() {
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
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="bg-white dark:bg-zinc-900 border rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 md:p-10 flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10">
          {/* Avatar Section */}
          <div className="relative group">
            <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-background ring-1 ring-border">
              {user.image_url ? (
                <AvatarImage
                  src={user.image_url}
                  alt={user.name}
                  className="object-cover"
                />
              ) : null}
              <AvatarFallback className="text-3xl font-bold bg-primary/10 text-primary">
                {user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="flex-1 flex flex-col md:flex-row justify-between items-center md:items-start w-full gap-8">
            <div className="space-y-6 text-center md:text-left">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                  {user.name}
                </h1>
                <p className="text-primary font-medium text-sm mt-1">
                  {user.role} Member
                </p>
              </div>

              <div className="flex flex-col md:flex-row flex-wrap gap-4 md:gap-8 items-center md:items-start">
                <div className="flex items-center gap-3 group text-muted-foreground hover:text-foreground transition-colors">
                  <div className="bg-muted p-2.5 rounded-xl group-hover:bg-primary/10 group-hover:text-primary transition-all">
                    <Mail className="h-4.5 w-4.5" />
                  </div>
                  <div className="flex flex-col items-start translate-y-[-1px]">
                    <span className="text-[10px] uppercase tracking-wider font-bold opacity-50">
                      Email
                    </span>
                    <span className="text-sm font-semibold">{user.email}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 group text-muted-foreground hover:text-foreground transition-colors">
                  <div className="bg-muted p-2.5 rounded-xl group-hover:bg-primary/10 group-hover:text-primary transition-all">
                    <Phone className="h-4.5 w-4.5" />
                  </div>
                  <div className="flex flex-col items-start translate-y-[-1px]">
                    <span className="text-[10px] uppercase tracking-wider font-bold opacity-50">
                      Telepon
                    </span>
                    <span className="text-sm font-semibold">
                      {user.phone || "Belum diatur"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 group text-muted-foreground hover:text-foreground transition-colors">
                  <div className="bg-muted p-2.5 rounded-xl group-hover:bg-primary/10 group-hover:text-primary transition-all">
                    <MapPin className="h-4.5 w-4.5" />
                  </div>
                  <div className="flex flex-col items-start translate-y-[-1px]">
                    <span className="text-[10px] uppercase tracking-wider font-bold opacity-50">
                      Alamat
                    </span>
                    <span className="text-sm font-semibold">
                      {user.address || "Belum diatur"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <Button
              asChild
            >
              <Link
                href="/dashboard/profile/edit"
                className="flex items-center gap-2 font-bold"
              >
                <Edit className="h-5 w-5" />
                Edit Profile
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
