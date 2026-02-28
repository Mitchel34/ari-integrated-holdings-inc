"use client";

import { Suspense } from "react";
import Image from "next/image";
import { Container } from "../../components/ui/Container";
import { LoginForm } from "../../components/auth/LoginForm";
import styles from "./page.module.css";

function LoginContent() {
  return <LoginForm />;
}

export default function LoginPage() {
  return (
    <div className={styles.loginPage}>
      <Container className={styles.loginContainer}>
        <div className={styles.loginCard}>
          <div className={styles.loginHeader}>
            <Image
              src="/logo.jpeg"
              alt="Ari Integrated Holdings Inc."
              width={110}
              height={110}
              className={styles.loginLogo}
              priority
            />
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
