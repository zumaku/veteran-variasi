import { Check } from "lucide-react";
import getWhyChooseUs from "@/features/homepage/data/get-why-choose-us";

export default async function WhyChooseUs() {
  const data = await getWhyChooseUs();

  return (
    <div className="flex flex-col gap-6">
      {data?.map((feature, i) => (
        <div key={i} className="flex gap-4 items-start">
          <div className="bg-primary/10 p-2 rounded-md shrink-0">
            <Check className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h4 className="font-bold text-lg mb-1">{feature.title}</h4>
            <p className="text-sm text-muted-foreground">
              {feature.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
