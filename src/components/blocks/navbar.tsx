import { auth, provider } from "@/firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import { useAuth } from "@/contexts/authcontext";
import { useTheme } from "@/contexts/themecontext";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip";

import { Github, LogIn, LogOut, Moon, Sun } from "lucide-react";


// ----------- Left Block -------------

const NavbarLeftBlock = () => {
  const { user } = useAuth();

  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.error("Sign in error: ", error);
    }
  }

  const handleSignOut = () => {
    try {
      signOut(auth)
    } catch (error: any) {
      console.log("Sign out error: ", error);
    }
  }

  return (
    <div>
      {user ? (
        <div className="flex flex-row gap-3 items-center">
          <Avatar>
            <AvatarImage src={user.photoURL || ""} />
            <AvatarFallback>
              {user.displayName? user.displayName[0] : '?'}
            </AvatarFallback>
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

            <TooltipContent>Sign Out</TooltipContent>
          </Tooltip>
        </div>
      ) : (
        <Button onClick={handleSignIn}>
          <LogIn /> Sign In with Google
        </Button>
      )}
    </div>
  )
}


// ----------- Right Block -------------

const NavbarRightBlock = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex flex-row flex-wrap items-center align-middle gap-2">
      <Tooltip>
        <TooltipTrigger>
          <a href="https://github.com/mehedirm6244/firebase-chat">
            <Button
              size="icon"
              variant="outline"
              >
              <Github />
            </Button>
          </a>
        </TooltipTrigger>

        <TooltipContent>
          Source code
        </TooltipContent>
      </Tooltip>
      

      <Button
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
    <div
      className="sticky top-0 left-0 w-screen flex flex-row justify-between
        align-middle items-center p-6 h-20 bg-muted z-2"
      >
      <NavbarLeftBlock />
      <NavbarRightBlock />
    </div>
  )
}


export default Navbar;
