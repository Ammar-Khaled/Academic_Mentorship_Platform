import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { useAuthStore } from "@/stores/auth-store";
import { router } from "@/routes";

function AuthBootstrap({ children }) {
  const fetchProfile = useAuthStore((state) => state.fetchProfile);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return children;
}

const App = () => {
  return (
    <ThemeProvider>
      <AuthBootstrap>
        <RouterProvider router={router} />
        <Toaster richColors position="top-right" />
      </AuthBootstrap>
    </ThemeProvider>
  );
};

export default App;
