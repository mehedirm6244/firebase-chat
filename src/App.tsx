// ----------- Contexts -------------

import { useAuth } from "@/components/authcontext";

// ---------- Components ------------

import LoginPage from "@/components/pages/loginpage";
import ChatPage from "@/components/pages/chatpage";

// ------------- Main ---------------

function App() {
  const { user } = useAuth();
  return user? <ChatPage /> : <LoginPage />
}

// ------------ Export ---------------

export default App;
