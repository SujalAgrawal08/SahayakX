<div align="center">

# 🏛️ SahayakX

### The AI-Powered Government Scheme Super App

[![Next.js](https://img.shields.io/badge/Next.js-14-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-FF6B35?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-1A1A1A?style=for-the-badge&logo=mongodb&logoColor=FF6B35)](https://www.mongodb.com/atlas)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-FF8C69?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)



*🧡 Bridging the gap between Indian citizens and government welfare schemes through AI 🧡*

<p align="center">
  <a href="https://sahayakx.vercel.app">
    <img src="https://img.shields.io/badge/🌐_Live_Demo-FF6B35?style=for-the-badge&logoColor=white" alt="Live Demo"/>
  </a>
  &nbsp;&nbsp;
  <a href="../../issues">
    <img src="https://img.shields.io/badge/🐛_Report_Bug-1A1A1A?style=for-the-badge&logoColor=FF6B35" alt="Report Bug"/>
  </a>
  &nbsp;&nbsp;
  <a href="../../issues">
    <img src="https://img.shields.io/badge/✨_Request_Feature-E8998D?style=for-the-badge&logoColor=white" alt="Request Feature"/>
  </a>
</p>

---

</div>

## 🎯 About

<div align="center">
<img src="assets/SahayakX_Home.png" alt="Home Page" width="80%" />
</br>
<img src="assets/SahayakX_Dashboard.png" alt="Dashboard" width="80%" />
</div>

<br/>

**SahayakX** is a Next-Gen "Super App" designed to democratize access to government welfare schemes for Indian citizens. By leveraging cutting-edge AI technologies, we simplify:

<div align="center">

| 🔍 | ✅ | 📝 | 🗣️ |
|:---:|:---:|:---:|:---:|
| **Scheme Discovery** | **Eligibility Verification** | **Application Assistance** | **Voice Accessibility** |
| Find relevant schemes instantly | Auto-verify using document analysis | Step-by-step guidance | Breaking literacy barriers |

</div>

> *"🧡 Making government benefits accessible to every citizen, regardless of their technical literacy."*

---

## ✨ Features

### Core Features Grid

<table>
<tr>
<td width="33%" valign="top">

### 🔐 Authentication
Secure Google OAuth 2.0 with encrypted JWT sessions and protected routes

</td>
<td width="33%" valign="top">

### 👁️ Project Netra
Intelligent OCR-powered document analysis for auto-eligibility verification

</td>
<td width="33%" valign="top">

### 🤖 Sahayak Sarathi
Bilingual AI chatbot with RAG + knowledge fallback system

</td>
</tr>
<tr>
<td width="33%" valign="top">

### 🎙️ Project Vaani
Voice interface breaking literacy barriers with speech-to-text

</td>
<td width="33%" valign="top">

### 📍 Sahayak Kendra
Geo-locator for finding nearby help centers and CSCs

</td>
<td width="33%" valign="top">

### 🔒 Doc Vault
Encrypted digital locker for verified documents

</td>
</tr>
<tr>
<td width="33%" valign="top">

### 📢 Jan-Manch
Community forum with AI-powered moderation

</td>
<td width="33%" valign="top">

### 📈 Analytics Engine
Real-time impact tracking and demand visualization

</td>
<td width="33%" valign="top">

### 📊 Dashboard
Comprehensive platform intelligence & insights

</td>
</tr>
</table>

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|:------|:-----------|:--------|
| **Framework** | Next.js 14 (App Router) | Full-stack SSR & API routes |
| **Language** | TypeScript | Type-safe development |
| **Styling** | Tailwind CSS | Glassmorphism UI design |
| **Database** | MongoDB Atlas | Schemes, users & logs storage |
| **Auth** | NextAuth.js v4 | Google OAuth implementation |
| **AI/LLM** | Groq (Llama-3-70b) | Ultra-fast NLP inference |
| **OCR** | Tesseract.js | Server-side document scanning |
| **Deployment** | Vercel | Serverless edge hosting |

---

## 🏗️ Architecture

### 1. Authentication Flow

```mermaid
graph LR
    A[User] -->|Login| B[Google OAuth]
    B -->|Callback| C[NextAuth.js]
    C -->|Create| D[JWT Session]
    D -->|Protect| E[Dashboard/Chatbot]
```

### 2. Project Netra — Document Analysis Pipeline
```
┌─────────────┐     ┌──────────────┐      ┌─────────────┐      ┌──────────────┐
│   Upload    │────▶│  Tesseract   │────▶│   Llama-3   │────▶│  Structured  │
│  Document   │     │  OCR Engine  │      │  Processing │      │    JSON      │
└─────────────┘     └──────────────┘      └─────────────┘      └──────────────┘
     PDF/Image         Raw Text            AI Extraction          Clean Data
```

