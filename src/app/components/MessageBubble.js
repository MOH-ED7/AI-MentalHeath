import styles from './MessageBubble.module.css';

export default function MessageBubble({ role, content }) {
    const isUser = role === 'user';
    return (
        <div className={`${styles.bubbleWrapper} ${isUser ? styles.userWrapper : styles.aiWrapper}`}>
            <div className={`${styles.bubble} ${isUser ? styles.userBubble : styles.aiBubble}`}>
                {content}
            </div>
            <span className={styles.timestamp}>
                {isUser ? 'You' : 'SobatMinda'}
            </span>
        </div>
    );
}
