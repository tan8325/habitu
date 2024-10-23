"use client"

import { cn } from "@/lib/utils";
import { ChevronsLeft, LandPlot, Mail, MenuIcon, NotebookTabs, PersonStanding, Settings } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { ElementRef, useEffect, useRef, useState } from "react";
import { useModalStore } from "@/hooks/use-modal-store";
import { useMediaQuery } from "usehooks-ts";
import { Profile } from "./profile";
import { Item } from "./sidebar-nav";


export const Sidebar = () => {
  const { open } = useModalStore();
  const pathname = usePathname();
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const sidebarRef = useRef<ElementRef<"aside">>(null);
  const navbarRef = useRef<ElementRef<"div">>(null);
  const isResizingRef = useRef(false);

  const [isResetting, setIsResetting] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(isMobile);

  const resetWidth = () => {
    if (!sidebarRef.current || !navbarRef.current) return;
    
    setIsResetting(true);
    setIsCollapsed(false);

    sidebarRef.current.style.width = isMobile ? "100%" : "240px";
    navbarRef.current.style.setProperty("width", isMobile ? "0" : "calc(100% - 240px)");
    navbarRef.current.style.setProperty("left", isMobile ? "100%" : "240px");

    setTimeout(() => setIsResetting(false), 300);
  };

  const collapse = () => {
    if (!sidebarRef.current || !navbarRef.current) return;
    
    setIsCollapsed(true);
    setIsResetting(true);

    sidebarRef.current.style.width = "0";
    navbarRef.current.style.setProperty("width", "100%");
    navbarRef.current.style.setProperty("left", "0");

    setTimeout(() => setIsResetting(false), 300);
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    isResizingRef.current = true;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (!isResizingRef.current) return;

    const newWidth = Math.min(Math.max(event.clientX, 240), 480);
    if (sidebarRef.current && navbarRef.current) {
      sidebarRef.current.style.width = `${newWidth}px`;
      navbarRef.current.style.setProperty("left", `${newWidth}px`);
      navbarRef.current.style.setProperty("width", `calc(100% - ${newWidth}px)`);
    }
  };

  const handleMouseUp = () => {
    isResizingRef.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const handleRedirect = (path: string) => router.push(`/dashboard${path}`);

  useEffect(() => {
    if (isMobile) collapse();
    else resetWidth();
  }, [pathname, isMobile]);

  return (
    <>
      <aside
        ref={sidebarRef}
        className={cn("group/sidebar h-full bg-secondary overflow-y-auto relative flex w-60 flex-col", isResetting && "transition-all ease-in-out duration-300", isMobile && "w-0")}
      >
        <div
          onClick={collapse}
          role="button"
          className={cn("h-6 w-6 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 absolute top-3 right-2 opacity-0 group-hover/sidebar:opacity-100 transition", isMobile && "opacity-100")}
        >
        <ChevronsLeft className="h-6 w-6" />
        </div>
        <div>
          <Profile />
          <Item onClick={() => handleRedirect("/")} label="Habits" icon={PersonStanding} />
          <Item onClick={() => handleRedirect("/notifications")} label="Notifications" icon={Mail} />
          <Item onClick={() => handleRedirect("/challenges")} label="Challenges" icon={LandPlot} />
          <Item onClick={() => {}} label="Smart Fitness Planner" icon={NotebookTabs} />
          <Item   onClick={() => open('settings')} label="Settings" icon={Settings} />
        </div>
        <div
          onMouseDown={handleMouseDown}
          onClick={resetWidth}
          className="opacity-0 group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute h-full w-1 bg-primary/10 top-0 right-0"
        />
      </aside>
      <div
        ref={navbarRef}
        className={cn("absolute top-0 left-60 w-[calc(100%-240px)]", isResetting && "transition-all ease-in-out duration-300", isMobile && "left-0 w-full")}
      >
        <nav className="bg-transparent px-3 py-2 w-full">
          {isCollapsed && <MenuIcon onClick={resetWidth} role="button" className="w-6 text-muted-foreground" />}
        </nav>
      </div>
    </>
  );
};