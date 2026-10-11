# MoneySmart – Financial Literacy Learning Platform

## Project introduction
MoneySmart is a beginner-friendly, browser-based financial literacy web app for students in Grades 11 and 12. It helps students learn money basics through clear budgeting guidance and interactive savings, investing and safety activities without using real money.

## Project objectives
- Teach students how to budget and manage money responsibly.
- Encourage saving habits and emergency planning.
- Explain investing in simple language using hypothetical examples.
- Help students identify scams and protect personal information.
- Reward progress with points, badges and a progress dashboard.

## Learning modules
1. Plan and Budget
2. Save and Manage
3. Understand Investing
4. Stay Financially Safe

The app opens on a login/sign-up page. After signing in, the home page contains the Home, Progress, Dashboard, and Sign out controls, a short introduction, and a **Start Learning** button. The button opens `learning.html`, a separate hub with all four pillars and shortcuts to games, challenges, and quizzes. Home links return to the signed-in home page.

## Technologies used
- HTML5
- CSS3
- Vanilla JavaScript
- LocalStorage for browser-based demo progress
- Firebase Authentication for email/password accounts
- Cloud Firestore for account profiles and learning progress

## Folder structure
```text
FinancialLiteracy/
├── index.html
├── learning.html
├── quizzes.html
├── quizzes.js
├── budget.html
├── savings.html
├── investing.html
├── safety.html
├── dashboard.html
├── style.css
├── script.js
├── firebase.js
├── firebase-config.js
├── favicon.svg
├── server.py
├── .env.example
├── savings.js
├── investing.js
├── safety.js
├── challenge.html
├── challenge.js
├── dashboard.js
├── README.md
```

## How to open and run the project in VS Code
1. Open VS Code.
2. Open the folder `FinancialLiteracy`.
3. Follow the local server instructions below to use the AI-generated Quizzes feature. Opening pages with `file://` or a static Live Server will not provide the quiz-generation API.

## How to run the app and AI-generated quizzes
The quiz generator can use the Groq API through a local Python server. Its API key stays in a local `.env` file and is never included in browser code or committed to Git. Without a configured key, quizzes use a built-in rotating practice bank so students can still play.

```powershell
cd FinancialLiteracy
Copy-Item .env.example .env
notepad .env
```

Add a newly rotated key to `GROQ_API_KEY` in `.env` and save it. From the same folder, start the server using the repository's virtual environment:

```powershell
..\.venv\Scripts\python.exe server.py
```

Then visit `http://127.0.0.1:8001/quizzes.html`. Other pages are available on the same server. The server defaults to port 8001 so it can run alongside the existing static server. Quiz requests from the local static app on another port are routed to this server; the server permits browser requests only from `localhost` or `127.0.0.1`. If the repository virtual environment is unavailable, use an installed Python 3 command in place of `..\.venv\Scripts\python.exe`.

**Security:** The previously pasted API key should be revoked and replaced before using AI generation. Never paste the replacement key into HTML or JavaScript, and do not commit `.env`. The server accepts only the three known quiz topics, limits request frequency, and checks that each generated quiz contains the expected question count and four options per question.

## Connect Firebase
1. Create a Firebase project and register a Web app in the Firebase console.
2. In **Authentication → Sign-in method**, enable **Email/Password**. Configure the Firebase password policy to require at least 8 characters, an uppercase letter, a number, and a non-alphanumeric character.
3. Create a **Cloud Firestore** database.
4. Copy the Web app configuration values into `firebase-config.js`.
5. In **Firestore → Rules**, use rules that restrict each account to its own document:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

Run the site over a local HTTP server (not `file://`) and open `index.html`. The login and signed-in home experience are on `index.html`; the existing learning-module pages remain independently accessible. The account form supports creating an account and signing in with an email address and password. New passwords must be at least 8 characters and include an uppercase letter, a number, and a special character. Firebase Authentication handles credentials; the password is never written to Firestore. Firestore stores each user's UID, email address, learning progress, and savings goal when signed in. Use **Download my data (JSON)** after signing in to export that user's profile and progress.

The Firebase web configuration is included in the client and is not a password or private server key. Keep Firestore access protected with the rules above; never put service-account credentials in this static website.

### Troubleshooting Firebase sign-in
- **`auth/configuration-not-found` or `auth/operation-not-allowed`:** In Firebase Console, open **Authentication → Sign-in method**, enable **Email/Password**, and save. If Authentication is not initialized, choose **Get started** first.
- **`auth/unauthorized-domain`:** Under **Authentication → Settings → Authorized domains**, add the hostname used by the local server (for example, `localhost` or `127.0.0.1`).
- Verify that `firebase-config.js` contains the Web app configuration from the same Firebase project where Authentication is enabled.
- A browser console `favicon.ico` 404 is unrelated to Firebase; the app uses its local `favicon.svg` icon instead.

## How to test each module
- Money game: play The Time Capsule Tower, set a goal and timeline, allocate 100 monthly virtual coins among the Safe Vault, Growth Fund, and Volatile Options, and compare simulated outcomes.
- Savings module: read the saving habits lesson, enter a goal and weekly contribution, calculate the estimated time to reach it, and choose **Save & Continue** to save the goal and open the investing module.
- Investing module: review the basics of time, compounding and diversification, then enter a starting amount, monthly contribution, assumed return and time period to view an illustrative future value.
- Financial safety module: review three practical safety rules and note the official cyber-fraud reporting channels.
- Quizzes hub: choose Budgeting Basics (five questions), Emergency Funds, or Digital Scam Safety (three questions each); the server generates fresh questions on every topic selection. Pass with at least two correct to earn 50 Golden Coins, 100 Knowledge XP, and its mastery badge once.
- Challenges: play the single Phone Screen Shock scenario; choosing the emergency-buffer option unlocks the Crisis Navigator badge.
- Quiz coins and Knowledge XP are saved with browser progress, shown in the wallet and dashboard, and synced to Firestore when signed in.
- Dashboard: confirm saved points, module completion and badges appear correctly.

## How progress is stored
The app keeps a browser copy of demo progress in LocalStorage. When the user is signed in and Firebase is configured, it also syncs progress to that user's Firestore record. Progress includes:
- points
- completed modules
- quiz scores
- earned badges
- savings goal status

Signed-in progress is associated with the Firebase UID. Users can export their account data from the home page or reset learning progress from the dashboard.

## Current limitations
- Firebase must be configured in `firebase-config.js` before account sign-in or Firestore sync works.
- It is a learning prototype and not a real financial product.
- The language toggle supports English and Telugu for key interface text, with English used as fallback where needed.

## Future enhancements
- Add more lessons and interactive story-based learning.
- Expand quiz questions and game-based challenges.
- Improve accessibility and language support.
- Add animations and a more detailed progress dashboard.
- Convert to a larger education platform with more learning paths.

## Educational note
The Time Capsule Tower and investing growth calculator are for learning only. Their assumptions are not forecasts; they exclude fees, taxes and inflation, do not recommend specific investment products, and do not guarantee real-world returns.
