import { axiosInstance } from "@/lib/axios";
import { useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { Loader } from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";

const updateApiToken = (token: string | null) => {
  if (token) {
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common["Authorization"];
  }
};
const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const { getToken, userId } = useAuth();
  const { checkAdminStatus } = useAuthStore();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = await getToken();
        updateApiToken(token);
        if (token) {
          await checkAdminStatus();
        }
      } catch (error: any) {
        console.log("Error in auth provider: ", error);
        updateApiToken(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [getToken]);

  if (loading) {
    return (
      <div className="h-screen w-full flex justify-center items-center ">
        <Loader className="size-20 text-emerald-500 animate-spin" />
      </div>
    );
  }
  return <div>{children}</div>;
};

export default AuthProvider;
