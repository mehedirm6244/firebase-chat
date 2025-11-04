// ---------- Contexts ------------

import { auth } from "@/firebase";
import { signOut } from "firebase/auth";
import { useAuth } from "@/components/authcontext";

// ---------- Components ------------

import { Button } from "@/components/ui/button";
import { LogOut, Moon, Sun } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useTheme } from "../themecontext";

// ------- Navbar Left Block ---------

const NavbarLeftBlock = () => {
  const { user } = useAuth();
  const handleSignOut = () => { signOut(auth) }

  return (
    <div>
      {/* Show user info if logged in */}
      {user?.photoURL && user.displayName &&
        <div className="flex flex-row gap-3 items-center">
          <Avatar>
            <AvatarImage src={user.photoURL} />
            <AvatarFallback>{user.displayName[0]}</AvatarFallback>
          </Avatar>

          <div>
            <p className="font-semibold">{user.displayName}</p>
            <p className="text-muted-foreground text-xs">{user.email}</p>
          </div>

          <Tooltip>
            <TooltipTrigger>
              <Button
                variant="outline"
                size="icon-sm"
                onClick={handleSignOut}
                >
                <LogOut />
              </Button>
            </TooltipTrigger>

            <TooltipContent>
              Sign Out
            </TooltipContent>
          </Tooltip>
        </div>
      }
    </div>
  )
}

// -------- Navbar Right Block ---------

const NavbarRightBlock = () => {
  const {theme, toggleTheme} = useTheme();

  return (
    <div className="flex flex-row flex-wrap gap-2">
      {/* Theme toggle */}
      <Button
        variant="outline"
        size="icon"
        onClick={toggleTheme}
      >
        {theme === "dark" ? <Moon /> : <Sun />}
      </Button>
    </div>
  )
}

// ------------- Navbar ---------------

function Navbar() {
  return (
    <div className="sticky top-0 left-0 w-screen flex flex-row justify-between align-middle items-center p-6 h-20 bg-muted z-2">
      <NavbarLeftBlock />
      <NavbarRightBlock />
    </div>
  )
}

export default Navbar;
