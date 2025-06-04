import { useState } from "react";

const OLLAMA_API_URL = `${process.env.NEXT_PUBLIC_OLLAMA}`

const fetchAIResponse = async (userInput: string): Promise<string> => {
    try {
        const response = await fetch(OLLAMA_API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                model: "llama3.2:latest", 
                prompt: `Nexus is a personal finance management platform.  
                    - The Export feature is located at the bottom right corner of the Nexus dashboard. Users can export their data in CSV or PDF format.  
                    - To add expenses, go to the Dashboard page and scroll to the Transactions area.  
                    - To see data on a graph, go to the Dashboard and scroll down to the "Income and Expenses over time" area.  
                    - To save money, consider general saving strategies and check the Money Saving Recommendations area on the dashboard.  

                    If the question is about any of these features, provide this exact information without changes.  
                    If it's a general finance question, give a very short and simple explanation (1-2 sentences) suitable for a high school student. For these type of questions, just provide the information without stating that it is a general finance question.
                    If the input is unclear or empty, respond with: "How can I help you?" or something with "Let's try to keep this conversation back on Nexus and financial management"
                    If the user says 'thank you' or something appreciative, respond with: "You're welcome!"  

                    Here is the question: ${userInput}`
                            }),
        });

        if (!response.body) throw new Error("Received empty response body");

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let botReply = "";

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.trim().split("\n");
            for (const line of lines) {
                try {
                    const json = JSON.parse(line);
                    if (json.response) botReply += json.response;
                } catch (parseError) {
                    console.error("JSON Parse Error:", parseError);
                }
            }
        }

        return botReply || "No response received";
    } catch (error) {
        console.error("Fetch error:", error);
        return "Error connecting to AI server.";
    }
};

const Chatbot = () => {
    const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
    const [userInput, setUserInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const sendMessage = async () => {
        if (!userInput.trim() || isLoading) return;
    
        const newMessage = { sender: "You", text: userInput };
    
        setMessages((prev) => [...prev, newMessage, { sender: "Bot", text: "Thinking..." }]);
        setIsLoading(true);
        setUserInput("");
    
        const botReply = await fetchAIResponse(userInput);
    
        setMessages((prev) => {
            const updatedMessages = [...prev];
            updatedMessages[updatedMessages.length - 1] = { sender: "Bot", text: botReply };  // ✅ Modify instead of map()
            return updatedMessages;
        });
    
        setIsLoading(false);
    };
    

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") sendMessage();
    };

    return (
        <div className="flex flex-col h-full w-full bg-black text-white p-4 rounded-lg shadow-lg">
            <div className="flex items-center p-4 bg-gradient-to-b from-gray-900 to-black rounded-lg">
                <img src="/wh.png" alt="Nexus" className="w-8 h-8 rounded-full mr-3" />
                <h1 className="text-lg font-semibold">Nexus AI</h1>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[400px]">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.sender === "You" ? "justify-end" : "justify-start"}`}>
                        <div className={`px-4 py-2 rounded-lg ${msg.sender === "You" ? "bg-blue-500" : "bg-gray-800"}`}>
                            <p className="text-sm">{msg.text}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex items-center p-4 border-t border-gray-700">
                <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Message the chatbot..."
                    className="flex-1 px-4 py-2 rounded-lg bg-gray-900 text-white border-none focus:outline-none"
                />
                <button
                    onClick={sendMessage}
                    disabled={isLoading}
                    className="ml-2 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-500 disabled:opacity-50"
                >
                    ➤
                </button>
            </div>
        </div>
    );
};

export default Chatbot;
