# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**backs-note** is an online notepad application for quick note-taking ("notepad online para registro rapidos de notas").

### Architecture
- **Frontend**: React web application
- **Hosting**: Firebase (Firebase Hosting)
- **Database**: Firebase Firestore (for storing notes)
- **Configuration**: Environment variables managed via GitHub (GitHub Actions/Secrets)

### Core Functionality
- Each session creates a new note with a unique ID
- Users can access existing notes by entering the note ID
- Session-based note management (no user authentication required)
- Real-time note storage and retrieval

## Current State

This is a new repository with minimal setup. No package manager, build tools, or source code has been established yet.

## Development Setup

### Prerequisites
- Node.js and npm/yarn
- Firebase CLI (`npm install -g firebase-tools`)
- Firebase project configured

### Environment Variables
Environment variables are stored in GitHub Secrets and injected during deployment:
- `REACT_APP_FIREBASE_API_KEY`
- `REACT_APP_FIREBASE_AUTH_DOMAIN`
- `REACT_APP_FIREBASE_PROJECT_ID`
- `REACT_APP_FIREBASE_STORAGE_BUCKET`
- `REACT_APP_FIREBASE_MESSAGING_SENDER_ID`
- `REACT_APP_FIREBASE_APP_ID`

### Local Development
For local development, create a `.env.local` file (not committed to git) with the Firebase configuration variables.

## Core Development Principles

### Code Quality and Architecture
1. **Clean Architecture** - Follow clean architecture principles with clear separation of concerns
2. **Performance** - Optimize based on Big O notation analysis for algorithms and data structures
3. **Security** - Mitigate against major CVEs and prevent data leaks
4. **Service Resilience** - Implement caching strategies and resilient service patterns
5. **Modern Design** - Apply context-appropriate modern design patterns
6. **Testing** - Ensure functionality through the testing pyramid (unit, integration, e2e)

### Observability and Documentation
7. **Logging and Observability** - Implement comprehensive logging and observability practices
8. **Design System** - Apply design system principles consistently
9. **Phased Development** - Create plans with phases and sub-phases before implementation
10. **Change Documentation** - Document all changes in CHANGELOG.md
11. **Build Quality** - Maintain functional builds and remove unused imports

## Agent Guidelines

### Execution Best Practices
1. **Long-Running Commands** - Cancel or convert to subprocess if commands take too long
2. **Solution Iteration** - If a solution doesn't work, research alternatives on the internet
3. **Token Efficiency** - Focus on implementation over summaries

## License

This project uses the MIT License (see LICENSE file).
