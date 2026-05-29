# Product Requirements Document (PRD) - Academix LMS

## 1. Product Overview
**Academix** is a comprehensive, production-grade Learning Management System (LMS) designed to facilitate a complete educational lifecycle. The platform serves three primary user roles: Admins, Instructors, and Students. It provides a robust set of tools for course creation, content management, student enrollment, and progress tracking, all while maintaining a high standard of UX and accessibility.

## 2. Target Audience
- **Students:** Individuals looking to learn new skills through structured online courses, track their progress, and take quizzes.
- **Instructors:** Subject matter experts who need a platform to create, manage, and sell their educational content.
- **Admins:** Platform owners who manage categories, approve courses, and oversee the general operation of the site.

## 3. Key Features

### 3.1 Public & Student Experience
- **Landing Page:** A professional home page featuring highlighted courses, categories, and easy search access.
- **Course Discovery:**
    - Advanced course listing with grid/list view toggles and pagination.
    - Robust search and filtering by category, level, and price.
    - URL-synchronized filters for easy sharing.
- **Course Details:** Rich previews including video trailers, instructor bios, detailed metadata (duration, lectures, level), and student reviews.
- **Enrollment & Learning:**
    - One-click enrollment/purchase flow.
    - **My Learning** dashboard to track active and pending courses.
    - Integrated video player for lectures and an interactive quiz interface.
    - Automatic progress tracking and "Resume Learning" capability.
- **User Profile:** Personal information management and an overview of learning achievements.

### 3.2 Instructor & Admin Experience
- **Dashboard:** Specialized management interface for tracking courses and platform stats.
- **Advanced Course Builder:**
    - Multi-step course creation (metadata, pricing, media).
    - Hierarchical content management: Sections → Lectures → Quizzes.
    - Drag-and-drop reordering for sections.
- **Quiz Maker:** Custom quiz creation tool with support for multiple-choice questions, timed limits, and point allocation.
- **Category Management:** Full CRUD operations for course categories with support for localized names (AR/EN).
- **Course Lifecycle Management:** Ability to edit, delete, and track the status (Active/Pending) of courses.

### 3.3 Localization & UX
- **Internationalization (i18n):** Full support for Arabic (AR) and English (EN).
- **RTL Support:** Native Right-to-Left layout handling for the Arabic language.
- **Responsive Design:** Fully optimized experience across Desktop, Tablet, and Mobile devices.
- **Accessibility:** High contrast, legible typography, and intuitive navigation.

## 4. Technical Architecture

### 4.1 Frontend Stack
- **Framework:** Next.js 16+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4 with Shadcn UI (Radix UI primitives)
- **State Management:** Zustand (Client-side), TanStack Query (Server-state/Caching)
- **Form Handling:** Formik & Yup
- **Rich Text Editing:** Lexical
- **Authentication:** Context-based (JWT with Cookies/Jose)
- **Internationalization:** react-i18next

### 4.2 Core Data Models
- **User:** Role-based (Student, Instructor, Admin) with profile metadata.
- **Course:** Metadata, price, level, status, and associations with categories and instructors.
- **Section:** Grouping mechanism for lectures and quizzes within a course.
- **Lecture:** Educational content (Video URL, description, duration).
- **Quiz:** Timed assessment with multiple questions and point tracking.
- **Category:** Classification for courses (Localized).

## 5. User Interface & Experience
- **Modern Aesthetic:** Clean, card-based UI with consistent spacing and typography.
- **Interactive Feedback:** Loading skeletons, toast notifications (Sonner), and progress bars.
- **Mobile-First Components:** Mobile filters implemented as drawers, while desktop uses inline controls.
- **Navigation:** Multi-level sidebar for dashboards and a sticky navbar for the public site.

## 6. Future Roadmap
- **Payment Gateway Integration:** Direct checkout with providers like Stripe or PayPal.
- **Live Sessions:** Integration with Zoom or Google Meet for synchronous learning.
- **Certification System:** Automated PDF certificate generation upon course completion.
- **Community Features:** Discussion forums and direct messaging between students and instructors.
- **Mobile App:** Native mobile experience using React Native or Flutter.
