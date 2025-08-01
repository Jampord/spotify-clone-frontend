import { axiosInstance } from "@/lib/axios";
import { useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { Loader } from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import { useChatStore } from "@/stores/useChatStore";

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
  const { initSocket, disconnectSocket } = useChatStore();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = await getToken();
        updateApiToken(token);
        if (token) {
          await checkAdminStatus();

          //init socket
          if (userId) {
            initSocket(userId);
          }
        }
      } catch (error: any) {
        console.log("Error in auth provider: ", error);
        updateApiToken(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Cleanup function to disconnect socket when component unmounts
    return () => {
      disconnectSocket();
    };
  }, [getToken, userId, checkAdminStatus, initSocket, disconnectSocket]);

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
