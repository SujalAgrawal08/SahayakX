import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Scheme from '@/models/Scheme';

export async function POST(req: Request) {
  try {
    // 1. Connect
    await mongoose.connect(process.env.MONGODB_URI!);

    // 2. Normalize User Data
    const body = await req.json();
    
    // Ensure numbers are numbers, strings are strings
    const age = Number(body.age) || 18;
    const income = Number(body.income) || 0;
    const gender = body.gender || "Male";
    const caste = body.caste || "General";
    const occupation = body.occupation || "Unemployed";
    const state = body.state || "India";

    console.log("🔍 Checking Eligibility:", { age, income, gender, occupation, state });

    // 3. THE FIX: Query matching 'seed.ts' structure
    const query = {
      // Numerical Logic: User age must be within Scheme range
      age_min: { $lte: age },
      age_max: { $gte: age },

      // Income Logic: User income must be LESS than Scheme limit
      income_max: { $gte: income },

      // Enum Logic: Scheme gender must be 'All' OR match user
      gender: { $in: ["All", gender] },

      // Geography: Scheme must be 'India' OR match user's state
      state: { $in: ["India", state] },

      // Array Logic: 
      // In Mongoose, if 'caste' is an array ["General", "OBC"], 
      // querying { caste: "General" } automatically checks if it exists in the array.
      caste: caste,
      occupation: occupation 
    };

    // 4. Execute
    const eligibleSchemes = await Scheme.find(query).limit(10);

    // 5. Find "Ineligible" (Close matches) for preview
    // Finds schemes for the user's state that didn't meet strict criteria
    const ineligibleSchemes = await Scheme.find({
      state: { $in: ["India", state] },
      _id: { $nin: eligibleSchemes.map(s => s._id) }
    }).limit(3).select('name');

    return NextResponse.json({
      summary: `Found ${eligibleSchemes.length} schemes matching your profile.`,
      eligible: eligibleSchemes,
      ineligible_preview: ineligibleSchemes.map(s => ({ name: s.name, reason: "Criteria mismatch" }))
    });

  } catch (error) {
    console.error("Eligibility API Error:", error);
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }
}