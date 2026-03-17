import { Globe, Apple } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function SocialAuth() {
  return (
    <div className="w-full">
      <div className="relative my-4">
        <Separator />
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs text-muted-foreground">
          or continue with
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* TODO: Implement Supabase OAuth for Google and Apple providers */}
        <Button type="button" variant="outline" className="gap-2 text-sm hover:bg-zinc-100">
          <Globe className="h-4 w-4" />
          Google
        </Button>
        <Button type="button" variant="outline" className="gap-2 text-sm hover:bg-zinc-100">
          <Apple className="h-4 w-4" />
          Apple
        </Button>
      </div>
    </div>
  );
}