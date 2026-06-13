# Changelog

All notable changes to this project will be documented in this file.

## [2.0.0] - 2026-06-14

### Added
- **Project Viva Mode:** Dynamic viva mock question generator parsing resume projects across Beginner, Intermediate, and Advanced tiers.
- **Company Interview Mode:** Interview flow simulator supporting custom styles for TCS, Infosys, Wipro, Accenture, Cognizant, Capgemini, HCL, Tech Mahindra, and Amazon.
- **Weak Topic Tracking:** Dedicated MongoDB `WeakTopic` collection to auto-log and track candidate concept struggles (< 60% score).
- **AI Mock Memory:** Adaptively injects historically weak topics back into generated mock questions.
- **Company Mock Analytics:** Tracking company mock attempts, average scores, and best performance metrics.
- **Career Readiness Score V2:** Dynamic capability index (35% Interview + 30% Coding + 20% Resume ATS + 15% Consistency index).
- **Advanced Dashboard Widgets:** Opaque glass widgets showing career readiness gauge, difficulty analytics, syllabus progress, and Project Viva scorecard grids.

### Fixed
- Fixed navbar/header background transparency to be always solid and opaque for scroll readability.
- Corrected Career Readiness V2 and Difficulty Analytics to start at 0% for new/empty user accounts instead of pre-populating fallback default averages.

## [1.0.0] - 2026-06-13

### Added
- Core AI Mock Interview Studio (HR, Technical, Mixed, and Custom rounds).
- Sandbox Coding Assessment Arena supporting JavaScript execution and runtime evaluation.
- Browser-native Web Speech API speech-to-text and text-to-speech mock simulations.
- Resume intelligence skill gaps parsing and ATS score indexing.
- Unified tabbed SaaS dashboard holding timelines and activity metrics.
- Responsive dark-theme design.
