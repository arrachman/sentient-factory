import { Button } from "@/components/ui/button";
import { Home, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 text-center">
      {/* 404 Graphic */}
      <div className="relative mb-6">
        <div className="text-9xl font-black text-muted-foreground/10 select-none">
          404
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="h-10 w-10 text-destructive" />
          </div>
        </div>
      </div>

      {/* Main Heading */}
      <h2 className="mb-3 text-3xl font-bold tracking-tight text-foreground">
        Page Not Found
      </h2>

      {/* Description */}
      <p className="mb-8 max-w-[400px] text-muted-foreground leading-relaxed">
        The page you are looking for doesn't exist or has been moved to another
        location.
      </p>

      {/* Action Button */}
      <Button asChild size="lg" className="h-11 px-8">
        <Link href="/">
          <Home className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
      </Button>

      {/* Footer Text */}
      <p className="mt-12 text-xs text-muted-foreground">
        If you believe this is an error, please contact support.
      </p>
    </div>
  );
}
