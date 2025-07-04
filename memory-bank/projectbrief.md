# TalkieUZ - Wedding Invitation Platform

## Project Overview
TalkieUZ is a comprehensive wedding invitation platform that allows couples to create beautiful, personalized wedding websites with RSVP management, photo galleries, and guest collaboration features.

## Core Requirements

### Core Features
- **Wedding Website Creation**: Beautiful templates with customizable colors, themes, and content
- **RSVP Management**: Guest invitation system with response tracking
- **Photo Gallery**: Upload and manage wedding photos
- **Guest Book**: Allow guests to leave messages
- **Multi-language Support**: English, Russian, and Uzbek languages
- **Guest Collaboration**: Allow family/friends to help manage guest lists
- **Admin Dashboard**: Site-wide administration and user management

### User Types
- **Couples**: Primary wedding owners who create and manage their wedding site
- **Guest Managers**: Collaborators who can help manage guest lists
- **Guests**: People invited to the wedding who can RSVP
- **Admins**: Site administrators with system-wide access

### Technical Architecture
- **Frontend**: React with TypeScript, Vite, TailwindCSS
- **Backend**: Express.js with TypeScript
- **Database**: SQLite with Drizzle ORM (PostgreSQL fallback)
- **Storage**: File uploads for photos
- **Authentication**: JWT tokens for sessions

## Critical Requirements
- **Data Persistence**: All user data must be permanently stored
- **User Experience**: Modern, mobile-responsive design
- **Multi-tenancy**: Support multiple weddings on the same platform
- **Security**: Secure authentication and authorization 