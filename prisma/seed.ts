import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding PixelMind database...");

  await prisma.comment.deleteMany();
  await prisma.review.deleteMany();
  await prisma.tool.deleteMany();
  await prisma.guide.deleteMany();
  await prisma.article.deleteMany();

  // ===== 20 AI TOOLS =====
  const toolsData = [
    {
      name: "ChatGPT", slug: "chatgpt",
      description: "OpenAI's GPT-4o powered chatbot. Conversation, writing, image analysis, coding and more.",
      fullDescription: "ChatGPT is the world's most popular AI tool. Powered by OpenAI's GPT-4o model, it enables natural conversation, text writing, image analysis, coding, and image generation via DALL-E. The free tier offers GPT-4o mini; Plus ($20/mo) unlocks full GPT-4o access.",
      category: "text", url: "https://chat.openai.com", pricing: "freemium", rating: 4.7, featured: true,
      tags: "chatbot,writing,coding,image-analysis,GPT-4o",
      image: "https://www.google.com/s2/favicons?domain=openai.com&sz=128",
    },
    {
      name: "Claude", slug: "claude",
      description: "Anthropic's AI assistant with advanced conversation, document analysis, and a massive context window.",
      fullDescription: "Claude by Anthropic is one of the most capable AI models available. Claude 3.5 Sonnet delivers impressive performance in writing, analysis, and coding. With a 200K token context window, it can analyze entire documents and work through complex, long-form projects.",
      category: "text", url: "https://claude.ai", pricing: "freemium", rating: 4.8, featured: true,
      tags: "chatbot,writing,coding,analysis,documents",
      image: "https://www.google.com/s2/favicons?domain=anthropic.com&sz=128",
    },
    {
      name: "Gemini", slug: "gemini",
      description: "Google's AI model with live internet access, image analysis, and deep Google service integration.",
      fullDescription: "Gemini (formerly Bard) is Google's flagship AI model. With direct access to Google Search, it provides up-to-date and accurate information. Gemini Ultra rivals GPT-4o and offers advanced multimodal capabilities including image and video analysis.",
      category: "text", url: "https://gemini.google.com", pricing: "freemium", rating: 4.4, featured: true,
      tags: "chatbot,google,search,multimodal",
      image: "https://www.google.com/s2/favicons?domain=google.com&sz=128",
    },
    {
      name: "Midjourney", slug: "midjourney",
      description: "The world's leading AI image generator. Create stunning artistic images from text prompts.",
      fullDescription: "Midjourney is the industry leader in AI image generation. Using text prompts, it creates highly artistic, high-quality images. Version 6.0 brought significant improvements in language understanding, anatomical accuracy, and text rendering within images.",
      category: "image", url: "https://midjourney.com", pricing: "paid", rating: 4.9, featured: true,
      tags: "image-generation,art,creative,design",
      image: "https://www.google.com/s2/favicons?domain=midjourney.com&sz=128",
    },
    {
      name: "DALL-E 3", slug: "dall-e-3",
      description: "OpenAI's image generation engine. Built into ChatGPT with excellent prompt understanding.",
      fullDescription: "DALL-E 3 is OpenAI's image generation model, integrated directly into ChatGPT Plus. This enables iterative image refinement through conversation. DALL-E 3 excels at understanding complex prompts and accurately rendering text inside images.",
      category: "image", url: "https://openai.com/dall-e-3", pricing: "freemium", rating: 4.5, featured: true,
      tags: "image-generation,openai,creative",
      image: "https://www.google.com/s2/favicons?domain=openai.com&sz=128",
    },
    {
      name: "Stable Diffusion", slug: "stable-diffusion",
      description: "Open-source image generation model. Run locally on your own hardware with full control.",
      fullDescription: "Stable Diffusion is an open-source image generation model. Its biggest advantage is the ability to run locally on your own computer at no ongoing cost. With a massive community of custom models (LoRA), it offers flexibility no other tool can match.",
      category: "image", url: "https://stability.ai", pricing: "free", rating: 4.3, featured: false,
      tags: "image-generation,open-source,local,customizable",
      image: "https://www.google.com/s2/favicons?domain=stability.ai&sz=128",
    },
    {
      name: "Flux", slug: "flux",
      description: "Innovative image generation model by Black Forest Labs with photorealistic quality.",
      category: "image", url: "https://blackforestlabs.ai", pricing: "freemium", rating: 4.6, featured: false,
      tags: "image-generation,photorealistic,new",
      image: "https://www.google.com/s2/favicons?domain=blackforestlabs.ai&sz=128",
    },
    {
      name: "Sora", slug: "sora",
      description: "OpenAI's text-to-video AI. Generates realistic video clips up to one minute from text descriptions.",
      fullDescription: "Sora is OpenAI's video generation model that creates high-quality videos up to one minute long from text descriptions. It understands physics, motion, and object interactions, producing remarkably coherent scenes.",
      category: "video", url: "https://openai.com/sora", pricing: "paid", rating: 4.6, featured: true,
      tags: "video-generation,openai,creative",
      image: "https://www.google.com/s2/favicons?domain=openai.com&sz=128",
    },
    {
      name: "Runway", slug: "runway",
      description: "Advanced AI video platform with Gen-3 Alpha and smart video editing capabilities.",
      category: "video", url: "https://runwayml.com", pricing: "freemium", rating: 4.5, featured: false,
      tags: "video-generation,editing,creative",
      image: "https://www.google.com/s2/favicons?domain=runwayml.com&sz=128",
    },
    {
      name: "Kling", slug: "kling",
      description: "Kuaishou's AI video generator delivering impressive, high-quality results.",
      category: "video", url: "https://klingai.com", pricing: "freemium", rating: 4.4, featured: false,
      tags: "video-generation,chinese-ai",
      image: "https://www.google.com/s2/favicons?domain=klingai.com&sz=128",
    },
    {
      name: "GitHub Copilot", slug: "github-copilot",
      description: "GitHub's AI coding assistant. Smart autocomplete and code generation directly in your IDE.",
      fullDescription: "GitHub Copilot is the most popular AI coding assistant. It integrates directly with VS Code, JetBrains, and more, offering intelligent autocomplete, full function generation, and bug fixing. Copilot Chat lets you converse about your code in natural language.",
      category: "code", url: "https://github.com/features/copilot", pricing: "paid", rating: 4.6, featured: false,
      tags: "coding,ide,autocomplete,github",
      image: "https://www.google.com/s2/favicons?domain=github.com&sz=128",
    },
    {
      name: "Cursor", slug: "cursor",
      description: "AI-native IDE that transforms the development experience. Write code through conversation.",
      fullDescription: "Cursor is a VS Code-based IDE built from the ground up around AI. It offers intelligent autocomplete, conversational code editing, and deep project-wide understanding. Supporting multiple models (GPT-4, Claude), it has become a favorite among developers.",
      category: "code", url: "https://cursor.sh", pricing: "freemium", rating: 4.7, featured: true,
      tags: "coding,ide,editor,ai-native",
      image: "https://www.google.com/s2/favicons?domain=cursor.sh&sz=128",
    },
    {
      name: "Replit", slug: "replit",
      description: "Online development environment with built-in AI. Write, run, and deploy from the browser.",
      category: "code", url: "https://replit.com", pricing: "freemium", rating: 4.2, featured: false,
      tags: "coding,cloud,deployment,online-ide",
      image: "https://www.google.com/s2/favicons?domain=replit.com&sz=128",
    },
    {
      name: "ElevenLabs", slug: "elevenlabs",
      description: "The leading AI voice synthesis platform. Create realistic voices and clone any voice.",
      fullDescription: "ElevenLabs offers the most advanced voice synthesis technology available. With the ability to clone a voice from a one-minute sample, support for 29 languages, and precise control over intonation and emotion, it's the go-to for podcasts, dubbing, and audio content.",
      category: "audio", url: "https://elevenlabs.io", pricing: "freemium", rating: 4.7, featured: false,
      tags: "voice,tts,cloning,speech",
      image: "https://www.google.com/s2/favicons?domain=elevenlabs.io&sz=128",
    },
    {
      name: "Suno", slug: "suno",
      description: "Generate complete songs with AI. Full tracks with lyrics, melody, and instrumentation from text.",
      category: "audio", url: "https://suno.ai", pricing: "freemium", rating: 4.5, featured: false,
      tags: "music,generation,creative,songs",
      image: "https://www.google.com/s2/favicons?domain=suno.ai&sz=128",
    },
    {
      name: "Perplexity", slug: "perplexity",
      description: "AI-powered search engine that answers questions with cited sources. A smarter alternative to Google.",
      fullDescription: "Perplexity is an AI search engine that transforms the way we find information. Instead of a list of links, it delivers detailed answers with cited sources. The Pro version enables deeper research and access to advanced models.",
      category: "text", url: "https://perplexity.ai", pricing: "freemium", rating: 4.5, featured: false,
      tags: "search,research,citations,knowledge",
      image: "https://www.google.com/s2/favicons?domain=perplexity.ai&sz=128",
    },
    {
      name: "Notion AI", slug: "notion-ai",
      description: "AI built into Notion for writing, summarization, translation, and document automation.",
      category: "business", url: "https://notion.so/product/ai", pricing: "paid", rating: 4.3, featured: false,
      tags: "productivity,writing,workspace,notes",
      image: "https://www.google.com/s2/favicons?domain=notion.so&sz=128",
    },
    {
      name: "Jasper", slug: "jasper",
      description: "AI marketing writing platform. Generate content for blogs, social media, and emails at scale.",
      category: "business", url: "https://jasper.ai", pricing: "paid", rating: 4.1, featured: false,
      tags: "marketing,copywriting,content,business",
      image: "https://www.google.com/s2/favicons?domain=jasper.ai&sz=128",
    },
    {
      name: "Pika", slug: "pika",
      description: "AI video creation and editing tool. Special effects and image-to-video transformation.",
      category: "video", url: "https://pika.art", pricing: "freemium", rating: 4.3, featured: false,
      tags: "video-generation,effects,creative",
      image: "https://www.google.com/s2/favicons?domain=pika.art&sz=128",
    },
    {
      name: "Copy.ai", slug: "copy-ai",
      description: "AI content writing tool for businesses. Ready-made templates for emails, posts, and ads.",
      category: "business", url: "https://copy.ai", pricing: "freemium", rating: 4.0, featured: false,
      tags: "copywriting,marketing,templates,business",
      image: "https://www.google.com/s2/favicons?domain=copy.ai&sz=128",
    },
  ];

  const tools: Array<{ id: string; slug: string }> = [];
  for (const t of toolsData) {
    const tool = await prisma.tool.create({ data: t });
    tools.push({ id: tool.id, slug: tool.slug });
  }
  console.log(`Created ${tools.length} tools`);

  // ===== 10 GUIDES =====
  const guidesData = [
    {
      title: "Beginner's Guide: How to Use ChatGPT Effectively",
      slug: "chatgpt-beginners-guide",
      excerpt: "Learn how to write great prompts, use Custom Instructions, and get the most out of ChatGPT.",
      content: `<h2>What is ChatGPT?</h2><p>ChatGPT is a conversational AI tool from OpenAI. It can answer questions, write content, analyze information, write code, and much more.</p><h2>How to Write Great Prompts</h2><p>The secret to using ChatGPT effectively is writing clear, detailed prompts. Here are some tips:</p><ul><li><strong>Be specific</strong> — Instead of "write me a text", try "write a 200-word LinkedIn post about the benefits of remote work"</li><li><strong>Give context</strong> — Tell ChatGPT who you are and who the content is for</li><li><strong>Request a format</strong> — Specify whether you want a list, table, or paragraphs</li><li><strong>Give examples</strong> — Show ChatGPT an example of what you expect</li></ul><h2>Custom Instructions</h2><p>Custom Instructions let you set permanent preferences. ChatGPT will remember who you are and how you like responses in every new conversation.</p><h2>Advanced Tips</h2><p>Use the Chain of Thought technique — ask ChatGPT to "think step by step" before giving an answer. This significantly improves accuracy on complex questions.</p>`,
      category: "text", toolName: "ChatGPT", difficulty: "beginner",
      image: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=80",
    },
    {
      title: "Claude: The Complete Guide to Anthropic's AI",
      slug: "claude-complete-guide",
      excerpt: "Everything you need to know about Claude — from basic prompts to analyzing long documents and writing code.",
      content: `<h2>Why Claude?</h2><p>Claude by Anthropic offers some unique advantages: a 200K token context window (about 150,000 words), excellent document analysis capabilities, and more balanced, careful responses.</p><h2>Key Use Cases</h2><ul><li><strong>Document analysis</strong> — Upload a PDF or long text and ask for a summary, analysis, or specific answers</li><li><strong>Code writing</strong> — Claude excels at writing clean, well-documented code</li><li><strong>Creative writing</strong> — Stories, articles, scripts, and more</li></ul><h2>Artifacts</h2><p>The Artifacts feature lets Claude create code, documents, and diagrams in a separate panel you can edit and share.</p><h2>Claude Projects</h2><p>Projects allow you to create a workspace with files and conversations organized around a specific topic.</p>`,
      category: "text", toolName: "Claude", difficulty: "beginner",
      image: "https://images.unsplash.com/photo-1676573012419-b6f5e2c53cdd?w=800&q=80",
    },
    {
      title: "Midjourney Guide: Creating Stunning AI Images",
      slug: "midjourney-image-guide",
      excerpt: "Learn the secrets of Midjourney prompts, advanced parameters, and techniques for stunning digital art.",
      content: `<h2>Quick Start</h2><p>Midjourney works through Discord. After signing up, use the /imagine command followed by a description of the image you want to create.</p><h2>Writing Effective Prompts</h2><p>A good prompt structure: [subject] + [style] + [lighting] + [camera angle] + [parameters]</p><p>Example: "a cyberpunk city at sunset, neon lights reflecting on wet streets, cinematic lighting, wide angle --ar 16:9 --v 6"</p><h2>Key Parameters</h2><ul><li><strong>--ar</strong> — Aspect ratio (16:9, 1:1, 9:16)</li><li><strong>--v 6</strong> — Model version</li><li><strong>--style raw</strong> — Less processed style</li><li><strong>--chaos</strong> — Variation level between results</li></ul><h2>Advanced Tips</h2><p>Use Image Prompts: upload a reference image alongside your text prompt to influence the style and composition of the output.</p>`,
      category: "image", toolName: "Midjourney", difficulty: "intermediate",
      image: "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=800&q=80",
    },
    {
      title: "Stable Diffusion: Local Installation and Usage",
      slug: "stable-diffusion-local-setup",
      excerpt: "A complete guide to installing Stable Diffusion on your own computer with the Automatic1111 WebUI.",
      content: `<h2>System Requirements</h2><p>To run Stable Diffusion locally you'll need:</p><ul><li>NVIDIA GPU with at least 6GB VRAM (8GB+ recommended)</li><li>16GB RAM minimum</li><li>20GB free disk space</li></ul><h2>Installing Automatic1111 WebUI</h2><p>Automatic1111 is the most popular interface for Stable Diffusion, offering a clean GUI with countless customization options.</p><h3>Installation Steps</h3><ol><li>Install Python 3.10</li><li>Install Git</li><li>Clone the repository from GitHub</li><li>Run webui-user.bat</li></ol><h2>Popular Models</h2><p>SDXL is the latest official model, but there are thousands of custom models on CivitAI. LoRA models let you add specific styles and characters to your generations.</p>`,
      category: "image", toolName: "Stable Diffusion", difficulty: "advanced",
      image: "https://images.unsplash.com/photo-1634986666676-ec8fd927c23d?w=800&q=80",
    },
    {
      title: "Sora: A Guide to AI Video Generation",
      slug: "sora-video-guide",
      excerpt: "How to use OpenAI's Sora to create impressive video clips from text descriptions.",
      content: `<h2>What is Sora?</h2><p>Sora is OpenAI's video generation model that can create videos up to one minute long from a text description. It understands physics, object motion, and complex interactions.</p><h2>Writing Prompts for Video</h2><p>Video prompts differ from image prompts. It's important to describe:</p><ul><li><strong>Motion</strong> — What's happening in the scene, where things are moving</li><li><strong>Camera</strong> — Angle, camera movement, zoom</li><li><strong>Environment</strong> — Location, lighting, atmosphere</li><li><strong>Style</strong> — Cinematic, animation, documentary</li></ul><h2>Example</h2><p>"A drone shot flying over a misty mountain valley at sunrise, revealing a small village below, cinematic 4K quality"</p><h2>Limitations</h2><p>Sora still struggles with complex physics, finger counting, and maintaining character consistency across a video.</p>`,
      category: "video", toolName: "Sora", difficulty: "intermediate",
      image: "https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?w=800&q=80",
    },
    {
      title: "GitHub Copilot: The Complete Developer Guide",
      slug: "github-copilot-guide",
      excerpt: "How to use GitHub Copilot for faster coding, bug fixing, and learning new languages.",
      content: `<h2>Installation and Setup</h2><p>GitHub Copilot is available as an extension for VS Code, JetBrains, Neovim, and more. After installing, sign in with your GitHub account.</p><h2>Basic Usage</h2><p>Copilot works automatically — just start writing code or a comment and it will suggest completions. Press Tab to accept or Esc to dismiss.</p><h2>Copilot Chat</h2><p>Copilot Chat enables code conversations:</p><ul><li><strong>/explain</strong> — Explain selected code</li><li><strong>/fix</strong> — Fix bugs</li><li><strong>/tests</strong> — Generate tests</li><li><strong>@workspace</strong> — Ask questions about your whole project</li></ul><h2>Tips</h2><p>Write clear comments before functions — Copilot uses them as context. The more detailed the comment, the more accurate the generated code will be.</p>`,
      category: "code", toolName: "GitHub Copilot", difficulty: "beginner",
      image: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800&q=80",
    },
    {
      title: "Cursor: The AI-Native IDE That Changes Development",
      slug: "cursor-ide-guide",
      excerpt: "A comprehensive guide to Cursor — the AI-first IDE that lets you write code through conversation.",
      content: `<h2>What is Cursor?</h2><p>Cursor is a VS Code-based IDE built from the ground up around AI. It offers a novel development experience where you can edit code through conversation, get intelligent completions, and navigate your project intuitively.</p><h2>Key Features</h2><ul><li><strong>Cmd+K</strong> — Edit selected code with AI</li><li><strong>Cmd+L</strong> — Chat about your code</li><li><strong>Tab</strong> — Smart completions that understand context</li><li><strong>@codebase</strong> — Ask questions about your entire project</li></ul><h2>Composer</h2><p>Composer is a tool for making complex changes across multiple files. Describe the change you want and Cursor will implement it.</p><h2>Choosing a Model</h2><p>Cursor supports GPT-4, Claude 3.5 Sonnet, and more. Claude Sonnet excels at code, while GPT-4 is better for explanations.</p>`,
      category: "code", toolName: "Cursor", difficulty: "intermediate",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
    },
    {
      title: "ElevenLabs: Creating Realistic AI Voices",
      slug: "elevenlabs-voice-guide",
      excerpt: "A guide to generating AI voices, cloning voices, and creating audio content with ElevenLabs.",
      content: `<h2>Quick Start</h2><p>ElevenLabs offers a simple interface for text-to-speech. Choose a voice from the library, paste your text, and click Generate.</p><h2>Voice Cloning</h2><p>With Instant Voice Cloning you can clone any voice from a one-minute sample. Professional Voice Cloning delivers even better results with a longer recording.</p><h2>Controlling Emotion and Intonation</h2><p>Use these controls:</p><ul><li><strong>Stability</strong> — Low value = more expressiveness</li><li><strong>Similarity</strong> — How close to the original voice</li><li><strong>Style</strong> — How dramatic the delivery is</li></ul><h2>Common Use Cases</h2><p>Podcasts, YouTube dubbing, audiobooks, accessibility features, and educational content.</p>`,
      category: "audio", toolName: "ElevenLabs", difficulty: "beginner",
      image: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=800&q=80",
    },
    {
      title: "Suno: Creating Music with AI from Scratch",
      slug: "suno-music-guide",
      excerpt: "How to create full songs with Suno AI — lyrics, melody, production, and style.",
      content: `<h2>What is Suno?</h2><p>Suno is an AI music generation tool that lets you create complete songs — including lyrics, melody, vocals, and instrumental accompaniment — from a text description alone.</p><h2>Creating Your First Song</h2><ol><li>Choose "Create" in the interface</li><li>Describe your song: "A happy pop song about summer vacation"</li><li>Choose a musical style</li><li>Click Create — Suno will generate two versions</li></ol><h2>Custom Mode</h2><p>In Custom Mode you can:</p><ul><li>Write your own lyrics</li><li>Choose a precise style (pop, rock, jazz, electronic...)</li><li>Set a title</li></ul><h2>Tips</h2><p>Use specific style descriptions: "upbeat indie folk with acoustic guitar and harmonies" works much better than "happy music".</p>`,
      category: "audio", toolName: "Suno", difficulty: "beginner",
      image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80",
    },
    {
      title: "Notion AI: Productivity with Artificial Intelligence",
      slug: "notion-ai-productivity-guide",
      excerpt: "How to use Notion AI to summarize meetings, write documents, and automate workflows.",
      content: `<h2>What is Notion AI?</h2><p>Notion AI is an AI add-on built into the Notion platform that enables smart writing, summarization, translation, and information organization directly within your workspace.</p><h2>Key Use Cases</h2><ul><li><strong>Meeting summaries</strong> — Paste a transcript and ask for a summary with action items</li><li><strong>Document writing</strong> — From first draft to final edit</li><li><strong>Translation</strong> — Translate content to 20+ languages</li><li><strong>Information retrieval</strong> — Smart search across your entire workspace</li></ul><h2>Q&A</h2><p>The Q&A feature lets you ask questions about all content in your Notion workspace. "When is the next client meeting?" or "What were the decisions from the last sprint?"</p><h2>Automations</h2><p>Combine Notion AI with Automations to create automated workflows: auto-summarize completed tasks, generate weekly briefings, and more.</p>`,
      category: "business", toolName: "Notion AI", difficulty: "beginner",
      image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&q=80",
    },
  ];

  for (const g of guidesData) {
    await prisma.guide.create({ data: g });
  }
  console.log(`Created ${guidesData.length} guides`);

  // ===== 10 NEWS ARTICLES =====
  const articlesData = [
    {
      title: "OpenAI Launches GPT-5: The Next Generation of AI",
      slug: "openai-gpt5-launch",
      excerpt: "OpenAI has announced GPT-5, its most advanced model yet, with enhanced reasoning capabilities and multimodal features.",
      content: `<h2>GPT-5: A Major Leap Forward</h2><p>OpenAI unveiled GPT-5, the next generation of its language models. The new model shows significant improvements in comprehension, logical reasoning, and multimodal capabilities.</p><p>Key improvements include extended reasoning, better long-context understanding, and enhanced coding abilities.</p><h2>Pricing and Availability</h2><p>GPT-5 will initially be available to ChatGPT Plus and Enterprise subscribers, with a gradual API rollout to follow.</p>`,
      category: "models", source: "OpenAI Blog",
      image: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=80",
    },
    {
      title: "Anthropic Releases Claude 4: Deeper AI Understanding",
      slug: "anthropic-claude-4-release",
      excerpt: "Anthropic launches Claude 4 with dramatic improvements in text comprehension, coding, and mathematical reasoning.",
      content: `<h2>Claude 4: Renewed Competition</h2><p>Anthropic has released Claude 4, its most advanced model. With performance exceeding GPT-4o on several benchmarks, Claude 4 offers deeper understanding of complex text and improved coding capabilities.</p><p>The context window has been expanded to 500K tokens, and Claude Projects has been upgraded with collaboration features.</p>`,
      category: "models", source: "Anthropic",
      image: "https://images.unsplash.com/photo-1676573012419-b6f5e2c53cdd?w=800&q=80",
    },
    {
      title: "Google Gemini 2.0: The Model That Unifies Everything",
      slug: "google-gemini-2-launch",
      excerpt: "Google unveils Gemini 2.0 with advanced multimodal capabilities and deep integration across all Google services.",
      content: `<h2>Gemini 2.0</h2><p>Google presented Gemini 2.0, a new generation of AI models that seamlessly combines text, images, video, and audio. The new model integrates directly into Gmail, Docs, Search, and Android.</p><p>Project Astra, a Gemini 2.0-powered AI assistant, offers a real-time multimodal conversation experience.</p>`,
      category: "models", source: "Google AI Blog",
      image: "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=800&q=80",
    },
    {
      title: "Midjourney V7: A New Bar for AI Image Quality",
      slug: "midjourney-v7-release",
      excerpt: "Midjourney V7 delivers unprecedented photorealistic quality and more precise control over image generation.",
      content: `<h2>V7: A New Standard</h2><p>Midjourney has released version 7, showing a dramatic improvement in image quality. Photorealistic images are nearly indistinguishable from real photographs.</p><p>Among the new features: better text rendering in images, precise lighting control, and new capabilities for editing existing images.</p>`,
      category: "products", source: "Midjourney",
      image: "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=800&q=80",
    },
    {
      title: "Apple Acquires Cursor for $2 Billion",
      slug: "apple-acquires-cursor",
      excerpt: "Apple acquires Cursor, the AI-powered IDE, aiming to integrate deep AI capabilities into Xcode and its developer tools.",
      content: `<h2>A Landmark AI Deal</h2><p>Apple has announced the acquisition of Anysphere, the company behind the popular Cursor IDE, for $2 billion. The deal is expected to bring advanced AI capabilities to Xcode and Apple's development environment.</p><p>Cursor will continue to operate as a standalone product, but its AI technology will also be integrated into Apple's tools.</p>`,
      category: "companies", source: "Bloomberg",
      image: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800&q=80",
    },
    {
      title: "Study: AI Reaches Expert-Level Accuracy in Medical Diagnosis",
      slug: "ai-medical-diagnosis-study",
      excerpt: "New Stanford University research shows AI models achieving 95% accuracy in medical image diagnosis.",
      content: `<h2>AI in Medicine</h2><p>A new study published in Nature Medicine shows that advanced AI models achieve 95% accuracy in diagnosing diseases from medical images, compared to 92% for specialist physicians.</p><p>Researchers emphasize the goal is not to replace doctors but to assist them — the AI+doctor combination achieved 98% accuracy.</p>`,
      category: "research", source: "Nature Medicine",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80",
    },
    {
      title: "European Union Approves the AI Act",
      slug: "eu-ai-act-approved",
      excerpt: "The European Union has approved the world's most comprehensive regulation on artificial intelligence.",
      content: `<h2>AI Act: Historic Regulation</h2><p>The European Parliament has finally approved the AI Act, the world's most comprehensive AI legislation. The law classifies AI systems by risk level and imposes different requirements accordingly.</p><p>High-risk AI systems (medical diagnosis, hiring) will need to meet strict standards for transparency and safety.</p>`,
      category: "industry", source: "European Parliament",
      image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=800&q=80",
    },
    {
      title: "NVIDIA Reveals H200 Chip: Double the AI Power",
      slug: "nvidia-h200-chip",
      excerpt: "NVIDIA unveiled the H200, a new AI chip that doubles performance for training and inference of large models.",
      content: `<h2>H200: The Next Generation of AI Chips</h2><p>NVIDIA revealed the H200 chip, offering double the performance of the H100 for training large language models. The new chip includes 141GB of HBM3e memory and 4.8TB/s of bandwidth.</p><p>The H200 is expected to be available in Q1 2025, with massive demand from leading AI companies.</p>`,
      category: "industry", source: "NVIDIA",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
    },
    {
      title: "ElevenLabs Raises $80M and Launches Dubbing Studio",
      slug: "elevenlabs-funding-dubbing",
      excerpt: "ElevenLabs closes a funding round and launches an automatic dubbing tool supporting 29 languages.",
      content: `<h2>Funding and Innovation</h2><p>ElevenLabs, the leading voice synthesis company, has closed an $80 million funding round at a $1.1 billion valuation.</p><p>Alongside the raise, the company is launching Dubbing Studio — an automatic dubbing tool that translates and dubs videos into 29 languages while preserving the original voice and intonation.</p>`,
      category: "companies", source: "TechCrunch",
      image: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=800&q=80",
    },
    {
      title: "Suno V4: AI Music Indistinguishable from the Real Thing",
      slug: "suno-v4-music-ai",
      excerpt: "Suno V4 delivers a dramatic quality leap — full songs up to 4 minutes long at studio quality.",
      content: `<h2>Suno V4</h2><p>Suno has released version 4 of its music generation engine, with significant improvements in sound quality, song structure, and production capabilities.</p><p>The new version supports songs up to 4 minutes long, with smooth transitions between sections (verse, chorus, bridge) and studio-grade audio quality.</p>`,
      category: "products", source: "Suno Blog",
      image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80",
    },
  ];

  for (const a of articlesData) {
    await prisma.article.create({ data: a });
  }
  console.log(`Created ${articlesData.length} articles`);

  // ===== 5 REVIEWS =====
  const reviewsData = [
    {
      title: "ChatGPT Plus Review: Is $20/Month Worth It?",
      slug: "chatgpt-plus-review",
      content: `<h2>Full Review</h2><p>ChatGPT Plus offers access to GPT-4o, image generation with DALL-E, web browsing, and more. The question is whether it's worth $20 a month.</p><p>For daily AI users, the answer is a clear yes. GPT-4o is significantly smarter than the free version, and the added features save considerable time.</p><p>For occasional users, the free version is sufficient in most cases.</p>`,
      excerpt: "A thorough review of ChatGPT Plus — is the paid subscription worth the investment? We put it to the test.",
      rating: 4.5,
      pros: "Very smart GPT-4o,Built-in DALL-E,Web browsing,Custom GPTs,Fast and reliable",
      cons: "Expensive for casual users,Hourly message limits,Occasional refusals",
      toolSlug: "chatgpt",
    },
    {
      title: "Claude Pro Review: A Serious ChatGPT Alternative",
      slug: "claude-pro-review",
      content: `<h2>Claude Pro in Practice</h2><p>Claude Pro offers access to Claude 3.5 Sonnet with a larger usage quota, large file uploads, and the Projects feature. In our testing, Claude excelled particularly at document analysis and code writing.</p><p>Claude's biggest advantage is its massive context window — 200K tokens allows analyzing entire documents in one shot. Answers also tend to be more balanced and accurate.</p>`,
      excerpt: "Anthropic's Claude Pro — what you get and how it compares to ChatGPT Plus.",
      rating: 4.7,
      pros: "Massive context window,Excellent document analysis,Clean well-documented code,Creative Artifacts,Balanced responses",
      cons: "No image generation,No web browsing,Less feature-rich interface than ChatGPT",
      toolSlug: "claude",
    },
    {
      title: "Midjourney Review: The King of AI Image Generation",
      slug: "midjourney-review",
      content: `<h2>Midjourney V6</h2><p>Midjourney continues to lead the AI image generation space. Version 6 brought significant improvements in quality, accuracy, and prompt understanding.</p><p>The artistic quality of Midjourney remains unmatched. Images are beautiful, technically flawless, and feel like the work of a professional artist.</p>`,
      excerpt: "Midjourney V6 — is it still the best AI image generation tool? An in-depth review.",
      rating: 4.8,
      pros: "Stunning artistic quality,Constant improvement,Active community,Diverse styles",
      cons: "Discord-only workflow,Limited advanced editing,High price,Less control than Stable Diffusion",
      toolSlug: "midjourney",
    },
    {
      title: "Cursor Review: The IDE That Changes the Rules",
      slug: "cursor-ide-review",
      content: `<h2>Cursor in Daily Use</h2><p>After a month of daily use, I can say with confidence that Cursor has changed the way I write code. The combination of AI deeply integrated into the IDE, with a thorough understanding of the entire project, is a genuine game changer.</p><p>Composer allows making changes across multiple files with a single instruction. Tab Completion is smart enough to anticipate what you're about to write.</p>`,
      excerpt: "Cursor IDE — is it worth switching from VS Code? An in-depth review after one month of use.",
      rating: 4.7,
      pros: "Deep AI integration,Excellent Composer,VS Code-based,Very smart Tab,Full project understanding",
      cons: "High Pro price,Occasionally slow,Resource hungry,Not always accurate",
      toolSlug: "cursor",
    },
    {
      title: "ElevenLabs Review: AI Voice That Sounds Real",
      slug: "elevenlabs-review",
      content: `<h2>ElevenLabs in Practice</h2><p>ElevenLabs offers the best voice synthesis technology on the market. The voices sound remarkably natural, with intonation and emotion that is difficult to distinguish from human speech.</p><p>Voice cloning works impressively well — from just one minute of sample audio, the system can produce a voice that sounds nearly identical to the original.</p>`,
      excerpt: "ElevenLabs — the leading AI voice synthesis tool. A comprehensive review with examples.",
      rating: 4.6,
      pros: "Highly realistic voices,Impressive voice cloning,29 languages,Convenient API,Frequent updates",
      cons: "High price for commercial use,Free tier character limits,Occasional pronunciation errors",
      toolSlug: "elevenlabs",
    },
  ];

  for (const r of reviewsData) {
    const tool = tools.find((t) => t.slug === r.toolSlug);
    if (tool) {
      await prisma.review.create({
        data: {
          title: r.title, slug: r.slug, content: r.content, excerpt: r.excerpt,
          rating: r.rating, pros: r.pros, cons: r.cons, toolId: tool.id,
        },
      });
    }
  }
  console.log("Created 5 reviews");

  console.log("Seeding complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
