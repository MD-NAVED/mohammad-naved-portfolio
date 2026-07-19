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

  const { message, history } = req.body;
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

  const requestBody = {
    contents,
    systemInstruction: {
      parts: [{
        text: `You are the AI portfolio agent for Mohammad Naved, an Applied AI & Prompt Engineer. 
Your goal is to answer visitor questions in a friendly, technical, and professional manner.
Be concise and brief in your responses (max 2-3 sentences), formatted cleanly for a terminal window.

You have access to interactive frontend tools. Trigger them when appropriate:
1. To show Naved's projects or navigate the site: Call navigate_site(section).
2. To download his resume: Call download_resume().
3. To change theme mode: Call toggle_theme(mode).
4. To send Naved an email: Call send_email(name, email, message).

Naved's Details:
- Email: andyk4548@gmail.com
- Phone: +91 9753880839
- LinkedIn: linkedin.com/in/md-naved-2b79b8382
- Projects: 
  * 4Layers (Smart Home IoT Solution built with React Native, FastAPI, MQTT, PostgreSQL, Docker)
  * AutoApply AI (Job application automation tool using Python and LLM prompt chaining)
  * DataLens AI (Full-stack AI analytics platform converting English questions to SQL queries using Gemini)`
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
          description: "Navigate the portfolio page to a specific section.",
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
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
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
      return res.status(502).json({ error: 'Error communicating with Gemini API' });
    }

    const data = await response.json();
    const candidate = data.candidates?.[0];
    const content = candidate?.content;
    const text = content?.parts?.[0]?.text || '';
    const functionCall = content?.parts?.[0]?.functionCall || null;

    res.status(200).json({
      text,
      toolCall: functionCall
    });
  } catch (error) {
    console.error('Serverless function error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
