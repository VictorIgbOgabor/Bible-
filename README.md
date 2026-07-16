# Verses — Bible App

React + Vite + Tailwind Bible app with:

- **Google Sign-In** (Firebase Auth) — each user gets their own account
- **Per-user data** (Firestore) — streak, notes, prayer requests, reading
  plan progress, translation/notification preferences, all synced across
  devices
- **Live multi-translation Bible text** from bible-api.com (WEB, KJV, ASV,
  BBE, Darby, YLT — free, no key, public domain)
- **Working prayer feature** — today's devotional prayer + your own prayer
  list, mark requests as answered
- **Daily reminder notifications** (best-effort local notifications — see
  limits below)
- Installable as a PWA (manifest + service worker + icons included)

## 1. Set up Firebase (required before this runs)

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
   → **Add project** (free Spark plan is enough).
2. **Build → Authentication → Get started → Sign-in method → Google** →
   enable it.
3. **Build → Firestore Database → Create database** → start in
   **production mode** (the included `firestore.rules` locks data to each
   signed-in user).
4. Deploy the rules: either paste the contents of `firestore.rules` into
   the Firebase console's Rules tab and **Publish**, or use the CLI:
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase init firestore   # point it at this repo, keep existing rules file
   firebase deploy --only firestore:rules
   ```
5. **Project settings (gear icon) → General → Your apps → Add app → Web**.
   Copy the `firebaseConfig` values.
6. **Authentication → Settings → Authorized domains** — add `localhost`
   (usually already there) and, after you deploy, your Vercel domain
   (e.g. `verses-app.vercel.app`).

## 2. Add your Firebase config

Copy `.env.example` to `.env.local` and fill in the values from step 1.5:

```bash
cp .env.example .env.local
```

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

`.env.local` is git-ignored — never commit it.

## 3. Run it locally (Termux)

```bash
pkg install nodejs git -y
npm install
npm run dev -- --host
```

Open the printed Network URL. Sign-in with Google requires `localhost` (or
the Network IP if you added it to Authorized domains) to work — Firebase
popups won't work over `file://`.

## 4. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<you>/verses-app.git
git push -u origin main
```

Use a [personal access token](https://github.com/settings/tokens) as the
password when prompted.

## 5. Deploy to Vercel

1. [vercel.com/new](https://vercel.com/new) → import the repo.
2. Framework preset: **Vite** (auto-detected).
3. **Before deploying**, add the same 6 `VITE_FIREBASE_*` variables from
   step 2 under **Environment Variables**.
4. Deploy. Then go back to Firebase → Authentication → Authorized domains
   and add your `*.vercel.app` domain, or sign-in will fail on production.

## Notifications — what's real vs. what needs more setup

**What works out of the box:** turning on "Daily Reminder" in Profile asks
for notification permission, and the app checks every 30 seconds while
it's open (or running installed as a PWA in the background on browsers
that support it) — at your chosen time, it fires a real local notification.

**What this doesn't do:** wake up and notify you when the app/browser is
fully closed. True background push (like other Bible apps do) needs:

1. Firebase Cloud Messaging (`firebase/messaging`) to get a device token.
2. A server that stores each user's token + reminder time and sends a push
   at that time — typically a **scheduled Firebase Cloud Function**, which
   requires upgrading to the **Blaze (pay-as-you-go) plan** (has a
   generous free quota, but needs a billing account attached).

The current `public/sw.js` already listens for `push` events, so once you
add step 1–2 server-side, notifications will start arriving even when the
app is closed — no client code changes needed.

## Adding licensed translations (NIV, ESV, NLT)

`bible-api.com` only serves public-domain text. To add NIV/ESV, get a free
key from [api.bible](https://scripture.api.bible) or the
[ESV API](https://api.esv.org/), add it as an env var, and wire a new fetch
function in `src/lib/bibleApi.js`, then register it in `TRANSLATIONS`.

## Building the Android app (Capacitor)

This project includes a native Android wrapper via
[Capacitor](https://capacitorjs.com), set up under `android/`. It's a real
installable app (APK/AAB) — not a browser "Add to Home Screen" shortcut.

### Get a debug APK to test on your phone

You don't need Android Studio for this — GitHub Actions builds it for you.

1. In your GitHub repo, go to **Settings → Secrets and variables →
   Actions → New repository secret**, and add these 6 secrets (same values
   as your `.env.local`):
   `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`,
   `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`,
   `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID`.
2. Push to `main` (or go to the **Actions** tab → "Android Debug APK" →
   **Run workflow**).
3. When it finishes, open the workflow run → **Artifacts** →
   `verses-debug-apk` → download and unzip it on your phone.
4. Open the `.apk` file to install. Android will warn about "unknown
   sources" the first time — that's expected for a non-Play-Store APK;
   allow it for this file.

### Publishing to Google Play

1. **Create a Play Console account** — one-time $25 fee, at
   [play.google.com/console](https://play.google.com/console/signup).
2. **Generate a signing keystore** (do this once, keep it forever — losing
   it means you can never update the app again under the same listing):
   ```bash
   keytool -genkeypair -v -keystore release-key.jks -keyalg RSA \
     -keysize 2048 -validity 10000 -alias verses
   ```
   (Requires a JDK — `pkg install openjdk-21` in Termux if `keytool` isn't
   found.) It'll ask for passwords and your name/org — remember the
   passwords.
3. **Add these as GitHub secrets** (Settings → Secrets and variables →
   Actions):
   - `ANDROID_KEYSTORE_BASE64` — run `base64 -w0 release-key.jks` and paste
     the output
   - `ANDROID_KEYSTORE_PASSWORD` — the keystore password you set
   - `ANDROID_KEY_ALIAS` — `verses` (or whatever alias you used)
   - `ANDROID_KEY_PASSWORD` — the key password you set
4. **Run the release workflow**: Actions tab → "Android Release Bundle" →
   **Run workflow**. Download the `verses-release-aab` artifact when done —
   that `.aab` file is what you upload to Play Console.
5. In Play Console: create an app, upload the `.aab` under **Production**
   (or **Internal testing** first, recommended), then fill in the store
   listing — app icon (already in `assets/icon.png`), screenshots (take
   these from your phone), short/full description, privacy policy URL
   (required — even a simple hosted page saying what data you collect via
   Firebase/Google Sign-In), and content rating questionnaire.
6. Submit for review. First review can take a few days.

**Note:** Google's policies discourage apps that are just a bare WebView
with no real functionality. This app already has genuine features (auth,
saved data, notifications) which help, but for the smoothest review it
helps to also add a couple of native touches over time (e.g. a native
share sheet via `@capacitor/share`, or `@capacitor/local-notifications`
for the reminder instead of the current web-based one).

### Updating the app after code changes

Every push to `main` rebuilds the debug APK automatically. For a Play
Store update, bump `versionCode` and `versionName` in
`android/app/build.gradle`, then re-run the release workflow and upload
the new `.aab` to Play Console.



```
src/
  App.jsx                    – auth gate, tab routing, notification watcher
  lib/
    firebase.js                – Firebase app/auth/Firestore init
    useAuth.js                  – Google sign-in/out hook
    userData.js                 – Firestore CRUD (profile, notes, prayers, plans, history)
    bibleApi.js                 – live Bible text fetch + cache
    notifications.js            – permission + local reminder watcher
  components/
    SignInScreen.jsx            – Google sign-in
    BottomNav.jsx                – Today / Bible / Guides / Profile tabs
    TodayScreen.jsx               – verse of day, share, notes, prayer, streak
    BibleScreen.jsx                – chapter reader, mark as read, translation/book pickers
    GuidesScreen.jsx                – reading plans with real progress tracking
    ProfileScreen.jsx                – account info, notification toggle, sign out
    PrayerSheet.jsx / NotesSheet.jsx / TranslationSheet.jsx / BookChapterSheet.jsx
  data/books.js               – 66-book/chapter-count table
public/
  sw.js                      – service worker (local + future push notifications)
  manifest.json, icon-*.png – PWA install support
firestore.rules             – per-user data access rules
```

## Customizing brand color

Colors live in `tailwind.config.js` → `theme.extend.colors`:
`navy.bg/card/hover/border`, `brand.orange`, `brand.purple`,
`ink/ink.muted/ink.faint`.
