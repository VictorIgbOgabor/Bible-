import { useEffect, useState } from "react";
import { useAuth } from "./lib/useAuth";
import { watchProfile, updateProfile } from "./lib/userData";
import {
  registerServiceWorker,
  startReminderWatcher,
} from "./lib/notifications";
import SignInScreen from "./components/SignInScreen";
import BottomNav from "./components/BottomNav";
import TodayScreen from "./components/TodayScreen";
import BibleScreen from "./components/BibleScreen";
import GuidesScreen from "./components/GuidesScreen";
import ProfileScreen from "./components/ProfileScreen";

export default function App() {
  const { user, loading, signIn, logOut } = useAuth();
  const [signInBusy, setSignInBusy] = useState(false);
  const [signInError, setSignInError] = useState("");
  const [profile, setProfile] = useState(null);
  const [tab, setTab] = useState("today");
  const [book, setBook] = useState("Titus");
  const [chapter, setChapter] = useState(2);

  useEffect(() => {
    registerServiceWorker();
  }, []);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      return;
    }
    return watchProfile(user.uid, setProfile);
  }, [user]);

  useEffect(() => {
    if (!profile) return;
    return startReminderWatcher(() => ({
      enabled: profile.notificationsEnabled,
      time: profile.reminderTime,
    }));
  }, [profile]);

  const handleSignIn = async () => {
    setSignInError("");
    setSignInBusy(true);
    try {
      await signIn();
    } catch (e) {
      console.error("Sign-in error:", e);
      setSignInError(
        `Sign-in failed: ${e?.code || ""} ${e?.message || String(e)}`.trim()
      );
    } finally {
      setSignInBusy(false);
    }
  };

  const translation = profile?.translation || "web";
  const setTranslation = (id) =>
    user && updateProfile(user.uid, { translation: id });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy-bg text-ink-muted text-[14px]">
        Loading…
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex justify-center bg-black">
      <div className="w-full max-w-[480px] min-h-screen flex flex-col bg-navy-bg">
        {!user ? (
          <SignInScreen
            onSignIn={handleSignIn}
            error={signInError}
            working={signInBusy}
          />
        ) : (
          <>
            {tab === "today" && (
              <TodayScreen
                translation={translation}
                userName={user.displayName?.split(" ")[0] || "Friend"}
                uid={user.uid}
                profile={profile}
                onGoTo={setTab}
              />
            )}
            {tab === "bible" && (
              <BibleScreen
                book={book}
                chapter={chapter}
                translation={translation}
                uid={user.uid}
                onNavigate={(b, c) => {
                  setBook(b);
                  setChapter(c);
                }}
                onTranslationChange={setTranslation}
              />
            )}
            {tab === "guides" && <GuidesScreen uid={user.uid} />}
            {tab === "profile" && (
              <ProfileScreen
                user={user}
                profile={profile}
                onSignOut={logOut}
              />
            )}
            <BottomNav active={tab} onChange={setTab} />
          </>
        )}
      </div>
    </div>
  );
}
