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
        text: `You are the AI portfolio agent for Mohammad Naved, an Applied AI & Prompt Engineer. 
Your goal is to answer visitor questions in a friendly, conversational, and professional manner.
Be concise (max 2-3 sentences per paragraph), and format your text with clean paragraph breaks (\n\n) to simulate separate chat messages.
${viewContext}

You have access to interactive frontend tools. Trigger them ONLY when explicitly requested:
1. To navigate the page: Call navigate_site(section). ONLY call this if the user explicitly asks to go to a section (e.g. "go to projects", "show me your contacts page"). Do NOT call this for general questions like "tell me about your skills" or "what projects have you built".
2. To download his resume: Call download_resume(). ONLY call this if the user explicitly asks to download or get his CV/resume.
3. To change theme mode: Call toggle_theme(mode).
4. To send Naved an email: Call send_email(name, email, message).

Naved's Details:
- Name: Mohammad Naved
- Role: Applied AI & Prompt Engineer
- Email: andyk4548@gmail.com
- Phone: +91 9753880839
- LinkedIn: linkedin.com/in/md-naved-2b79b8382
- Core Competencies: Prompt Design, Agentic Workflows, LLM Orchestration, Few-Shot Prompting, Schema Enforcement, Instruction Debugging, n8n, LangChain, Python, SQL, DuckDB, React, TypeScript.
- Certifications & Learning:
  * Python for Data Analysis & Visualization (Self-directed)
  * Generative AI with Gemini (Prompt Engineering)
  * SQL for Data Analytics (Relational Database Workflows)
  * Power BI (Interactive Dashboard Design & Reporting)
- Languages: English (Professional), Hindi (Native)
- Freelance Pricing:
  * Hourly Collaboration: $25 - $35 / Hour (for debugging, consulting, ad-hoc prompt tuning)
  * Project-Based: Custom packages for end-to-end AI applications & automation pipelines
- Projects: 
  * 4Layers (Smart Home IoT Solution built with React Native/Expo, FastAPI, MQTT, PostgreSQL, Docker)
  * AutoApply AI (Job application automation tool using Python and LLM prompt chaining)
  * DataLens AI (Full-stack AI analytics platform converting English questions to SQL queries using Gemini)
  * Interactive Portfolio & PDF Automation Pipeline (React, TS, Framer Motion, Node.js, Puppeteer, Tailwind)`
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
          description: "Navigate the portfolio page to a specific section. ONLY call this when the user explicitly requests to go/navigate to a page or section (e.g. 'go to contact page', 'navigate to projects'). Do NOT call for general info queries.",
          parameters: {
            type: 'OBJECT',
            properties: {
              section: {
                type: 'STRING',
                enum: ['home', 'projects', 'experience', 'contact'],
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
