import styles from './Container.module.css';

interface ContainerProps {
    children: React.ReactNode;
    className?: string;
    /** Narrow reading-width container (≈780px) for long-form pages. */
    narrow?: boolean;
    as?: 'div' | 'section' | 'article' | 'header' | 'footer' | 'nav';
    id?: string;
}

export function Container({ children, className = '', narrow = false, as: Tag = 'div', id }: ContainerProps) {
    return (
        <Tag id={id} className={`${styles.container} ${narrow ? styles.narrow : ''} ${className}`.trim()}>
            {children}
        </Tag>
    );
}
