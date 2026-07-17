# Vision

## Product

A local-first AI financial operating system that combines personal finance, investing, research, planning, and memory into one decision-making workspace.

---

# Problem

Current finance apps require users to manually maintain data.

For people who are easily distracted, impulsive, or inconsistent, this creates a predictable cycle:

1. Start tracking finances.
2. Skip one or two days.
3. Data becomes incomplete.
4. Stop using the app.

As a result, users lose visibility into:

- spending habits
- investment allocation
- financial goals
- portfolio decisions
- long-term planning

The goal is to remove friction and let AI maintain the financial system instead of the user.

---

# Target Users

Primary users:

- People who are easily distracted.
- People who abandon finance trackers after a few weeks.
- Investors who already use spreadsheets, notes, and multiple apps.
- Users who want recommendations instead of dashboards.

Secondary users:

- Retail investors.
- Young professionals.
- People building long-term wealth.

---

# Core Vision

Most finance apps answer:

> "What happened?"

This product answers:

> "What should I do next?"

The application should behave like a financial copilot instead of a finance tracker.

---

# Out of Scope (Hackathon)

The following features will NOT be built:

- Authentication
- Backend
- Cloud sync
- Multi-user support
- Voice interface
- Multi-agent system
- RAG
- Mobile application
- Database migration
- Complex integrations

Everything runs locally inside the browser.

---

# Must-Have Features

## 1. AI Financial Copilot

The AI continuously reviews the user's financial situation.

Examples:

- Spending trend analysis
- Cash flow review
- Emergency fund status
- Budget health
- Investment allocation review
- Rule violation detection
- Actionable recommendations

Example:

User:

> I just received a Rp5,000,000 bonus.

AI:

- Update cash balance.
- Recalculate emergency fund.
- Recalculate investment allocation.
- Recommend where the money should go.
- Record the journal automatically.

---

## 2. AI Memory

The system remembers user-defined financial rules.

Examples:

- Emergency fund target
- Asset allocation rules
- Maximum speculative allocation
- Preferred investment strategy
- Financial goals

Instead of asking every time, the AI uses these rules when generating recommendations.

Example:

"You said speculative assets should never exceed 15%."

---

## 3. Financial Decision Engine

Every financial event automatically propagates through the system.

Example flow:

Income received

↓

Categorize transaction

↓

Update budget

↓

Update cash allocation

↓

Update emergency fund

↓

Update investment allocation

↓

Update portfolio analysis

↓

Generate recommendation

↓

Create journal entry

The user updates one thing.

The system updates everything else.

---

# Long-Term Vision

Turn personal finance from passive tracking into active decision support.

Instead of showing charts, the application continuously answers:

- What changed?
- Why did it change?
- What should I do?
- What will happen if I do X?
- Am I still following my financial plan?

The application should feel like having a personal CFO available at all times.

---

# Success Criteria

At the end of the hackathon, a user should be able to:

- Record financial events.
- Receive intelligent financial recommendations.
- Understand their financial health immediately.
- Simulate decisions before making them.
- Spend less time managing spreadsheets.

---

# Strategy

## Build for Intelligence, Not Infrastructure

The hackathon goal is not to build another finance tracker.

The goal is to build an intelligent financial operating system that demonstrates AI-assisted decision making.

Infrastructure is intentionally minimized so development time can be spent on product intelligence and user experience.

---

## Local-First Architecture

The application is designed to run entirely inside the browser.

Current stack:

- HTML
- CSS
- Vanilla JavaScript
- OpenAI API
- LocalStorage / IndexedDB
- JSON Export & Import

No backend is required for the MVP.

Benefits:

- Faster development
- Offline-friendly
- Zero deployment complexity
- Easy to share
- Easy to demo
- Easy to maintain

---

## AI First

AI is the primary product.

The interface is only a way to communicate with the AI.

The core workflow is:

```
User

↓

Financial Data

↓

Reasoning Engine (LLM)

↓

Structured Decision

↓

Updated Financial State

↓

Actionable Recommendation
```

The value comes from reasoning, not from charts or dashboards.

---

## Decision Engine

Instead of simply recording transactions, every financial event propagates through the system.

```
Income

↓

Categorization

↓

Budget Update

↓

Cash Allocation

↓

Emergency Fund

↓

Investment Allocation

↓

Research Impact

↓

Recommendation

↓

Automatic Journal
```

One user action updates the entire financial system.

---

## Product Philosophy

Traditional finance apps answer:

> What happened?

This product answers:

> What should I do next?

The application should actively help users make better financial decisions instead of only storing financial history.

---

## Long-Term Product Direction

The long-term vision is to evolve from a finance tracker into a complete personal operating system.

```
Finance Tracker

↓

Finance OS

↓

AI Financial Copilot

↓

Personal CFO

↓

Life Operating System
```

Finance is only the first module.

Future modules may include:

- Investment Research
- Career Planning
- Learning
- Reading
- Health
- Projects

All modules share one AI layer and one persistent memory.

---

## Why This Approach?

Frameworks are implementation details.

The competitive advantage comes from:

- Decision quality
- Personalization
- Financial memory
- AI reasoning
- User experience

The MVP prioritizes solving the user's problem before scaling the technical architecture.

Backend, authentication, cloud synchronization, and collaboration will only be introduced when the product requires them.
