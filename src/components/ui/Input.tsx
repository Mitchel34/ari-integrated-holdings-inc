"use client";

import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";
import styles from "./Input.module.css";

interface FieldChromeProps {
  label?: string;
  error?: string;
  hint?: string;
  /** Show a gold asterisk after the label. */
  requiredMark?: boolean;
}

function FieldChrome({
  id,
  label,
  error,
  hint,
  requiredMark,
  children,
}: FieldChromeProps & { id: string; children: React.ReactNode }) {
  return (
    <div className={styles.inputGroup}>
      {label ? (
        <label htmlFor={id} className={styles.label}>
          {label}
          {requiredMark ? <span className={styles.required} aria-hidden="true">*</span> : null}
        </label>
      ) : null}
      {children}
      {error ? (
        <span id={`${id}-error`} className={styles.error} role="alert">
          {error}
        </span>
      ) : hint ? (
        <span id={`${id}-hint`} className={styles.hint}>
          {hint}
        </span>
      ) : null}
    </div>
  );
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement>, FieldChromeProps {
  /** Use the monospace numeric face (for amounts, tickers, codes). */
  mono?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, requiredMark, mono, className = "", id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || props.name || generatedId;
    const describedBy = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined;

    return (
      <FieldChrome id={inputId} label={label} error={error} hint={hint} requiredMark={requiredMark ?? props.required}>
        <input
          ref={ref}
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={`${styles.input} ${mono ? styles.mono : ""} ${error ? styles.inputError : ""} ${className}`.trim()}
          {...props}
        />
      </FieldChrome>
    );
  }
);

Input.displayName = "Input";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement>, FieldChromeProps {}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, requiredMark, className = "", id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || props.name || generatedId;
    const describedBy = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined;

    return (
      <FieldChrome id={inputId} label={label} error={error} hint={hint} requiredMark={requiredMark ?? props.required}>
        <textarea
          ref={ref}
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={`${styles.textarea} ${error ? styles.inputError : ""} ${className}`.trim()}
          {...props}
        />
      </FieldChrome>
    );
  }
);

Textarea.displayName = "Textarea";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement>, FieldChromeProps {}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, requiredMark, className = "", id, children, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || props.name || generatedId;
    const describedBy = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined;

    return (
      <FieldChrome id={inputId} label={label} error={error} hint={hint} requiredMark={requiredMark ?? props.required}>
        <select
          ref={ref}
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={`${styles.select} ${error ? styles.inputError : ""} ${className}`.trim()}
          {...props}
        >
          {children}
        </select>
      </FieldChrome>
    );
  }
);

Select.displayName = "Select";
