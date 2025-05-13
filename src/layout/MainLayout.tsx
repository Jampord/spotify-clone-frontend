import LeftSidebar from "@/layout/components/LeftSidebar";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Outlet } from "react-router-dom";
import FriendsActivity from "./components/FriendsActivity";
import AudioPlayer from "@/components/AudioPlayer";
import PlaybackControls from "./components/PlaybackControls";
import { useEffect, useState } from "react";

const MainLayout = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile(); // Check on initial load
    window.addEventListener("resize", checkMobile); // Check on resize
    return () => {
      window.removeEventListener("resize", checkMobile); // Cleanup the event listener
    };
  }, []);
  return (
    <div className="h-screen bg-black text-white flex flex-col">
      <ResizablePanelGroup direction="horizontal" className="flex flex-1 h-full overflow-hidden p-2">
        <AudioPlayer />
        {/*----left sidebar ----*/}
        <ResizablePanel defaultSize={20} minSize={isMobile ? 0 : 10} maxSize={30}>
          <LeftSidebar />
        </ResizablePanel>

        <ResizableHandle className="w-2 bg-black rounded-lg transition-colors" />

        {/*----main content ----*/}
        <ResizablePanel defaultSize={isMobile ? 80 : 60} minSize={isMobile ? 40 : 50} maxSize={90}>
          <Outlet />
        </ResizablePanel>

        {!isMobile && (
          <>
            <ResizableHandle className="w-2 bg-black rounded-lg transition-colors" />

            {/*----right sidebar ----*/}
            <ResizablePanel defaultSize={20} minSize={0} maxSize={30} collapsedSize={0}>
              <FriendsActivity />
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>

      <PlaybackControls />
    </div>
  );
};

export default MainLayout;
