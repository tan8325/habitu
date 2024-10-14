import { ChevronsLeftRight, X } from "lucide-react";
import { useUser, SignOutButton, UserProfile } from "@clerk/clerk-react";
import { useState, useRef, useEffect } from "react";

import {
  Avatar,
  AvatarImage
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const UserItem = () => {
  const { user } = useUser();
  const [showProfile, setShowProfile] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfile(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
        <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div role="button" className="flex items-center text-md p-3 w-full hover:bg-primary/5">
          <div className="gap-x-2 flex items-center max-w-[150px]">
            <Avatar className="h-7 w-7">
              <AvatarImage src={user?.imageUrl} />
            </Avatar>
            <span className="text-start font-medium line-clamp-1">
              {user?.fullName}
            </span>
          </div>
          <ChevronsLeftRight className="rotate-90 ml-2 text-muted-foreground h-4 w-4" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-80"
        align="start"
        alignOffset={11}
        forceMount
      >
        <div className="flex flex-col space-y-4 p-2">
          <p className="text-xs font-medium leading-none text-muted-foreground">
            {user?.emailAddresses[0].emailAddress}
          </p>
          <div className="flex items-center gap-x-2">
            <div className="rounded-md bg-secondary p-1"> 
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.imageUrl} />
              </Avatar>
            </div>
            <div className="space-y-1">
              <p className="text-sm line-clamp-1">
                {user?.fullName}&apos;s Dashboard
              </p>
            </div>
          </div>
        </div>
        <DropdownMenuSeparator />
          
          <DropdownMenuItem
            onClick={() => setShowProfile(true)}
            className="w-full cursor-pointer text-muted-foreground"
          >
            Profile Management
          </DropdownMenuItem>
    
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild className="w-full cursor-pointer text-muted-foreground">
            <SignOutButton>
              Log out
            </SignOutButton>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {showProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div ref={profileRef}>
            <button
              className="absolute top-2 right-2 p-2"
              onClick={() => setShowProfile(false)}
            >
              <X className="text-white hover:text-black hover:bg-gray-300" />
            </button>
            <UserProfile />
          </div>
        </div>
      )}
    </>
  );
};