"use client";

import { useState } from "react";
import { Mic, AudioWaveform } from "lucide-react";
import { toast } from "sonner";
import { TRANSLATIONS } from "@/lib/translations";

interface VoiceAssistantProps {
  onUpdate: (data: any) => void;
  currentData: any;
  lang: "en" | "hi";
}

export default function VoiceAssistant({ onUpdate, currentData, lang }: VoiceAssistantProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");

  const t = TRANSLATIONS[lang]?.vaani || TRANSLATIONS["en"].vaani;

  const startListening = () => {
    if (typeof window === "undefined" || !('webkitSpeechRecognition' in window)) {
      toast.error("Browser not supported", { description: "Try Chrome or Edge." });
      return;
    }

    // @ts-ignore
    const recognition = new window.webkitSpeechRecognition();
    
    recognition.lang = lang === "hi" ? "hi-IN" : "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript(t.listening);
    };

    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      setTranscript(`"${text}"`);
      setIsListening(false);
      processVoiceInput(text);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech Error:", event.error);
      setIsListening(false);
      setTranscript(t.error);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    try {
      recognition.start();
    } catch (e) {
      console.error(e);
    }
  };

  const processVoiceInput = (text: string) => {
    // 1. Clean Text: Lowercase + remove symbols
    // Note: We deliberately KEEP spaces to help with boundaries
    const cleanText = " " + text.replace(/[,₹Rs\-.]/g, "").toLowerCase() + " ";
    let updates: any = {};
    
    console.log("🎤 Processing:", cleanText);

    // --- HELPER: Flexible Regex ---
    // Matches patterns that are surrounded by spaces OR are at start/end
    // Designed to fix the \b issue with Hindi characters
    const contains = (patterns: string[]) => {
      return patterns.some(p => {
        // Create regex that matches the word/phrase with boundaries or spaces
        // We use (?:^|\s) instead of \b for better Hindi support
        const regex = new RegExp(`(?:^|\\s)(${p})(?:\\s|$)`, 'i');
        return regex.test(cleanText);
      });
    };

    // --- A. INCOME DETECTION ---
    const incomeKeywords = ["income", "salary", "aay", "vetan", "kamata", "kama", "kamai", "rupay", "rupaye", "paisa", "paise", "money", "आय", "वेतन", "कमाई", "रुपये", "रुपए", "सैलरी", "इनकम", "पैसा"];
    
    // Check if any income keyword is present
    if (incomeKeywords.some(k => cleanText.includes(k))) {
      let incomeFound = false;
      
      // Unit Logic (Lakh/Hazaar)
      const lakhMatch = cleanText.match(/(\d+(\.\d+)?)\s*(lakh|laakh|lak|lkh|lac|lt|लाख|लख|लक)/);
      const thousandMatch = cleanText.match(/(\d+(\.\d+)?)\s*(k|thousand|hazar|hazaar|hajar|हजार|हज़ार)/);

      if (lakhMatch) {
        updates.income = (parseFloat(lakhMatch[1]) * 100000).toString();
        incomeFound = true;
      } 
      else if (thousandMatch) {
        updates.income = (parseFloat(thousandMatch[1]) * 1000).toString();
        incomeFound = true;
      }

      if (!incomeFound) {
        // Fallback: Find largest number > 500
        const allNumbers = cleanText.match(/\d+(\.\d+)?/g);
        if (allNumbers) {
          const numericValues = allNumbers.map(n => parseFloat(n));
          const maxVal = Math.max(...numericValues);
          if (maxVal > 500) updates.income = maxVal.toString();
        }
      }
    }
    
    // --- B. AGE DETECTION ---
    const ageKeywords = ["age", "old", "year", "years", "umar", "saal", "ayu", "varsh", "baras", "janm", "उम्र", "आयु", "साल", "वर्ष", "बरस", "एज"];
    
    if (ageKeywords.some(k => cleanText.includes(k))) {
       const allNumbers = cleanText.match(/\d+/g);
       if (allNumbers) {
         const validAge = allNumbers.find(n => {
            const num = parseInt(n);
            const isNotIncome = updates.income ? (parseFloat(updates.income) !== num && parseFloat(updates.income) !== num * 100000) : true;
            return num > 10 && num < 110 && isNotIncome;
         });
         if (validAge) updates.age = validAge;
       }
    }

    // --- C. CASTE / CATEGORY (Robust List) ---
    // SC
    if (contains([
      "sc", "s c", "es si", "ac", "a c", "schedule caste", "anusuchit jati", "dalit", "harijan", 
      "एस सी", "एसी", "ए सी", "अनुसूचित जाति", "दलित", "हरिजन"
    ])) {
      updates.caste = "SC";
    }
    // ST
    else if (contains([
      "st", "s t", "es ti", "schedule tribe", "anusuchit janjati", "adivasi", "tribal", "vanvasi",
      "एस टी", "एसटी", "अनुसूचित जनजाति", "आदिवासी", "वनवासी"
    ])) {
      updates.caste = "ST";
    }
    // OBC
    else if (contains([
      "obc", "o b c", "other backward", "backward", "pichda", "pichdi", "pichhada",
      "ओबीसी", "ओ बी सी", "पिछड़ा", "पिछड़ी", "अन्य पिछड़ा"
    ])) {
      updates.caste = "OBC";
    }
    // General
    else if (contains([
      "general", "gen", "samanya", "savarn", "brahmin", "kshatriya", "upper caste", "unreserved", "open",
      "सामान्य", "सवर्ण", "जनरल", "ब्राह्मण", "क्षत्रिय", "अनारक्षित", "ओपन"
    ])) {
      updates.caste = "General";
    }

    // --- D. OCCUPATION (Robust List) ---
    // Farmer
    if (contains([
      "farmer", "farming", "kisan", "krishi", "kheti", "mazdoor", "majdoor", "agriculture", "cultivator", "hal",
      "किसान", "कृषि", "खेती", "मजदूर", "हल", "खेतिहर"
    ])) {
      updates.occupation = "Farmer";
    }
    // Student
    else if (contains([
      "student", "studying", "study", "chatra", "vidyarthi", "padhai", "school", "college", "university", "exam", "preparation", "coaching",
      "छात्र", "छात्रा", "विद्यार्थी", "पढ़ाई", "स्कूल", "कॉलेज", "यूनिवर्सिटी", "तैयारी", "कोचिंग"
    ])) {
      updates.occupation = "Student";
    }
    // Business
    else if (contains([
      "business", "businessman", "vyapar", "shop", "shopkeeper", "dukan", "dhandha", "merchant", "trade", "self employed", "owner",
      "बिज़नेस", "व्यापार", "दुकान", "दुकानदार", "धंधा", "सेल्फ एंप्लॉयड", "मालिक"
    ])) {
      updates.occupation = "Business";
    }
    // Unemployed
    else if (contains([
      "unemployed", "berojgar", "jobless", "housewife", "grahini", "homemaker", "nothing", "bekar", "no job", "search job",
      "बेरोजगार", "गृहिणी", "कुछ नहीं", "बेकार", "नौकरी नहीं", "घर"
    ])) {
      updates.occupation = "Unemployed";
    }

    // --- E. GENDER (Grammar & Keywords) ---
    if (contains([
      "female", "woman", "girl", "aurat", "mahila", "ladki", "stri", "lady", "madam", "behan", "mata", "wife",
      "महिला", "औरत", "लड़की", "स्त्री", "मैडम", "बहन", "माता", "पत्नी", "छात्रा", "गृहिणी"
    ])) {
      updates.gender = "Female";
    } 
    else if (contains([
      "male", "man", "boy", "aadmi", "purush", "ladka", "gent", "sir", "bhai", "pita", "husband",
      "आदमी", "पुरुष", "लड़का", "सर", "भाई", "पिता", "पति", "छात्र"
    ])) {
      updates.gender = "Male";
    }
    else if (contains(["other", "others", "trans", "transgender", "kinnar", "anya", "किन्नर", "अन्य", "ट्रांसजेंडर"])) {
      updates.gender = "Other";
    }
    // Grammar Inference (Hindi "Ka/Ki" rule)
    else if (cleanText.match(/(ka|tha|raha|hoon)\b|का|था|रहा|हूं/)) {
       if (cleanText.match(/ki|thi|rahi|ti|की|थी|रही|ती/)) updates.gender = "Female";
       else updates.gender = "Male";
    }

    // --- APPLY UPDATES ---
    if (Object.keys(updates).length > 0) {
      onUpdate({ ...currentData, ...updates });
      
      let details = [];
      if(updates.income) details.push(`Income: ${updates.income}`);
      if(updates.age) details.push(`Age: ${updates.age}`);
      if(updates.caste) details.push(`Caste: ${updates.caste}`);
      if(updates.occupation) details.push(`Job: ${updates.occupation}`);
      if(updates.gender) details.push(`Gender: ${updates.gender}`);
      
      toast.success(t.success, { description: details.join(" | ") });
    } else {
      toast.info(t.processing, { 
        description: `Heard: "${text}". Try adding more details.` 
      });
    }
  };

  return (
    <div className="relative overflow-hidden bg-white rounded-[2rem] p-6 border border-slate-100 shadow-xl shadow-slate-200/50 group hover:border-orange-200 transition-all">
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-100 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span className="bg-orange-100 p-2 rounded-lg text-orange-600"><Mic size={20} /></span>
            {t.title}
          </h3>
          <p className="text-xs text-slate-400 font-medium ml-1 mt-1">{t.subtitle}</p>
        </div>
        <div className="flex bg-slate-50 p-1 rounded-full border border-slate-100">
          <div className={`px-3 py-1 text-[10px] font-bold rounded-full transition-all ${lang === "en" ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 opacity-50"}`}>EN</div>
          <div className={`px-3 py-1 text-[10px] font-bold rounded-full transition-all ${lang === "hi" ? "bg-orange-500 text-white shadow-sm" : "text-slate-400 opacity-50"}`}>हिंदी</div>
        </div>
      </div>
      <div className="relative h-32 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center justify-center overflow-hidden mb-4">
        {isListening ? (
          <div className="flex items-center gap-1.5 h-12">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-1.5 bg-orange-500 rounded-full animate-pulse" style={{ height: `${Math.random() * 100}%`, animationDelay: `${i * 0.1}s` }}></div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-slate-400">
            <AudioWaveform size={32} className="opacity-20" />
            <span className="text-xs font-medium">{t.tapToSpeak}</span>
          </div>
        )}
      </div>
      <div className="min-h-[20px] mb-4 text-center">
        <p className="text-xs font-medium text-slate-500 truncate px-4">
          {transcript || (lang === "hi" ? "उदाहरण: 'मैं 20 साल का किसान हूँ'" : "Try: 'I am a 20 year old farmer'")}
        </p>
      </div>
      <button onClick={startListening} disabled={isListening} className={`w-full py-4 rounded-xl font-bold text-sm transition-all shadow-lg flex justify-center items-center gap-2 ${isListening ? "bg-rose-500 text-white shadow-rose-500/30 scale-95" : "bg-slate-900 text-white shadow-slate-900/20 hover:scale-[1.02] active:scale-[0.98]"}`}>
        {isListening ? <>Listening...</> : <><Mic size={16} /> {lang === 'hi' ? 'शुरू करें' : 'Start Recording'}</>}
      </button>
    </div>
  );
}