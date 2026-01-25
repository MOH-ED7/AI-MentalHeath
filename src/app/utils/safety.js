export const CRISIS_KEYWORDS = [
    /suicide/i, /kill myself/i, /end my life/i, /hurt myself/i, /die/i,
    /bunuh diri/i, /mati/i, /cederakan diri/i, /tamat riwayat/i
];

export const CRISIS_RESOURCES = {
    en: "If you're feeling unsafe, please reach out immediately:",
    bm: "Jika anda rasa tidak selamat, sila hubungi segera:",
    contacts: [
        { name: "Talian Kasih", number: "15999", desc: "24/7 Support" },
        { name: "Befrienders KL", number: "03-7627 2929", desc: "Emotional Support" },
        { name: "HEAL Line (MOH)", number: "15555", desc: "Mental Health Aid" }
    ]
};

export function detectCrisis(text) {
    return CRISIS_KEYWORDS.some(pattern => pattern.test(text));
}
