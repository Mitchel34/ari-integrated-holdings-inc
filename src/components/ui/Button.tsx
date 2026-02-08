import { cloneElement, isValidElement } from 'react';
import styles from './Button.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    asChild?: boolean;
}

export function Button({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    asChild = false,
    ...props
}: ButtonProps) {
    const buttonClassName = `${styles.button} ${styles[variant]} ${styles[size]} ${className}`.trim();

    if (asChild && isValidElement(children)) {
        const child = children as React.ReactElement<{ className?: string }>;
        return cloneElement(child, {
            className: `${buttonClassName} ${child.props.className ?? ''}`.trim(),
        });
    }

    return (
        <button
            className={buttonClassName}
            {...props}
        >
            {children}
        </button>
    );
}
