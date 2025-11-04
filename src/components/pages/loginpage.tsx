// ----------- Contexts -------------

import { auth, provider } from "@/firebase";
import { signInWithPopup } from "firebase/auth";

// ---------- Components -------------

import { LogIn } from "lucide-react";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "@/components/ui/card";

// ------------- Main -----------------

function LoginPage() {
  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.error("Sign in error: ", error);
    }
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] w-screen flex flex-col items-center align-middle justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>Sign in with your Google account to start sending messages.</CardDescription>
        </CardHeader>

        <CardContent>
          <Button
            className="w-full"
            onClick={handleSignIn}
            >
            <LogIn /> Sign in with Google
          </Button>
        </CardContent>
        
      </Card>
    </div>
  )
}

// ----------- Exports -------------

export default LoginPage;
