import { URL } from 'url';

export default async function handler(req, res) {
  // CORS configuration
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, history, currentView } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Gemini API key is not configured on the server' });
  }

  // Format request contents history for Gemini API
  const contents = [];
  if (history && Array.isArray(history)) {
    history.forEach(msg => {
      contents.push({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      });
    });
  }
  
  // Add the current user message
  contents.push({
    role: 'user',
    parts: [{ text: message }]
  });

  const viewContext = currentView ? `\nThe visitor is currently looking at the '${currentView}' section of your portfolio. If they ask context-dependent questions like "tell me about this page", "what is this section", or "what is here", they are referring to the '${currentView}' page, so explain it directly in the chat.` : '';

  const requestBody = {
    contents,
    systemInstruction: {
      parts: [{
        text: `You are the AI portfolio & studio agent for Mohammad Naved — Founder & Lead AI Engineer at Codtrex AI | Product Architect.
Your goal is to answer visitor questions in a friendly, crisp, and high-caliber professional manner.
Be concise (max 2-3 sentences per paragraph), and format your text with clean paragraph breaks (\n\n) to simulate separate chat messages.
${viewContext}

You have access to interactive frontend tools. Trigger them ONLY when explicitly requested:
1. To navigate the page: Call navigate_site(section). ONLY call this if the user explicitly asks to go to a section (e.g. "go to projects", "show me your services", "show me your contacts page"). Do NOT call this for general questions like "tell me about your skills" or "what projects have you built".
2. To download his resume: Call download_resume(). ONLY call this if the user explicitly asks to download or get his CV/resume.
3. To change theme mode: Call toggle_theme(mode).
4. To send Naved an email: Call send_email(name, email, message).

Naved's Profile & Studio Overview:
- Name: Mohammad Naved
- Role: Founder & Lead AI Engineer @ Codtrex AI | Full-Stack Product Architect
- Studio Website: https://codtrex.vercel.app (Codtrex AI — Boutique AI Engineering Studio)
- Email: andyk4548@gmail.com | Studio: contact.codtrexai@gmail.com
- Phone / WhatsApp: +91 9753880839
- GitHub: https://github.com/MD-NAVED
- LinkedIn: https://www.linkedin.com/in/md-naved-2b79b8382
- Core Competencies: Autonomous AI Agents, Production LLM Orchestration, Full-Stack SaaS Architecture (Next.js, React 19, Supabase, Node/FastAPI), IoT Cloud Systems (ESP32, MQTT, Google Home Certification), Database & Security Design.

Flagship Products & Ventures:
1. Codtrex AI (Founder & Lead Architect)
   - Live Studio: https://codtrex.vercel.app
   - Boutique AI Engineering Studio building high-performance MVPs, custom LLM workflows, and intelligent software.
2. SmartNest (4Layers IoT Ecosystem) (Lead IoT & Cloud Systems Architect)
   - Production-grade smart home IoT platform connecting custom ESP32 hardware (4-relay boards + triac fan speed controller) to AWS Cloud and Google Assistant ecosystem.
   - Achieved Official Google Smart Home Action Certification passing 71+/75 automated test cases with RFC 6749 OAuth 2.0, SYNC/QUERY/EXECUTE, and bi-directional HomeGraph state synchronization.
   - 3-Source State Synchronization: Mobile App (React Native Expo), 433MHz RF Remote, and physical wall switches synchronized in real-time using AWS IoT Device Shadows (mTLS 8883) as single source of truth.
   - Hard problems solved: QA Hold Mode with 10-min TTL to suppress heartbeat race conditions during Google certification; 4-layer fan speed divergence fix (PostgreSQL JSON column dirty-tracking via flag_modified); production-grade OTA 2.0 dual-partition (A/B) flashing with auto-retry on AWS App Runner & Docker.
3. MediStock (Founder, Product Architect & Full-Stack Engineer)
   - Live Production: https://medistock-pharma.vercel.app | Founder Admin: https://medistock-admin.vercel.app
   - Cloud-native B2B Pharmacy Management & POS SaaS built with React 18, Supabase, Tailwind, Node.js, Capacitor Android.
   - Key highlights: Sub-300ms barcode billing, 100,000+ medicine catalog with automated company logo engine, HMAC-signed founder store impersonation, WhatsApp invoice dispatch, and offline POS resilience.
4. UsedTech Market (Product Architect & Full-Stack Engineer)
   - Verified pre-owned computer hardware marketplace across 18 component categories with fair-price benchmark engine and WhatsApp-direct buyer-seller deal matching.
   - Built on Next.js 16, Prisma SQLite, TanStack Query, Zustand, Tailwind v4.
5. AutoApply AI & DataLens AI (Full-stack AI workflows & conversational data platforms).

Engagement & Collaboration Models (For Companies & Founders):
- Full-Time Senior / Founding Engineer: Open to high-ownership core roles at startups and ambitious tech teams building SaaS, autonomous AI agents, or scalable cloud systems.
- Fractional Systems Architect / Tech Lead: Strategic 20–40 hrs/month architecture consulting and AI roadmapping for seed & Series A teams.
- Technical Audits & Deep Sprints: 1–2 week high-impact problem solving (prompt debugging, sub-300ms latency tuning, IoT firmware failsafes).
- Turnkey Agency Projects: For clients seeking end-to-end outsourced studio builds, direct them to his boutique studio at https://codtrex.vercel.app.`
      }]
    },
    tools: [{
      functionDeclarations: [
        {
          name: 'download_resume',
          description: "Download Naved's 2-page print-ready PDF resume in the visitor's browser."
        },
        {
          name: 'toggle_theme',
          description: "Toggle the website theme between light and dark mode.",
          parameters: {
            type: 'OBJECT',
            properties: {
              mode: {
                type: 'STRING',
                enum: ['light', 'dark'],
                description: 'The theme mode to switch to.'
              }
            },
            required: ['mode']
          }
        },
        {
          name: 'send_email',
          description: "Send an email message or contact request directly to Naved.",
          parameters: {
            type: 'OBJECT',
            properties: {
              name: { type: 'STRING', description: 'Name of the sender.' },
              email: { type: 'STRING', description: 'Email address of the sender.' },
              message: { type: 'STRING', description: 'The message body.' }
            },
            required: ['name', 'email', 'message']
          }
        },
        {
          name: 'navigate_site',
          description: "Navigate the portfolio page to a specific section. ONLY call this when the user explicitly requests to go/navigate to a page or section (e.g. 'go to contact page', 'navigate to projects', 'show me services'). Do NOT call for general info queries.",
          parameters: {
            type: 'OBJECT',
            properties: {
              section: {
                type: 'STRING',
                enum: ['home', 'projects', 'experience', 'services', 'contact'],
                description: 'The section to navigate to.'
              }
            },
            required: ['section']
          }
        }
      ]
    }]
  };

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API Error:', errorText);
      return res.status(502).json({ error: 'Error communicating with Gemini API', details: errorText });
    }

    const data = await response.json();
    const candidate = data.candidates?.[0];
    const content = candidate?.content;
    const text = content?.parts?.[0]?.text || '';
    const functionCall = content?.parts?.[0]?.functionCall || null;

    // Fire-and-forget: Log the recruiter conversation to Discord
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (webhookUrl) {
      const now = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
      const toolUsed = functionCall ? `\n🔧 **Tool Triggered:** \`${functionCall.name}\`` : '';
      const discordPayload = {
        username: "Portfolio AI Logger",
        avatar_url: "https://cdn-icons-png.flaticon.com/512/4712/4712101.png",
        embeds: [{
          title: "🧠 New Recruiter Interaction",
          color: 7419530, // Indigo color
          fields: [
            {
              name: "📌 Page",
              value: currentView ? `\`${currentView}\`` : "`home`",
              inline: true
            },
            {
              name: "🕐 Time (IST)",
              value: now,
              inline: true
            },
            {
              name: "❓ Recruiter Asked",
              value: `> ${message.substring(0, 300)}${message.length > 300 ? '...' : ''}`,
              inline: false
            },
            {
              name: `🤖 AI Responded${toolUsed}`,
              value: text ? text.substring(0, 500) + (text.length > 500 ? '...' : '') : '_[Tool only response]_',
              inline: false
            }
          ],
          footer: { text: "Mohammad Naved — Portfolio AI Agent" }
        }]
      };

      // Non-blocking: don't await so it doesn't slow down the response
      fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(discordPayload)
      }).catch(err => console.error('Discord webhook error:', err));
    }

    res.status(200).json({
      text,
      toolCall: functionCall
    });
  } catch (error) {
    console.error('Serverless function error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
