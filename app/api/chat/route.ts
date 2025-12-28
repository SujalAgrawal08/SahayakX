// import { NextResponse } from 'next/server';
// import Groq from "groq-sdk";
// import mongoose from 'mongoose';
// import Scheme from '@/models/Scheme';

// const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// export async function POST(req: Request) {
//   try {
//     const { message, history } = await req.json();

//     // 1. RETRIEVAL
//     const keywords = message.split(" ").filter((w: string) => w.length > 3);
    
//     await mongoose.connect(process.env.MONGODB_URI!);
    
//     const relevantSchemes = await Scheme.find({
//       $or: [
//         { name: { $regex: keywords.join("|"), $options: "i" } },
//         { description: { $regex: keywords.join("|"), $options: "i" } },
//         { occupation: { $regex: keywords.join("|"), $options: "i" } }
//       ]
//     }).limit(3).select('name description benefits');

//     // 2. AUGMENTATION
//     const contextText = relevantSchemes.map((s: any) => {
//       const benefitsList = Array.isArray(s.benefits) ? s.benefits.join(", ") : "See details.";
//       return `- Scheme: ${s.name}\n  Details: ${s.description}\n  Benefits: ${benefitsList}`;
//     }).join("\n\n");

//     const systemPrompt = `
//       You are 'Sahayak Sarathi', an AI expert on Indian Government Schemes.
      
//       CONTEXT FROM DATABASE:
//       ${contextText || "No specific schemes found for this query. Provide general advice."}

//       USER QUERY: "${message}"

//       INSTRUCTIONS:
//       1. Answer strictly based on the Context provided.
//       2. If the Context contains the answer, mention the scheme name.
//       3. If no relevant context is found, politely say you don't have that specific info but offer general guidance.
//       4. Keep answers concise (under 100 words).
//     `;

//     // --- FIX STARTS HERE ---
//     // Sanitize history: Remove 'sources' or any other custom fields before sending to Groq
//     const cleanHistory = history.map((msg: any) => ({
//       role: msg.role,
//       content: msg.content
//     }));
//     // --- FIX ENDS HERE ---

//     // 3. GENERATION
//     const chatCompletion = await groq.chat.completions.create({
//       messages: [
//         { role: "system", content: systemPrompt },
//         ...cleanHistory, // Use the sanitized history
//         { role: "user", content: message }
//       ],
//       model: "llama-3.3-70b-versatile",
//       temperature: 0.5,
//     });

//     return NextResponse.json({ 
//       reply: chatCompletion.choices[0]?.message?.content,
//       sources: relevantSchemes 
//     });

//   } catch (error: any) {
//     console.error("RAG Error:", error);
//     return NextResponse.json({ 
//       reply: "I am currently experiencing high traffic. Please try asking again in a moment.",
//       sources: []
//     });
//   }
// }

import { NextResponse } from 'next/server';
import Groq from "groq-sdk";
import mongoose from 'mongoose';
import Scheme from '@/models/Scheme';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();

    // 1. SEARCH: Keyword Matching
    // We split user query into words to find partial matches
    const keywords = message.split(" ").filter((w: string) => w.length > 3);
    const regexQuery = keywords.join("|");

    await mongoose.connect(process.env.MONGODB_URI!);
    
    // Search in Name, Description, and Occupation
    const relevantSchemes = await Scheme.find({
      $or: [
        { name: { $regex: regexQuery, $options: "i" } },
        { description: { $regex: regexQuery, $options: "i" } },
        { occupation: { $in: [new RegExp(regexQuery, "i")] } } // Check inside array
      ]
    }).limit(3);

    // 2. CONTEXT PREP (The "Crash Fix")
    const contextText = relevantSchemes.map((s: any) => {
      // Safe access to arrays
      const ben = Array.isArray(s.benefits) ? s.benefits.join(", ") : "Various benefits";
      const docs = Array.isArray(s.required_docs) ? s.required_docs.join(", ") : "Standard ID proofs";
      
      return `
      - Scheme Name: ${s.name}
        Description: ${s.description}
        Benefits: ${ben}
        Requirements: Age ${s.age_min}-${s.age_max}, Income < ₹${s.income_max}
        Documents: ${docs}
      `;
    }).join("\n\n");

    const systemPrompt = `
      You are 'Sahayak', a government scheme expert.
      
      RETRIEVED DATA:
      ${contextText || "No specific schemes found in database."}

      USER QUESTION: "${message}"

      INSTRUCTIONS:
      1. Answer using ONLY the retrieved data above.
      2. If the user asks about a scheme not in the data, provide general advice but mention you lack specific details.
      3. Be concise and helpful.
    `;

    // 3. SANITIZE HISTORY (Fixes Groq API Error)
    const cleanHistory = history.map((msg: any) => ({
      role: msg.role === 'user' ? 'user' : 'assistant', // Strict role enforcement
      content: msg.content
    }));

    // 4. GENERATE
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        ...cleanHistory,
        { role: "user", content: message }
      ],
      model: "llama-3.3-70b-versatile", // Use the stable model
      temperature: 0.3, // Lower temperature = more factual
    });

    return NextResponse.json({ 
      reply: chatCompletion.choices[0]?.message?.content,
      sources: relevantSchemes 
    });

  } catch (error: any) {
    console.error("Chat Error:", error);
    return NextResponse.json({ 
      reply: "I am having trouble accessing the scheme database right now. Please try again.",
      sources: []
    });
  }
}