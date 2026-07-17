# Roadmap

Project: Tama OS
Hackathon: OpenAI Build Week 2026

---

# Mission

Transform two existing browser-based applications

- Tama Finance
- Tama Research Desk

into a single local-first AI Financial Operating System.

The goal is NOT to build another finance tracker.

The goal is to build a decision support system that helps users make better financial decisions.

---

# Guiding Principles

Priority order:

1. Working software
2. Good user experience
3. AI-assisted reasoning
4. Clean architecture
5. Future scalability

Never sacrifice product stability for additional features.

---

# Architecture Goals

By the end of the hackathon the project should consist of:

```
Tama OS

├── Dashboard
├── Finance
├── Investments
├── Research
├── Goals
├── Settings
└── AI Copilot
```

Every module should share one common financial state.

---

# MVP Scope

The MVP focuses on one complete workflow.

```
Financial Event

↓

Update Financial State

↓

Decision Engine

↓

AI Reasoning

↓

Recommendation

↓

Journal
```

If this workflow works reliably, the MVP is considered successful.

---

# Milestone 0

Repository Preparation

Status:
Pending

Tasks:

- Create Build Week repository
- Import existing projects
- Create documentation
- Freeze baseline
- Prepare deployment

Deliverable:

Working baseline repository.

---

# Milestone 1

Project Consolidation

Goal:

Turn two independent applications into one operating system.

Tasks:

- Shared navigation
- Shared layout
- Shared assets
- Shared utilities
- Shared storage
- Shared financial state

Deliverable:

Single integrated application.

Priority:

★★★★★

---

# Milestone 2

Financial Decision Engine

Goal:

Create deterministic financial logic.

Responsibilities:

- Budget evaluation
- Emergency fund calculation
- Allocation calculation
- Portfolio distribution
- Rule validation
- Financial health scoring

No AI is required here.

Everything should work offline.

Deliverable:

Reliable financial engine.

Priority:

★★★★★

---

# Milestone 3

GPT-5.6 Copilot

Goal:

Allow users to ask financial questions using natural language.

Example questions:

- Can I afford this purchase?
- Where should I allocate my bonus?
- Explain today's recommendation.
- Am I breaking my own investment rules?

Requirements:

- Uses structured financial data
- Never modifies user data directly
- Explains reasoning
- Generates recommendations

Deliverable:

Working AI assistant.

Priority:

★★★★★

---

# Milestone 4

Today's Brief

Goal:

Generate an executive financial summary.

Example:

Good evening.

Emergency fund is fully funded.

Cash allocation exceeds target by 9%.

Food spending increased 18%.

Recommended action:

Invest Rp800,000 this month.

Deliverable:

Automatic financial briefing.

Priority:

★★★★☆

---

# Milestone 5

Financial Memory

Goal:

Store user preferences.

Examples:

- Emergency fund target
- Allocation rules
- Investment strategy
- Risk tolerance
- Financial goals

The AI should reference these rules when generating recommendations.

Deliverable:

Persistent financial profile.

Priority:

★★★★☆

---

# Milestone 6

Simulation

Goal:

Help users evaluate financial decisions before making them.

Examples:

"What happens if..."

- I buy an iPad.
- I invest Rp5M.
- My salary increases 10%.
- I lose my job.
- I receive a bonus.

Deliverable:

Interactive financial simulation.

Priority:

★★★★☆

---

# Milestone 7

Polish

Tasks:

- UI improvements
- Bug fixes
- Empty states
- Better onboarding
- Performance optimization
- Documentation

Deliverable:

Submission-ready application.

Priority:

★★★★★

---

# Future Roadmap

After the hackathon:

Version 2

- Multi-agent architecture
- RAG
- OCR
- Broker integration
- Calendar integration
- Automatic transaction import
- Mobile application
- Authentication
- Cloud synchronization

Version 3

Expand beyond finance.

Potential modules:

- Career
- Learning
- Reading
- Health
- Projects

Eventually evolve into a complete Personal Operating System.

---

# Definition of Success

The project succeeds if a first-time user can:

✓ Record a financial event.

✓ Understand their financial health immediately.

✓ Receive useful recommendations.

✓ Simulate financial decisions.

✓ Ask GPT-5.6 for financial advice.

within five minutes of opening the application.

---

# Development Rules

Every feature must satisfy the following:

- Improves user decision making.
- Preserves existing functionality.
- Requires minimal complexity.
- Can be demonstrated within one minute.
- Supports the long-term Financial OS vision.

If a feature does not satisfy these rules, it should not be implemented during the hackathon.
