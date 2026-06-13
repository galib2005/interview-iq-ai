# Contributing to InterviewIQ AI

Thank you for your interest in contributing to **InterviewIQ AI**! Follow this guide to submit pull requests, report issues, and develop features.

## Code of Conduct
Please maintain a friendly, cooperative, and inclusive environment.

## Getting Started
1. Fork the repository.
2. Clone your fork locally:
   ```bash
   git clone https://github.com/your-username/interviewiq-ai.git
   ```
3. Initialize the backend and frontend dev environments as outlined in the [README.md](README.md).

## Development Workflow
* Create a feature branch matching your upgrade:
  ```bash
  git checkout -b feat/your-improvement-name
  ```
* Write clean, commented code. Follow current patterns for both frontend controllers and backend mongoose models.
* Run compilation checks before staging code:
  * Backend: `npm run build` inside `backend/`
  * Frontend: `npm run build` inside `frontend/`

## Commit Style Guidelines
We use semantic commit messages to structure our version updates. Examples:
* `feat(v2): add project viva mode, company interview mode, AI interview memory, and career readiness analytics`
* `fix(navbar): resolve translucent text overlaps by making background solid`
* `docs: update setup and API guides inside README`

## Submitting Pull Requests
1. Push your branch to GitHub.
2. Open a Pull Request against the main branch.
3. Detail all additions and include screenshots/recordings of any UI modifications.
