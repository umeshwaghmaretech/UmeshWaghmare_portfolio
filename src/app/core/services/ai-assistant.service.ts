import { Injectable, inject } from '@angular/core';
import { PortfolioDataService } from './portfolio-data.service';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

@Injectable({ providedIn: 'root' })
export class AiAssistantService {
  private readonly data = inject(PortfolioDataService);
  private idCounter = 0;

  readonly suggestedPrompts = [
    'Summarize my profile',
    'Suggest skills to highlight',
    'Explain my career transition',
    'Tell me about featured projects',
  ];

  generateResponse(prompt: string): string {
    const lower = prompt.toLowerCase();
    const profile = this.data.profile();
    const skills = this.data.allSkills();
    const projects = this.data.featuredProjects();

    if (lower.includes('summarize') || lower.includes('profile')) {
      return profile
        ? `${profile.name} is a ${profile.title} with ${profile.summary} Career focus: bridging business analysis, stakeholder management, and product delivery.`
        : 'Profile data is loading. Please try again shortly.';
    }

    if (lower.includes('skill')) {
      const top = skills.slice(0, 8).map((s) => s.name);
      return `Top skills to highlight for recruiters: ${top.join(', ')}. Emphasize Agile delivery, requirement gathering, and cross-functional communication alongside technical familiarity with Angular, .NET, and Node.js.`;
    }

    if (lower.includes('career') || lower.includes('transition')) {
      return profile
        ? profile.careerNarrative
        : 'Career journey: Retail Sales Advisor (5+ years) → Freelance Business Analyst → IT/Product Growth. This path demonstrates customer empathy, process improvement, and technical adaptability.';
    }

    if (lower.includes('project')) {
      if (projects.length === 0) {
        return 'No featured projects loaded yet.';
      }
      return projects
        .map(
          (p) =>
            `**${p.title}**: ${p.description} Stack: ${p.techStack.join(', ')}.`,
        )
        .join('\n\n');
    }

    const projectMatch = this.data.projects().find((p) =>
      lower.includes(p.title.toLowerCase()),
    );
    if (projectMatch) {
      return `${projectMatch.title} — ${projectMatch.description}\n\nKey features: ${projectMatch.features.join(', ')}.\nChallenges: ${projectMatch.challenges.join(', ')}.\nLearnings: ${projectMatch.learnings.join(', ')}.`;
    }

    return `I can help summarize ${profile?.name ?? 'your'} profile, suggest skills, explain career transitions, or describe projects. Try one of the suggested prompts above.`;
  }

  createMessage(role: 'user' | 'assistant', content: string): ChatMessage {
    return {
      id: `msg-${++this.idCounter}`,
      role,
      content,
      timestamp: new Date(),
    };
  }
}
