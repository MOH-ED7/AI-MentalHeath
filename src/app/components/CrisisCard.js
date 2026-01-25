import styles from './CrisisCard.module.css';

export default function CrisisCard({ resources, onClose }) {
    if (!resources) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <h2>🚨 Help is Available</h2>
                    <p>{resources.en} / {resources.bm}</p>
                </div>
                <div className={styles.list}>
                    {resources.contacts.map((c, i) => (
                        <div key={i} className={styles.contactItem}>
                            <strong>{c.name}</strong>
                            <div className={styles.numberRow}>
                                <span className={styles.number}>{c.number}</span>
                                <a href={`tel:${c.number.replace(/[-\s]/g, '')}`} className={styles.callButton}>
                                    📞 Call
                                </a>
                            </div>
                            <small>{c.desc}</small>
                        </div>
                    ))}
                </div>
                <button onClick={onClose} className={styles.closeButton}>
                    I understand, continue (Dismiss)
                </button>
            </div>
        </div>
    );
}
