import { cloneElement, isValidElement } from 'react';
import styles from './Button.module.css';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    /** Render the child element (e.g. a Link) with button styling. */
    asChild?: boolean;
    /** Stretch to the container width. */
    block?: boolean;
}

export function Button({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    asChild = false,
    block = false,
    type,
    ...props
}: ButtonProps) {
    const buttonClassName = [
        styles.button,
        styles[variant],
        styles[size],
        block ? styles.block : '',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    if (asChild && isValidElement(children)) {
        const child = children as React.ReactElement<{ className?: string }>;
        return cloneElement(child, {
            className: `${buttonClassName} ${child.props.className ?? ''}`.trim(),
        });
    }

    return (
        <button type={type ?? 'button'} className={buttonClassName} {...props}>
            {children}
        </button>
    );
}
