import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-privacy-gradient">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-md mx-auto bg-card-gradient rounded-xl p-8 border border-privacy-primary/20 shadow-card-shadow">
          <div className="text-6xl font-bold text-privacy-primary mb-4">404</div>
          <h1 className="text-2xl font-bold text-foreground mb-4">Page Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The page you're looking for doesn't exist or has been moved to a secure location.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="privacy" asChild>
              <a href="/" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Return Home
              </a>
            </Button>
            <Button variant="outline" onClick={() => window.history.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
