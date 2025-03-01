import React, { useState, useRef, useCallback , useEffect } from 'react';
import { Mic, Send, StopCircle } from 'lucide-react';

function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [socket, setsocket] = useState(null);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const speechBuffer = useRef('');
  const manualStop = useRef(false);
  const aiReplied = useRef(false);

  useEffect(()=>{
    const ws = new WebSocket(` wss://mental-rwqo.onrender.com/ws/chat/`);
    ws.onopen = () => {
      console.log('connected');
      
    };
    ws.onclose = () => console.log("WebSocket Disconnected");
    setsocket(ws);
    return () => ws.close();
  },[]);

  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  React.useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const startRecording = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Your browser does not support speech recognition. Please use Google Chrome or a compatible browser.');
      return;
    }
    
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 1;
    recognition.interimResults = false;
    recognition.continuous = true;
    manualStop.current = false;
    
    recognition.onstart = () => {
      setIsRecording(true);
      speechBuffer.current = '';
    };
    
    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript;
      speechBuffer.current += ' ' + transcript;
    };
    
    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
    };
    
    recognition.onend = () => {
      setIsRecording(false);
      if (!manualStop.current) {
        recognition.start();
      } else {
        handleFinalSpeechMessage();
      }
    };
    
    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      manualStop.current = true;
      recognitionRef.current.stop();
    }
  };
   const handleFinalSpeechMessage = () => {
    const finalText = speechBuffer.current.trim();
    if (finalText) {
      setMessages(prev => [...prev, { id: Date.now().toString(), text: finalText, sender: 'user', type: 'text' }]);
      setInputText('');
      if(socket){
        socket.send(JSON.stringify({message: finalText}));
        socket.onmessage = (e) => {
          const message = JSON.parse(e.data);
          const ai_msg = message['text'];
          setMessages(prev => [...prev, { id: Date.now().toString(), text: ai_msg , sender: 'ai', type: 'text' }]);
        }
      }
      
    }
  };

  const sendMessage = () => {
    const trimmedText = inputText.trim();
    if (trimmedText) {
      setMessages(prev => [...prev, { id: Date.now().toString(), text: trimmedText, sender: 'user', type: 'text' }]);
      setInputText('');
      if(socket){
        socket.send(JSON.stringify({message: trimmedText}));
        socket.onmessage = (e) => {
          const message = JSON.parse(e.data);
          const ai_msg = message['text'];
          setMessages(prev => [...prev, { id: Date.now().toString(), text: ai_msg , sender: 'ai', type: 'text' }]);
        }
      }
      
    }
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      const synth = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(text);

      let voices = synth.getVoices();
      if (voices.length === 0) {
        synth.onvoiceschanged = () => {
          voices = synth.getVoices();
          setFemaleVoice(utterance, voices);
          synth.speak(utterance);
        };
      } else {
        setFemaleVoice(utterance, voices);
        synth.speak(utterance);
      }
    } else {
      alert('Speech synthesis is not supported in this browser.');
    }
  };
  const setFemaleVoice = (utterance, voices) => {
    const femaleVoice = voices.find(voice =>
      voice.name.includes('Female') ||
      voice.name.includes('Zira') ||
      voice.name.includes('Google UK English Female')
    );
    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }
    utterance.lang = 'en-US';
    utterance.rate = 1;
    utterance.pitch = 1.2;
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen w-screen flex flex-col justify-center items-center p-2 bg-cover bg-center bg-no-repeat"style={{ backgroundImage: "url('/Background.jpg')" }}>
      <div className="w-full max-w-2xl bg-gradient-to-l from-purple-200 to-fuchsia-100 p-6 rounded shadow-lg shadow-purple-500 flex flex-col space-y-4 mt-4">
        <div className="w-full bg-fuchsia-200 py-4 px-6 flex left shadow-md text-xl rounded font-bold text-black">
          XYLA - AI Assistant
        </div>
        <div className="h-96 overflow-y-auto border-b p-4 flex flex-col space-y-1">
          {messages.length === 0 && (
            <div className="text-black font-bold text-2xl text-center py-4 mt-10">
              Hii, I am XYLA<br />How can I help you today?
            </div>
          )}
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} items-center`}
            >
              {/* <div
                className={`p-3 rounded-lg max-w-[75%] ${
                  message.sender === 'user' ? 'bg-gray-200 text-black' : 'bg-gray-200 text-black'
                }`}
              >
                {message.text}
              </div> */}
              <div
                className={`chat ${
                  message.sender === 'user' ? 'chat-end' : 'chat-start'
                }`}
              >
                <div
                  className={`chat-bubble  bg-transparent border border-stone-950 rounded-3xl backdrop-blur-lg ${
                    message.sender === 'user'
                      ? ' text-black'
                      : ' text-black'
                  } p-3`}
                >
                  {message.text}
                </div>
              </div>


              {/* 🔊 Text-to-Speech Button for AI Responses */}
              {message.sender === 'ai' && (
              <button
                onClick={() => {
                  if (window.speechSynthesis.speaking) {
                    window.speechSynthesis.cancel(); // Stop speech if it's currently speaking
                  } else {
                    speakText(message.text); // Start speech if not speaking
                  }
                }}
                  className="ml-1 p-2 bg-rose-500 text-white rounded-full"
                >
                  🔊
                </button>
              )}

            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="flex items-center border gap-3">
          <button onClick={isRecording ? stopRecording : startRecording} className={`p-3 rounded-full ${isRecording ? 'bg-red-500' : 'bg-rose-600'} text-white`}>
            {isRecording ? <StopCircle size={24} /> : <Mic size={24} />}
          </button>
          <input 
            type="text" 
            value={inputText} 
            onChange={(e) => setInputText(e.target.value)} 
            onKeyDown={handleKeyDown} 
            className="flex-1 p-3 border border-black rounded-lg bg-transparent text-black" 
            placeholder="Type a message..." 
          />
          <button onClick={sendMessage} disabled={!inputText.trim()} className="p-3 bg-rose-500 text-white rounded-lg">
            <Send size={20} />
          </button>
        </div>
      </div>
      {/* <p className='flex items-center pt-10 text-black text-bold'>It can make mistakes. For serious problems, consult with professionals.</p> */}
      <p className="flex items-center justify-center text-center  w-full min-h-[10vh] text-black font-bold">
  It can make mistakes. For serious problems, consult with professionals.
</p>

    </div>
  );
}

export default ChatPage;