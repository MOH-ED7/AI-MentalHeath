import React from 'react';
import type { CrisisResources } from '../utils/safety';

interface CrisisCardProps {
    resources: CrisisResources | null;
    onClose: () => void;
}

const CrisisCard: React.FC<CrisisCardProps> = ({ resources, onClose }) => {
    if (!resources) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-xl">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-red-600 mb-2">🚨 Help is Available</h2>
                    <p className="text-gray-700">{resources.en}</p>
                    <p className="text-gray-500 text-sm mt-1 italic">{resources.bm}</p>
                </div>
                <div className="space-y-4">
                    {resources.contacts.map((c, i) => (
                        <div key={i} className="border border-gray-200 rounded-lg p-3 bg-red-50">
                            <strong className="block text-lg text-gray-900">{c.name}</strong>
                            <div className="flex justify-between items-center mt-1">
                                <span className="text-xl font-mono text-gray-800">{c.number}</span>
                                <a
                                    href={`tel:${c.number.replace(/[-\s]/g, '')}`}
                                    className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold hover:bg-red-700 transition"
                                >
                                    📞 Call
                                </a>
                            </div>
                            <small className="text-gray-600">{c.desc}</small>
                        </div>
                    ))}
                </div>
                <button
                    onClick={onClose}
                    className="mt-6 w-full py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold transition"
                >
                    I understand, continue (Dismiss)
                </button>
            </div>
        </div>
    );
};

export default CrisisCard;
