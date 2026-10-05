import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Send,
  X,
  Sparkles,
  Bot,
  User,
  ShieldAlert,
  ArrowRight,
  HelpCircle,
  Activity,
  CheckCircle2
} from 'lucide-react';
import { SimulationResult } from '../types';
import {
  ChatMessage,
  generateAssistantResponse,
  speakText,
  stopSpeaking
} from '../services/aiAssistantService';

interface AIAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  simulation: SimulationResult;
}

export const AIAssistantDrawer: React.FC<AIAssistantDrawerProps> = ({
  isOpen,
  onClose,
  simulation,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'init-1',
      sender: 'assistant',
      text: `Hello! I am the **UrbanShield AI Decision Assistant**. I have ingested the latest nowcast simulation (${simulation.params.rainfall}mm rainfall, ${simulation.params.drainageBlockage}% blockage, ${simulation.riskCategory} risk posture). Ask me anything about roads, hospital accessibility, evacuation routing, or response priorities.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      keyMetrics: [
        { label: 'Risk State', value: `${simulation.riskCategory} (${simulation.riskScore}/100)` },
        { label: 'Blocked Roads', value: `${simulation.blockedRoadsCount} Segments` },
        { label: 'Safe Corridor', value: 'Interstate 80 Active' }
      ]
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Suggested questions
  const suggestedQueries = [
    'What is the highest-risk area?',
    'Which road should emergency vehicles avoid?',
    'Which hospital is most affected?',
    'Why did the safe route change?',
    'What happens if rainfall increases?',
    'What should responders prioritize?'
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (queryText: string) => {
    if (!queryText.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');

    // Generate grounded response based on simulation data
    setTimeout(() => {
      const response = generateAssistantResponse(queryText, simulation);
      setMessages((prev) => [...prev, response]);

      if (speechEnabled) {
        setIsSpeaking(true);
        speakText(response.text, () => setIsSpeaking(false));
      }
    }, 250);
  };

  // Voice Recognition (Speech-to-Text)
  const toggleListening = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    if (typeof window === 'undefined') return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported by your browser. Please type your question.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputQuery(transcript);
          handleSend(transcript);
        }
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const toggleSpeechOutput = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
      setSpeechEnabled(false);
    } else {
      setSpeechEnabled(!speechEnabled);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => {
          stopSpeaking();
          onClose();
        }}
      />

      {/* Slide-over Drawer Panel */}
      <div className="relative w-full max-w-lg bg-slate-950 border-l border-slate-800 shadow-2xl flex flex-col h-full z-10 animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-cyan-950/40">
              <Bot className="w-4 h-4 text-slate-950 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white font-sans">
                  UrbanShield AI Assistant
                </h3>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950 border border-emerald-800">
                  GROUNDED
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Decision support reasoning over active simulation telemetry
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Audio Read-Aloud Toggle */}
            <button
              onClick={toggleSpeechOutput}
              className={`p-2 rounded-lg border transition-colors ${
                speechEnabled
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
              title={speechEnabled ? 'Text-to-speech enabled (Click to mute)' : 'Text-to-speech muted (Click to enable)'}
            >
              {speechEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Close button */}
            <button
              onClick={() => {
                stopSpeaking();
                onClose();
              }}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${
                msg.sender === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                  msg.sender === 'user'
                    ? 'bg-cyan-500 text-slate-950'
                    : 'bg-slate-800 border border-slate-700 text-cyan-400'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed space-y-2 ${
                  msg.sender === 'user'
                    ? 'bg-cyan-500/20 text-cyan-100 border border-cyan-500/40 rounded-tr-none'
                    : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none shadow-md'
                }`}
              >
                <div className="font-sans leading-relaxed whitespace-pre-line">
                  {msg.text.split('**').map((part, i) =>
                    i % 2 === 1 ? <strong key={i} className="text-white font-bold">{part}</strong> : part
                  )}
                </div>

                {/* Key Metrics Chips */}
                {msg.keyMetrics && msg.keyMetrics.length > 0 && (
                  <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-slate-800 font-mono text-[10px]">
                    {msg.keyMetrics.map((km, idx) => (
                      <div key={idx} className="p-1.5 rounded bg-slate-950 border border-slate-800">
                        <span className="text-slate-500 block">{km.label}</span>
                        <span className="text-cyan-300 font-bold">{km.value}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Suggested Action Note */}
                {msg.suggestedAction && (
                  <div className="p-2 rounded bg-cyan-950/40 border border-cyan-800/60 text-[10px] text-cyan-200 font-sans">
                    <span className="font-bold text-cyan-400 block font-mono mb-0.5">DIRECTIVE:</span>
                    {msg.suggestedAction}
                  </div>
                )}

                <div className="text-[9px] text-slate-500 font-mono text-right">
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Queries Chips */}
        <div className="p-3 bg-slate-900/60 border-t border-slate-800 space-y-1.5">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
            Suggested Queries:
          </span>
          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
            {suggestedQueries.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white text-[11px] border border-slate-700 transition-colors text-left truncate max-w-full"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar with Voice Control (Requirement 3) */}
        <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
          {/* Microphone Voice Button */}
          <button
            onClick={toggleListening}
            className={`p-2.5 rounded-xl border transition-all ${
              isListening
                ? 'bg-red-600 text-white animate-pulse border-red-500'
                : 'bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-cyan-400 border-slate-700'
            }`}
            title={isListening ? 'Listening... click to stop' : 'Click to speak question'}
          >
            {isListening ? <Mic className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend(inputQuery)}
            placeholder={isListening ? 'Listening to voice...' : 'Ask about risks, roads, hospitals, safe routes...'}
            className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 placeholder:text-slate-500"
          />

          <button
            onClick={() => handleSend(inputQuery)}
            disabled={!inputQuery.trim()}
            className="p-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-bold transition-all"
            title="Send query"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
