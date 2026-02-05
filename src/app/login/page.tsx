"use client";

import { Suspense } from "react";
import { Container } from "../../components/ui/Container";
import { OAuthButtons } from "../../components/auth/OAuthButtons";
import { LoginForm } from "../../components/auth/LoginForm";
import styles from "./page.module.css";

function LoginContent() {
  return (
    <>
      <OAuthButtons />

      <div className={styles.divider}>
        <span>or continue with email</span>
      </div>

      <LoginForm />
    </>
  );
}

export default function LoginPage() {
  return (
    <div className={styles.loginPage}>
      <Container className={styles.loginContainer}>
        <div className={styles.loginCard}>
          <div className={styles.loginHeader}>
            <div className={styles.logoIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <h1 className={styles.title}>Investor Portal</h1>
            <p className={styles.subtitle}>
              Secure access to your investment dashboard
            </p>
          </div>

          <Suspense fallback={<div className={styles.loading}>Loading...</div>}>
            <LoginContent />
          </Suspense>
        </div>

        <div className={styles.portalInfo}>
          <h2>Need Access?</h2>
          <p>
            Portal access is provided to verified investors only. Contact the
            Ari Integrated Holdings Inc. team for onboarding assistance.
          </p>
        </div>
      </Container>
    </div>
  );
}
