# Lead AI Agent

This project is a modular, industry-agnostic AI-powered lead qualification system. It simulates human-like conversation to gather lead information, classify their intent, and generate structured metadata using LLMs (like Gemini via Langchain).

## Features

- 🔁 CLI and API support for AI-driven lead qualification
- 🧠 LLM-powered conversation using smart prompts
- 🧩 Industry-specific configuration support
- ✅ Lead classification (Hot, Cold, Invalid)
- 📝 Metadata extraction (location, budget, property type, etc.)
- 🧾 Persistent session manager with summaries and transcripts
- 🖥️ Web dashboard using React + Vite
- 🔐 Gemini LLM support via `@langchain/google-genai`

# Project Setup Guide

Follow these steps to get the Lead Qualification AI Agent up and running.

## Clone the Repository

```bash
git clone git@github.com:subharthihazra/lead-agent.git
cd lead-agent
```

## Install Dependencies

```bash
npm install
```

## Get Your Gemini API Key

Go to Google AI Studio

Generate an API key

Copy it for use in `.env` (for reference look at `.env.example`)

Configure your agent profile in `/config/profiles.json`

Set your industry and location of agent in env

## Install React Web Interface

```bash
cd web
npm install
```

Add .env inside web/ to match your API server (for reference look at `.env.example`)

## Run CLI Mode

```bash
npm run start:cli
```

## Run API

```bash
npm run start:api
```

## Run web interface

```bash
npm run start:web
```

## Demo Config

```json
[
  {
    "industry": "real-estate",
    "location": "india",
    "qualifyingQuestions": [
      "Which city or locality are you interested in?",
      "Is this for personal use or investment?",
      "What type of property are you looking for — apartment, villa, or plot?",
      "What is your budget range?",
      "How soon are you planning to purchase or move?"
    ],
    "rules": {
      "classification": "Classify based on the user's clarity, intent, and responsiveness.\n\n- If the user clearly provides budget, location, property type, purpose, and shows urgency (e.g. mentions a specific timeframe like 'within 2 months'), classify as 'Hot'.\n- If the user is vague, undecided, browsing casually, or non-committal, classify as 'Cold'.\n- If the message is spam, off-topic, contains gibberish, or lacks meaningful information about real estate intent, classify as 'Invalid'.\n\nAlways include a clear reason in the output.",
      "metadataFormat": {
        "location": "City or locality mentioned by the user, e.g., 'Kolkata, Salt Lake' or 'Bangalore, Whitefield'.",
        "budget": "Mentioned budget or price range, e.g., '60L-80L', 'under 1Cr', or 'around 50 lakhs'.",
        "property_type": "Type of property desired, e.g., 'flat', 'villa', 'independent house', 'plot', or 'bungalow'.",
        "purpose": "User's intent: either 'investment' or 'personal use'.",
        "timeline": "Expected timeframe for buying or moving, e.g., 'within 2 months', 'after 6 months', 'immediate', etc."
      }
    }
  },
  {
    "industry": "education",
    "location": "dubai",
    "qualifyingQuestions": [
      "What level of education are you interested in? (e.g., school, undergraduate, postgraduate)",
      "Which specific course or stream are you looking for?",
      "Are you looking for online or on-campus programs?",
      "What is your preferred budget range for tuition or fees?",
      "When do you plan to start your studies?"
    ],
    "rules": {
      "classification": "Classify based on the user's clarity, intent, and responsiveness.\n\n- If the user clearly specifies the level of study, course, format (online/offline), budget, and a clear timeline to start, classify as 'Hot'.\n- If the user is vague about preferences, undecided, casually exploring, or non-committal, classify as 'Cold'.\n- If the message is spam, off-topic, contains gibberish, or lacks relevant educational intent, classify as 'Invalid'.\n\nAlways include a clear reason in the output.",
      "metadataFormat": {
        "education_level": "Level of education the user is interested in, e.g., 'undergraduate', 'MBA', 'high school'.",
        "course": "Specific course or field of interest, e.g., 'Computer Science', 'Business Administration'.",
        "mode": "Learning mode preference, e.g., 'online', 'on-campus', or 'hybrid'.",
        "budget": "Tuition or total fee range, e.g., 'under AED 50,000', '15k to 30k AED', etc.",
        "start_time": "Planned timeline to begin studies, e.g., 'next semester', 'September 2025', 'immediately', etc."
      }
    }
  }
]
```

## Demo Outputs

1. Cold Lead

```json
{
  "lead": {
    "name": "Pratham Pal",
    "phone": "4545454545",
    "source": "X",
    "message": "i am wanderinmg"
  },
  "transcript": [
    {
      "role": "user",
      "content": "i am wanderinmg"
    },
    {
      "role": "agent",
      "content": "Hi Pratham, thanks for reaching out! I understand you're exploring real estate options. To help me narrow down the best choices for you, could you tell me which city or locality you're interested in?"
    },
    {
      "role": "user",
      "content": "idk"
    },
    {
      "role": "agent",
      "content": "Okay, Pratham. Are you open to suggestions, or is there a specific area you'd like to start with? Knowing a general region, like a state, could also help."
    },
    {
      "role": "user",
      "content": "idk"
    },
    {
      "role": "agent",
      "content": "I understand, Pratham. Since you're unsure, perhaps we can explore some popular locations in India. Would you be interested in metropolitan cities like Mumbai, Bangalore, or Delhi, or perhaps something more specific like a tier-2 city or a quieter town?"
    },
    {
      "role": "user",
      "content": "i dont care"
    }
  ],
  "metadata": {
    "location": "",
    "budget": "",
    "property_type": "",
    "purpose": "",
    "timeline": ""
  },
  "classification": {
    "status": "Cold",
    "reason": "The user is unresponsive and provides vague answers, indicating a lack of clear intent or interest in pursuing real estate options at this time."
  }
}
```

2. Invalid Lead

```json
{
  "lead": {
    "name": "test123",
    "phone": "6443465",
    "source": "X",
    "message": "abcabc"
  },
  "transcript": [
    {
      "role": "user",
      "content": "abcabc"
    },
    {
      "role": "agent",
      "content": "Hello test123, thanks for reaching out! I'm here to help you find the perfect property. To start, could you tell me which city or locality in India you're interested in?"
    },
    {
      "role": "user",
      "content": "dthdt"
    },
    {
      "role": "agent",
      "content": "I understand. Just to confirm, are you still interested in finding a property? If so, could you please share which city or locality you're interested in?"
    },
    {
      "role": "user",
      "content": "dxtjdxt"
    }
  ],
  "metadata": {
    "location": "",
    "budget": "",
    "property_type": "",
    "purpose": "",
    "timeline": ""
  },
  "classification": {
    "status": "Invalid",
    "reason": "The user's responses are gibberish and do not indicate any real estate intent."
  }
}
```

3. Hot Lead

```json
{
  "lead": {
    "name": "Ayan Das",
    "phone": "1234567890",
    "source": "Facebook",
    "message": "I wanna rent a flat"
  },
  "transcript": [
    {
      "role": "user",
      "content": "I wanna rent a flat"
    },
    {
      "role": "agent",
      "content": "Hi Ayan, thanks for reaching out! I understand you're looking to rent a flat. To help me find the best options for you, could you tell me which city or locality you're interested in?"
    },
    {
      "role": "user",
      "content": "whitefield in blr"
    },
    {
      "role": "agent",
      "content": "Okay, Ayan. Whitefield in Bangalore. Got it! And how soon are you looking to move in?"
    },
    {
      "role": "user",
      "content": "in 2 3 mo maybe"
    },
    {
      "role": "agent",
      "content": "Okay, Ayan. So you're looking to rent a flat in Whitefield, Bangalore, and you're planning to move in within 2-3 months. Is this for personal use?"
    },
    {
      "role": "user",
      "content": "yupp"
    },
    {
      "role": "agent",
      "content": "Great, Ayan! To help me narrow down the options, what's your budget range for the rent?"
    },
    {
      "role": "user",
      "content": "i want it in 20k atmost"
    },
    {
      "role": "agent",
      "content": "Okay, Ayan. So you're looking for a flat to rent in Whitefield, Bangalore, for personal use, with a budget of 20k or less, and you're planning to move in within 2-3 months. Do you have any specific requirements or preferences for the flat, like the number of bedrooms or any particular amenities?"
    },
    {
      "role": "user",
      "content": "nope"
    },
    {
      "role": "agent",
      "content": "Okay, Ayan. I have a good understanding of what you're looking for. Do you have any questions for me, or is there anything else I can help you with?"
    },
    {
      "role": "user",
      "content": "nope"
    },
    {
      "role": "agent",
      "content": "Alright Ayan, I've got all the information I need for now. I'll start looking for suitable options for you in Whitefield. I'll get back to you soon with some great choices! Feel free to reach out if you have any more questions in the meantime."
    }
  ],
  "metadata": {
    "location": "Bangalore, Whitefield",
    "budget": "20k atmost",
    "property_type": "flat",
    "purpose": "personal use",
    "timeline": "in 2 3 mo"
  },
  "classification": {
    "status": "Hot",
    "reason": "The user has provided a location (Whitefield, Bangalore), property type (flat), budget (20k atmost), purpose (personal use), and a timeline (2-3 months). This indicates a serious intent to rent a flat."
  }
}
```

## Video of Demo

Youtube: https://youtu.be/4KNuf7NY-KU
