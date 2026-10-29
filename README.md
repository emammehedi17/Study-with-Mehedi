# JSC Scholarship Exam Prep by Emam Mehedi

An interactive, centralized educational study hub for Bangladeshi students preparing for the **Junior Scholarship Examination (JSC)**. Created and organized by **Emam Mehedi**.

---

## 1. How to Run the Website Locally

### Prerequisites
- **Node.js** (v18+ recommended)
- **npm** (comes with Node.js)

### Steps
1. Install project dependencies:
   ```bash
   npm install
   ```
2. Start the local development server (runs on port `3000`):
   ```bash
   npm run dev
   ```
3. Open your browser and navigate to `http://localhost:3000`.

---

## 2. How to Build and Deploy to Netlify

Because this application is 100% client-side and uses `LocalStorage` for user preferences and study progress, it requires no backend server or database and deploys directly to Netlify or GitHub Pages.

### Netlify Deployment Settings
- **Build command:** `npm run build`
- **Publish directory:** `dist`

You can also run `npm run build` locally and drag-and-drop the generated `dist/` folder directly into the Netlify Drop dashboard.

---

## 3. How to Add New Study Materials

All subjects and study resources are stored in a single authoritative data file:
`src/data/resources.ts`

To add a new PDF resource:
1. Open `src/data/resources.ts`.
2. Add a new object to the `STUDY_RESOURCES` array:
   ```ts
   {
     id: 'bangla-07',
     subjectId: 'bangla', // 'bangla' | 'english' | 'math' | 'science' | 'bgs'
     serialNumber: 7,
     title: 'নতুন স্টাডি রিসোর্সের নাম',
     category: 'মডেল টেস্ট ও প্রশ্নপত্র',
     url: 'https://drive.google.com/open?id=YOUR_FILE_ID&usp=drive_copy',
     keywords: ['bangla', 'বাংলা', 'মডেল টেস্ট'],
   }
   ```
   - If a resource is shared across multiple subjects (such as the combined Science & BGS Model Test), include `sharedSubjects: ['science', 'bgs']`. It will automatically appear in both subject pages while counting as a single unique resource in global statistics.
3. Save the file. All subject cards, resource counts, progress bars, category filters, and global search results update automatically.

---

## 4. How to Change Social & Contact Links

All personal branding and verified social/contact links are centralized in `src/data/resources.ts` inside the `CREATOR_BRANDING` object:

```ts
export const CREATOR_BRANDING: CreatorBranding = {
  siteTitle: 'JSC Scholarship Exam Prep by Emam Mehedi',
  creatorName: 'Emam Mehedi',
  email: 'emammehedi17@gmail.com',
  facebookUrl: 'https://facebook.com/emammehedi17',
  websiteUrl: 'https://classcaddy.netlify.app/',
  classCaddyLinks: {
    home: 'https://classcaddy.netlify.app/',
    about: 'https://classcaddy.netlify.app/about',
    contact: 'https://classcaddy.netlify.app/contact',
    archives: 'https://classcaddy.netlify.app/archives',
    studyPlan: 'https://classcaddy.netlify.app/study_plan',
  },
};
```

Updating any URL in `CREATOR_BRANDING` automatically updates both the **About the Creator** section and the **Footer**.

---

## 5. How Bookmarks and Study Progress Are Stored

- All student activity is stored locally in the browser's `localStorage` via `src/hooks/useStudyStore.ts`:
  - `jsc_prep_theme_v1`: Light or Dark mode preference.
  - `jsc_prep_accent_v1`: Selected accent color (`emerald`, `violet`, `blue`, `amber`).
  - `jsc_prep_bookmarks_v1`: Array of bookmarked resource IDs.
  - `jsc_prep_progress_v1`: Object mapping resource IDs to `'not_started' | 'in_progress' | 'completed'`.
  - `jsc_prep_recent_v1`: List of recently opened PDFs (with timestamps).
  - `jsc_prep_daily_goal_v1`: Daily study target and sessions completed today.
- No personal data or login credentials are collected or transmitted to external servers.

---

## 6. How to Modify the Theme and Colors

- **Fonts & Print Styles:** Configured in `index.html` and `src/index.css` using `Plus Jakarta Sans` (English display/UI), `Hind Siliguri` (Bengali typography), and `JetBrains Mono` (tabular metrics and timers).
- **Subject Accent Colors:** Assigned per subject in `src/data/resources.ts` (`violet` for Bangla, `blue` for English, `emerald` for Mathematics, `cyan` for Science, and `amber` for BGS) and styled in `src/App.tsx`, `src/components/SubjectDetailView.tsx`, and `src/components/ResourceCard.tsx`.
