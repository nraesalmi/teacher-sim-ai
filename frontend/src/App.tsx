import { useState, useRef, useEffect } from "react";
import logo from "/src/assets/teachersim.jpg"; 

interface Message {
  sender: "user" | "bot";
  text: string;
}

const initialMessage = "Hi teacher! My name is Oscar, and I am having some trouble with my math homework. Could you help me out?"

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [selectedCondition, setSelectedCondition] = useState<string | null>(null);


  const lastMessageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const initialMsg: Message = {
        sender: "bot",
        text: initialMessage,
      };
      setMessages([initialMsg]);
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { 
    sender: "user", 
    text: input
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);

    setInput("");

    try {
      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversation: updatedMessages.map(m => ({ sender: m.sender, text: m.text })),
          disability: selectedCondition
        }),
      });

      const data = await res.json();
      const botMsg: Message = {
        sender: "bot",
        text: data.answer.split(":")[1],
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      const errMsg: Message = { sender: "bot", text: "Error: could not reach server" };
      setMessages((prev) => [...prev, errMsg]);
    }
  };

  const evaluateConversation = async (selectedCondition: any) => {
    try {
      const res = await fetch("http://localhost:5000/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversation: messages.map(m => ({ sender: m.sender, text: m.text })),
          disability: selectedCondition
        }),
      });

      const data = await res.json();
      const botMsg: Message = {
        sender: "bot",
        text: data.answer,
      };

      setMessages([botMsg])
    }
    catch(err) {
      console.error(err);
      const errMsg: Message = { sender: "bot", text: "Error: could not reach server" };
      setMessages((prev) => [...prev, errMsg]);
    }
    
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "90vh", padding: "1rem" }}>
      <header style={{ display: "flex", alignItems: "center" }}>
        <img 
          src={logo} 
          alt="Teacher sim logo" 
          style={{ width: "60px", height: "60px", marginRight: "12px" }} 
        />
        <h1 style={{ fontSize: "30px", fontWeight: "bold" }}>Special Needs Teacher Simulator</h1>
      </header>
      {/* Selector Buttons */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
        {["Autism", "ADHD", "Dyslexia"].map((condition) => (
          <button
            key={condition}
            onClick={() => setSelectedCondition(condition)}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: selectedCondition === condition ? "#007bff" : "#e0e0e0",
              color: selectedCondition === condition ? "white" : "black",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            {condition}
          </button>
        ))}
      </div>
      {/* Chat messages */}
      <div style={{ flex: 1, overflowY: "auto", marginBottom: "1rem", border: "1px solid #ccc", padding: "0.5rem" }}>
        {messages.map((m, i) => {
          const isLast = i === messages.length - 1;
          return (
            <div key={i} ref={isLast ? lastMessageRef : null} style={{ textAlign: m.sender === "user" ? "right" : "left", margin: "0.25rem 0", position: "relative" }}>
              <span style={{ display: "inline-block", padding: "0.5rem 1rem", borderRadius: "12px", backgroundColor: m.sender === "user" ? "#007bff" : "#e0e0e0", color: m.sender === "user" ? "white" : "black", whiteSpace: "pre-wrap", maxWidth: "70%", position: "relative" }}>
                {m.text}
              </span>
            </div>
          );
        })}
      </div>

      {/* Input + Send */}
      <div style={{ display: "flex" }}>
        <input
          style={{ flex: 1, padding: "0.5rem" }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") sendMessage(); }}
          placeholder="Type your question..."
        />
        <button onClick={sendMessage} style={{ padding: "0.5rem 1rem" }}>
          Send
        </button>
      </div>

      {/* End and evaluate */}
      <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
        <button
          onClick={() => evaluateConversation(selectedCondition)}
          style={{
            padding: "0.5rem 1rem",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            backgroundColor: "#28a745",
            color: "white",
          }}
        >
          End and evaluate conversation
        </button>
      </div>
    </div>
  );
}
