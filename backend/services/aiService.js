import { GoogleGenerativeAI } from '@google/generative-ai';

class AIService {
  constructor() {
    this.geminiApiKey = process.env.GEMINI_API_KEY;
    this.openaiApiKey = process.env.OPENAI_API_KEY;
    this.provider = process.env.AI_PROVIDER || 'gemini';

    this.gemini = null;
    this.model = null;
    this._resolvedGemini = null;

    if (this.provider === 'gemini' && this.geminiApiKey) {
      this.gemini = new GoogleGenerativeAI(this.geminiApiKey);
    }
  }

  _normalizeModelId(modelNameOrId) {
    if (!modelNameOrId) return null;
    return modelNameOrId.startsWith('models/') ? modelNameOrId.slice('models/'.length) : modelNameOrId;
  }

  async _listGeminiModels(apiVersion) {
    const url = `https://generativelanguage.googleapis.com/${apiVersion}/models?key=${this.geminiApiKey}`;
    const res = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`ListModels failed (${res.status}) for ${apiVersion}: ${text}`);
    }

    const data = await res.json();
    const models = Array.isArray(data?.models) ? data.models : [];
    return models
      .filter((m) => Array.isArray(m?.supportedGenerationMethods) && m.supportedGenerationMethods.includes('generateContent'))
      .map((m) => ({
        name: m.name,
        displayName: m.displayName,
      }));
  }

  _pickBestGeminiModel(modelEntries) {
    // Prefer cheapest/fast models first; fall back to any available model supporting generateContent.
    const preferredIds = [
      'gemini-2.0-flash',
      'gemini-1.5-flash-latest',
      'gemini-1.5-flash',
      'gemini-1.5-flash-8b',
      'gemini-1.5-pro-latest',
      'gemini-1.5-pro',
      'gemini-1.0-pro',
      'gemini-pro',
    ];

    for (const preferred of preferredIds) {
      const match = modelEntries.find((m) => this._normalizeModelId(m.name) === preferred);
      if (match) return this._normalizeModelId(match.name);
    }

    const first = modelEntries[0];
    return first ? this._normalizeModelId(first.name) : null;
  }

  async _resolveGeminiModel() {
    if (this._resolvedGemini) return this._resolvedGemini;

    const apiVersionsToTry = ['v1', 'v1beta'];
    let lastError = null;

    for (const apiVersion of apiVersionsToTry) {
      try {
        const modelEntries = await this._listGeminiModels(apiVersion);
        const modelId = this._pickBestGeminiModel(modelEntries);
        if (modelId) {
          this._resolvedGemini = { apiVersion, modelId };
          return this._resolvedGemini;
        }
      } catch (err) {
        lastError = err;
      }
    }

    if (lastError) {
      throw lastError;
    }
    throw new Error('No Gemini models available for generateContent');
  }

  async generateCompletion(prompt, options = {}) {
    const { maxTokens = 1000, temperature = 0.7 } = options;

    try {
      if (this.provider === 'gemini' && this.gemini) {
        return await this.generateWithGemini(prompt, { maxTokens, temperature });
      } else if (this.provider === 'openai' && this.openaiApiKey) {
        return await this.generateWithOpenAI(prompt, { maxTokens, temperature });
      } else {
        throw new Error('No AI provider configured. Please set GEMINI_API_KEY or OPENAI_API_KEY');
      }
    } catch (error) {
      console.error('AI generation error:', error);
      throw error;
    }
  }

  async generateWithGemini(prompt, options) {
    const { temperature } = options;

    if (!this.geminiApiKey) {
      throw new Error('GEMINI_API_KEY is not set');
    }

    const generationConfig = {
      temperature,
      maxOutputTokens: options.maxTokens,
    };

    const callGemini = async (apiVersion, modelId) => {
      const url = `https://generativelanguage.googleapis.com/${apiVersion}/models/${modelId}:generateContent?key=${this.geminiApiKey}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        const statusCode = res.status;
        
        // Check for quota/rate limit errors
        if (statusCode === 429 || statusCode === 503) {
          const err = new Error(`Gemini API quota/rate limit (${statusCode}) - Please try again later`);
          err.status = statusCode;
          err.isQuotaError = true;
          throw err;
        }
        
        const err = new Error(`Gemini API error (${statusCode}) using ${apiVersion}/${modelId}: ${text}`);
        err.status = statusCode;
        throw err;
      }

      const data = await res.json();
      const parts = data?.candidates?.[0]?.content?.parts;
      const text = Array.isArray(parts)
        ? parts
            .map((p) => (typeof p?.text === 'string' ? p.text : ''))
            .join('')
        : '';
      if (typeof text === 'string' && text.trim().length > 0) {
        return text;
      }
      throw new Error(`Gemini response missing text using ${apiVersion}/${modelId}`);
    };

    // First try with auto-discovered model.
    try {
      const { apiVersion, modelId } = await this._resolveGeminiModel();
      return await callGemini(apiVersion, modelId);
    } catch (err) {
      // If model disappeared or cache got stale, clear and retry discovery once.
      if (err?.status === 404) {
        this._resolvedGemini = null;
        const { apiVersion, modelId } = await this._resolveGeminiModel();
        return await callGemini(apiVersion, modelId);
      }

      // Fallback: try a known set if ListModels is blocked.
      const apiVersionsToTry = ['v1', 'v1beta'];
      const modelsToTry = [
        'gemini-2.0-flash',
        'gemini-1.5-flash-latest',
        'gemini-1.5-flash',
        'gemini-1.5-flash-8b',
        'gemini-1.5-pro-latest',
        'gemini-1.5-pro',
        'gemini-1.0-pro',
        'gemini-pro'
      ];

      let lastError = err;
      for (const apiVersion of apiVersionsToTry) {
        for (const model of modelsToTry) {
          try {
            return await callGemini(apiVersion, model);
          } catch (e) {
            console.log(`Model ${model} failed with ${e?.status}: ${e?.message?.substring(0, 100)}`);
            lastError = e;
            
            // If quota error, stop trying and throw immediately
            if (e?.isQuotaError) {
              throw e;
            }
          }
        }
      }
      throw lastError;
    }
  }

  async generateWithOpenAI(prompt, options) {
    const { maxTokens, temperature } = options;
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.openaiApiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: maxTokens,
        temperature,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  async validateWorkflow(workflow) {
    const prompt = `You are a workflow automation expert. Analyze the following workflow for potential issues, overlaps, infinite loops, or invalid configurations.

Workflow:
${JSON.stringify(workflow, null, 2)}

Provide a structured analysis. Use this exact format:

STATUS: VALID or INVALID

ISSUES:
- [type] | [severity] | [description] | [nodeId or "none"]
- (repeat for each issue, or write "None" if no issues)

SUGGESTIONS:
- [priority] | [description]
- (repeat for each suggestion, or write "None" if no suggestions)

Example:
STATUS: INVALID
ISSUES:
- cycle | HIGH | Infinite loop detected between nodes | node-123
- missing_connection | MEDIUM | Node is not connected to any output | node-456
SUGGESTIONS:
- HIGH | Remove the cycle by disconnecting one edge
- LOW | Consider adding error handling nodes`;

    let response;
    try {
      response = await this.generateCompletion(prompt, {
        maxTokens: 1500,
        temperature: 0.3
      });
    } catch (error) {
      return {
        status: 'INVALID',
        issues: [
          {
            type: 'other',
            severity: 'MEDIUM',
            description: `AI validation unavailable: ${error?.message || 'unknown error'}`,
            nodeId: null
          }
        ],
        suggestions: [
          {
            description: 'Try again later, or configure OPENAI_API_KEY and set AI_PROVIDER=openai as a fallback.',
            priority: 'LOW'
          }
        ]
      };
    }

    try {
      const lines = response.split('\n').map(l => l.trim());
      
      let status = 'VALID';
      const issues = [];
      const suggestions = [];
      let section = null;
      
      for (const line of lines) {
        if (line.startsWith('STATUS:')) {
          status = line.replace('STATUS:', '').trim().toUpperCase() === 'INVALID' ? 'INVALID' : 'VALID';
        } else if (line === 'ISSUES:') {
          section = 'issues';
        } else if (line === 'SUGGESTIONS:') {
          section = 'suggestions';
        } else if (line.startsWith('-') && section === 'issues' && line !== '- None') {
          const parts = line.substring(1).split('|').map(p => p.trim());
          if (parts.length >= 3) {
            let nodeId = parts[3];
            // If nodeId is "none" or empty, default to first trigger node (most common issue location)
            if (!nodeId || nodeId === 'none' || nodeId === '') {
              nodeId = workflow?.nodes?.[0]?.id || null;
            }
            issues.push({
              type: parts[0] || 'other',
              severity: parts[1] || 'MEDIUM',
              description: parts[2] || 'Unknown issue',
              nodeId: nodeId
            });
          }
        } else if (line.startsWith('-') && section === 'suggestions' && line !== '- None') {
          const parts = line.substring(1).split('|').map(p => p.trim());
          if (parts.length >= 2) {
            suggestions.push({
              priority: parts[0] || 'MEDIUM',
              description: parts[1] || 'Unknown suggestion'
            });
          }
        }
      }
      
      return {
        status,
        issues,
        suggestions
      };
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      return {
        status: 'VALID',
        issues: [],
        suggestions: [],
        rawResponse: response
      };
    }
  }

  async craftEmailResponse(emailContext, conditions = {}) {
    const prompt = `You are an AI email assistant. Based on the following email context and conditions, craft a professional email response.

Email Context:
${JSON.stringify(emailContext, null, 2)}

Conditions:
${JSON.stringify(conditions, null, 2)}

Generate an email response that:
1. Addresses the sender professionally
2. Responds to their inquiry based on the conditions provided
3. Maintains a friendly but professional tone
4. Includes relevant information from the context
5. Has a clear call-to-action if needed

Format your response as JSON:
{
  "subject": "Email subject line",
  "body": "Email body text",
  "tone": "professional|friendly|formal",
  "confidence": 0.0-1.0
}`;

    const response = await this.generateCompletion(prompt, { 
      maxTokens: 800, 
      temperature: 0.7 
    });

    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return JSON.parse(response);
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      return {
        subject: 'Re: Your inquiry',
        body: response,
        tone: 'professional',
        confidence: 0.5
      };
    }
  }

  async generateWorkflowGuidance(userQuery, workflowContext = {}) {
    const prompt = `You are a workflow automation assistant. A user needs help with their workflow automation.

User Query: ${userQuery}

Workflow Context:
${JSON.stringify(workflowContext, null, 2)}

Provide helpful guidance that:
1. Directly answers their question
2. Suggests best practices
3. Warns about potential pitfalls
4. Provides step-by-step instructions if needed

Keep your response concise, actionable, and friendly.`;

    const response = await this.generateCompletion(prompt, { 
      maxTokens: 600, 
      temperature: 0.8 
    });

    return {
      guidance: response,
      timestamp: new Date().toISOString()
    };
  }

  async extractEmailData(emailContent) {
    const prompt = `Extract key information from the following email:

${emailContent}

Extract and return as JSON:
{
  "sender": "sender email or name",
  "subject": "email subject",
  "intent": "what the sender wants (inquiry|complaint|request|feedback|other)",
  "keyPoints": ["list of key points from email"],
  "urgency": "HIGH|MEDIUM|LOW",
  "requiresAction": true or false,
  "suggestedActions": ["list of suggested actions"]
}`;

    const response = await this.generateCompletion(prompt, { 
      maxTokens: 800, 
      temperature: 0.3 
    });

    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return JSON.parse(response);
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      return {
        sender: 'Unknown',
        subject: 'Unknown',
        intent: 'other',
        keyPoints: [],
        urgency: 'MEDIUM',
        requiresAction: false,
        suggestedActions: []
      };
    }
  }
}

export default new AIService();
