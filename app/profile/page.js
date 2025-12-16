"use client";

import { useStore } from "@/lib/store";

export default function ProfilePage() {
  const { user, logout } = useStore();

  return (
    <main className="page">
      <section className="profile-page">
        <div className="section-header">
          <h2>Your Profile</h2>
        </div>
        <div className="profile-card" id="profileInfo">
          {!user ? (
            <p>You are not logged in.</p>
          ) : (
            <>
              <p>
                <strong>Name:</strong> {user.name}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p className="muted">
                This is a front-end only demo. No real backend, password or
                address is stored.
              </p>
            </>
          )}
        </div>
        {user && (
          <button className="btn ghost" onClick={logout}>
            Logout
          </button>
        )}
      </section>
    </main>
  );
}
