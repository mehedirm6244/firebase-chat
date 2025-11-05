import { AuthProvider } from "./contexts/authcontext";
import { ThemeProvider } from "./contexts/themecontext";

import ChatPage from "@/components/pages/chatpage";
import Navbar from "@/components/blocks/navbar";


function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Navbar />
        <ChatPage />
      </ThemeProvider>
    </AuthProvider>
  )
}

export default App;
