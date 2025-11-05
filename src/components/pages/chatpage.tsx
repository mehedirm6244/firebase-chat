import { useState, useEffect, useRef } from "react";
import { db } from "@/firebase";
import { useAuth } from "@/contexts/authcontext";
import {
  doc,
  addDoc,
  deleteDoc,
  collection,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription
} from "@/components/ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from "@/components/ui/hover-card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
  AlertDialogCancel
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip";

import { Loader2, MessageCircle, Send, Trash2 } from "lucide-react";


// --------- Chat Message -----------

type ChatMessageType = {
  author: string,
  createdAt: any,
  mail: string,
  pfp: string,
  text: string,
  uid: string,
  id: string,
};

const ChatMessage = ({msg} : {msg: ChatMessageType}) => {
  const { user } = useAuth();

  const deleteMessage = async (messageId: string) => {
    try {
      await deleteDoc(doc(db, "messages", messageId));
    } catch (error: any) {
      console.log("Deletion failed: ", error);
    }
  }

  return (
    <div 
      className={`
        flex gap-3 align-middle group 
        ${msg.uid === user?.uid? 'flex-row-reverse' : ''}
      `}
      >

      {/* Profile picture */}
      <HoverCard>
        <HoverCardTrigger>
          <Avatar>
            <AvatarImage src={msg.pfp} />
            <AvatarFallback>{msg.author[0]}</AvatarFallback>
          </Avatar>
        </HoverCardTrigger>

        <HoverCardContent>
          <div className="flex gap-3 items-center align-middle">
            <Avatar>
              <AvatarImage src={msg.pfp} />
              <AvatarFallback>{msg.author[0]}</AvatarFallback>
            </Avatar>
            
            <div>
              <p className="text-sm font-semibold">{msg.author}</p>
              <p className="text-muted-foreground text-xs">{msg.mail}</p>
            </div>
          </div>
      </HoverCardContent>
    </HoverCard>

      {/* Message */}
      <div
        className={`
          mt-0.5 break-words break-all whitespace-pre-wrap bg-muted
          px-3 py-2 rounded-lg text-sm max-w-[80%]
          ${msg.uid === user?.uid? 'rounded-tr-none' : 'rounded-tl-none'}
        `}
        >
        <Tooltip>
          <TooltipTrigger>
            <p className="text-left">
              {msg.text}
            </p>
          </TooltipTrigger>

          <TooltipContent>
            {msg.createdAt != null &&
              msg.createdAt.toDate().toLocaleString([], { 
                year: "numeric", 
                month: "2-digit", 
                day: "2-digit",
                hour: "2-digit", 
                minute: "2-digit"
              })
            }
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Delete button (only shown for current user) */}
      { msg.uid === user?.uid && 
        <AlertDialog>
          <AlertDialogTrigger>
            <Button
              size="icon"
              variant="ghost"
              className="opacity-0 pointer-events-none group-hover:opacity-100
                group-hover:pointer-events-auto"
              >
              <Trash2 className="text-destructive"/>
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>Delete for Everyone?</AlertDialogHeader>
            <AlertDialogDescription>
              <p className="break-words break-all">
                {msg.text}
              </p>
            </AlertDialogDescription>

            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => deleteMessage(msg.id)}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      }
    </div>
  )
}

// ------------ Main --------------

function ChatPage() {
  const { user } = useAuth();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [loading, setLoading] = useState(true);

  const sendMessage = async (e: any) => {
    e.preventDefault();
    if (!message.trim())
      return;

    await addDoc(collection(db, "messages"), {
      uid: user?.uid,
      text: message,
      author: user?.displayName,
      pfp: user?.photoURL,
      mail: user?.email,
      createdAt: serverTimestamp(),
    });

    setMessage("");
  };

  useEffect(() => {
    const q = query(
      collection(db, "messages"),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs: any = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setLoading(false);
      setMessages(msgs);
    });
    return () => unsubscribe();
  }, []);

  // Scroll to bottom when new message arrives
  const bottomRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div
      className="min-h-[calc(100vh-5rem)] flex align-middle
        items-center justify-center"
      >

      {/* Chat window */}
      <Card className="sm:w-xl">
        <CardHeader>
          <CardTitle
            className="flex flex-row gap-1.5 items-center align-middle"
            >
            <MessageCircle size={18} className="-mt-0.5"/> <p>Firebase Chat</p>
          </CardTitle>

          <CardDescription>
            Messages are stored unencrypted and anyone can view the chat history.
            Refrain from sharing any sensitive information.
          </CardDescription>
        </CardHeader>

        {/* Message area */}
        <CardContent>
          <ScrollArea className="h-96 w-full rounded-md border p-4 mb-4">
            {loading ? (
              <div className="p-4 mx-auto flex items-center justify-center">
                <Loader2 className="animate-spin"/>
              </div>
            ) : (
              <div className="space-y-2">
                {messages.map((m: any) => (
                  <ChatMessage msg={m} />
                ))}
              </div>
            )}

            <div ref={bottomRef}></div>
          </ScrollArea>

          {user? (
            <form onSubmit={sendMessage} className="flex gap-2">
              <Input
                type="text"
                placeholder="Aa..."
                value={message}
                onChange={(e: any) => setMessage(e.target.value)}
              />

              <Button type="submit" size="icon">
                <Send />
              </Button>
            </form>
            ) : (
            <p className="text-sm text-muted-foreground text-center">
              Sign in to send messages
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default ChatPage;
