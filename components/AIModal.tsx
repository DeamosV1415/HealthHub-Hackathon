import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, Upload, Loader2, Image as ImageIcon, Activity, Clock, AlertCircle, Calendar } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { generateGeneralChatResponse, generateReportAnalysis, generateTriageResponse } from '../services/gemini';
import { ChatMessage } from '../types';

interface AIModalProps {
  type: 'chat' | 'triage' | 'report' | null;
  onClose: () => void;
  onBookAppointment?: () => void;
}

const AIModal: React.FC<AIModalProps> = ({ type, onClose, onBookAppointment }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  // Triage specific state
  const [painLevel, setPainLevel] = useState<number>(0);
  const [duration, setDuration] = useState<string>('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    // Initial greeting
    if (type === 'chat') {
      setMessages([{ id: 'init', role: 'model', text: 'Hello Chinmay! I am your health assistant. How can I help you today?', timestamp: new Date() }]);
    } else if (type === 'triage') {
      setMessages([{ id: 'init', role: 'model', text: 'Hello. I am here to help assess your symptoms. Please describe what you are feeling. You can use the controls below to indicate pain level and duration to help me understand better.', timestamp: new Date() }]);
    } else if (type === 'report') {
      setMessages([{ id: 'init', role: 'model', text: 'Please upload a photo of your medical report or lab results, and I will analyze it for you.', timestamp: new Date() }]);
    }
    // Reset inputs on open
    setPainLevel(0);
    setDuration('');
    setInput('');
    setSelectedFile(null);
    setPreviewUrl(null);
    setUploadError(null);
  }, [type]);

  const handleSend = async () => {
    setUploadError(null);
    // Construct the full message including structured data for Triage
    let messageText = input.trim();
    
    if (type === 'triage') {
        const details = [];
        if (painLevel > 0) details.push(`Pain Level: ${painLevel}/10`);
        if (duration) details.push(`Duration: ${duration}`);
        
        if (details.length > 0) {
            const contextStr = `\n\n*Context: ${details.join(', ')}*`;
            messageText = messageText ? messageText + contextStr : `Reported symptoms. ${contextStr}`;
        }
    }

    if ((!messageText && !selectedFile) || isLoading) return;

    setIsLoading(true);

    // Prepare image data if exists
    let imageData: { base64: string, mimeType: string } | undefined;
    let dataUrl: string | undefined;

    if (selectedFile) {
        try {
            dataUrl = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(selectedFile);
            });
            imageData = {
                base64: dataUrl.split(',')[1],
                mimeType: selectedFile.type
            };
        } catch (e) {
            console.error("File read error", e);
            setUploadError("Failed to process the image. Please try another file.");
            setIsLoading(false);
            return;
        }
    }

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: messageText, // Use the constructed text
      image: dataUrl,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    
    // Reset inputs
    setInput('');
    setSelectedFile(null);
    setPreviewUrl(null);
    setUploadError(null);
    // Optional: Reset structured inputs after send, or keep them if users want to correct? Usually reset.
    setPainLevel(0);
    setDuration('');

    try {
      let responseText = '';
      
      if (type === 'report' && imageData) {
         responseText = await generateReportAnalysis(imageData.base64, imageData.mimeType) || "Failed to analyze.";
      } else {
        // Prepare history for API (text-only history for simplicity in this context)
        const history = messages.map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        }));

        if (type === 'triage') {
          responseText = await generateTriageResponse(history, userMsg.text, imageData) || "Error getting response.";
        } else {
          responseText = await generateGeneralChatResponse(history, userMsg.text) || "Error getting response.";
        }
      }

      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date()
      }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        text: "I encountered an error. Please try again.",
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validation: Check file type
      if (!file.type.startsWith('image/')) {
        setUploadError("Invalid file type. Please upload a valid image (JPEG, PNG).");
        if (fileInputRef.current) fileInputRef.current.value = ''; // Reset input
        return;
      }

      // Validation: Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setUploadError("File is too large. Please upload an image smaller than 5MB.");
        if (fileInputRef.current) fileInputRef.current.value = ''; // Reset input
        return;
      }

      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.onerror = () => {
        setUploadError("Failed to read the file. Please try again.");
        setSelectedFile(null);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!type) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-health-card w-full max-w-2xl h-[700px] rounded-3xl border border-white/10 flex flex-col shadow-2xl overflow-hidden transition-all duration-300">
        {/* Header */}
        <div className="p-4 border-b border-white/5 flex justify-between items-center bg-[#132A23]/50">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${type === 'triage' ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-white font-bold">
                {type === 'chat' && 'Health Assistant'}
                {type === 'triage' && 'AI Triage'}
                {type === 'report' && 'Report Analyzer'}
              </h3>
              <p className="text-xs text-health-muted">Powered by Gemini 2.5</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-gray-400 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-4 rounded-2xl ${
                msg.role === 'user' 
                  ? 'bg-emerald-600 text-white rounded-tr-none' 
                  : 'bg-white/5 text-gray-200 border border-white/5 rounded-tl-none'
              }`}>
                {msg.image && (
                    <img src={msg.image} alt="Uploaded content" className="w-full rounded-lg mb-2 border border-white/20 max-h-48 object-cover" />
                )}
                <ReactMarkdown className="prose prose-invert prose-sm max-w-none">
                  {msg.text}
                </ReactMarkdown>
                
                {/* Book Appointment Action (Only for model messages in Triage mode) */}
                {msg.role === 'model' && type === 'triage' && onBookAppointment && (
                    <button 
                        onClick={onBookAppointment}
                        className="mt-3 text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 px-3 py-2 rounded-lg hover:bg-emerald-500/30 transition-colors flex items-center gap-2 cursor-pointer"
                    >
                        <Calendar className="w-3 h-3" />
                        Book Appointment
                    </button>
                )}

                <span className="text-[10px] opacity-50 block mt-2 text-right">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white/5 p-4 rounded-2xl rounded-tl-none border border-white/5 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                <span className="text-sm text-gray-400">Thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-white/5 bg-[#0d1110]">
          {/* Error Message Display */}
          {uploadError && (
             <div className="mb-3 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-2 text-rose-400 text-xs animate-in fade-in slide-in-from-bottom-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{uploadError}</span>
                <button onClick={() => setUploadError(null)} className="ml-auto hover:text-rose-300">
                    <X className="w-3 h-3" />
                </button>
             </div>
          )}

          {previewUrl && (
             <div className="mb-2 relative w-20 h-20 group">
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover rounded-lg border border-white/20" />
                <button 
                  onClick={() => { setSelectedFile(null); setPreviewUrl(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                  className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
             </div>
          )}

          {/* Structured Triage Inputs */}
          {type === 'triage' && (
            <div className="mb-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="flex items-center gap-2 mb-3 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    <Activity className="w-3 h-3 text-rose-500" />
                    Symptom Details
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Pain Level Slider */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-xs text-gray-300">Pain Scale (0-10)</label>
                            <span className={`text-xs font-bold px-2 py-0.5 rounded ${painLevel > 7 ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                                {painLevel}
                            </span>
                        </div>
                        <input 
                            type="range" 
                            min="0" 
                            max="10" 
                            value={painLevel} 
                            onChange={(e) => setPainLevel(Number(e.target.value))}
                            className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                        />
                         <div className="flex justify-between text-[10px] text-gray-500 mt-1">
                            <span>No Pain</span>
                            <span>Severe</span>
                        </div>
                    </div>

                    {/* Duration Select */}
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                             <label className="text-xs text-gray-300">Duration</label>
                             <Clock className="w-3 h-3 text-gray-500" />
                        </div>
                        <select 
                            value={duration} 
                            onChange={(e) => setDuration(e.target.value)}
                            className="w-full bg-[#0B100E] border border-white/10 text-white text-xs rounded-lg p-2 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                        >
                            <option value="">Select duration...</option>
                            <option value="Just started">Just started</option>
                            <option value="Less than 1 hour">Less than 1 hour</option>
                            <option value="1 - 24 hours">1 - 24 hours</option>
                            <option value="1 - 3 days">1 - 3 days</option>
                            <option value="More than 3 days">More than 3 days</option>
                            <option value="Ongoing / Chronic">Ongoing / Chronic</option>
                        </select>
                    </div>
                </div>
            </div>
          )}
          
          <div className="flex gap-2">
            {(type === 'report' || type === 'triage') && (
              <>
                <input 
                  type="file" 
                  accept="image/*" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  className="hidden" 
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="p-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                  title="Upload Image"
                >
                  <ImageIcon className="w-5 h-5" />
                </button>
              </>
            )}
            
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={type === 'report' && !selectedFile ? "Upload a file to start..." : "Describe your symptoms..."}
              disabled={isLoading}
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 placeholder-gray-600"
            />
            
            <button
              onClick={handleSend}
              disabled={isLoading || ((!input.trim() && !selectedFile) && (type !== 'triage' || (painLevel === 0 && duration === '')))}
              className="p-3 rounded-xl bg-emerald-500 text-health-bg hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIModal;