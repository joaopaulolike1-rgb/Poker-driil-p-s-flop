import React from 'react';
import { ActionFeedback } from './pokerTrainerTypes';

interface Props {
  feedback: ActionFeedback;
  onNextHand: () => void;
}

export const GtoFeedbackModal: React.FC<Props> = ({ feedback, onNextHand }) => {
  const getBadgeStyle = () => {
    switch (feedback.quality) {
      case 'EXCELLENT':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50';
      case 'INACCURACY':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/50';
      case 'BLUNDER':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#120810] p-5 text-white shadow-2xl space-y-4">
        {/* Cabeçalho de Qualidade */}
        <div className="text-center space-y-2">
          <div className={`inline-block px-4 py-1.5 rounded-full border text-xs font-black tracking-widest uppercase ${getBadgeStyle()}`}>
            {feedback.qualityText}
          </div>
          <p className="text-xs text-gray-300">
            Ação executada: <span className="font-extrabold text-white">{feedback.actionTaken}</span>
          </p>
        </div>

        {/* Matriz / Frequências GTO */}
        <div className="space-y-2 bg-black/40 p-3 rounded-xl border border-white/5">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Frequências GTO Calculadas</p>
          {Object.entries(feedback.frequencies).map(([act, freq]) => (
            <div key={act} className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span>{act}</span>
                <span className="font-mono text-yellow-400">{freq}%</span>
              </div>
              <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-yellow-500 to-amber-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${freq}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Explicação Teórica */}
        <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-[11px] text-gray-300 leading-relaxed">
          {feedback.explanation}
        </div>

        {/* Avançar Próxima Mão */}
        <button
          onClick={onNextHand}
          className="w-full py-3 bg-gradient-to-r from-yellow-500 to-amber-500 text-black font-extrabold rounded-xl shadow-lg hover:brightness-110 active:scale-[0.98] transition-all text-xs tracking-wider uppercase"
        >
          Próxima Mão →
        </button>
      </div>
    </div>
  );
};