import React from 'react';
import { useTrainerStore } from '../../../store/useTrainerStore';

export const GtoFeedbackModal: React.FC = () => {
  const feedback = useTrainerStore((state) => state.feedback);
  const nextHand = useTrainerStore((state) => state.nextHand);

  if (!feedback) return null;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 select-none animate-fade-in">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#120810] p-5 text-white shadow-2xl space-y-4">
        {/* Quality Header */}
        <div className="text-center space-y-1.5">
          <div className={`inline-block px-4 py-1 rounded-full border text-xs font-black uppercase tracking-wider ${getBadgeStyle()}`}>
            {feedback.qualityText}
          </div>
          <p className="text-xs text-slate-400">
            Categoria da Mão: <span className="font-bold text-amber-400">{feedback.handCategory}</span>
          </p>
        </div>

        {/* Action Taken vs GTO Recommendation */}
        <div className="grid grid-cols-2 gap-2 text-center text-xs bg-white/5 p-2.5 rounded-xl border border-white/5">
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-bold">Sua Ação</p>
            <p className="font-extrabold text-white mt-0.5">{feedback.userAction}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-bold">Linha Recomendada</p>
            <p className="font-extrabold text-amber-400 mt-0.5">{feedback.recommendedAction}</p>
          </div>
        </div>

        {/* GTO Frequencies */}
        <div className="space-y-2 bg-black/40 p-3 rounded-xl border border-white/5">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Frequências GTO Calculadas</p>
          {Object.entries(feedback.frequencies).map(([act, freq]) => (
            <div key={act} className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span>{act}</span>
                <span className="font-mono text-amber-400">{freq}%</span>
              </div>
              <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-amber-500 to-amber-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${freq}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Explanation */}
        <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-[11px] text-slate-300 leading-relaxed">
          {feedback.explanation}
        </div>

        {/* Next Hand Button */}
        <button
          onClick={nextHand}
          className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 font-black text-black text-xs uppercase tracking-wider rounded-xl shadow-lg hover:brightness-110 active:scale-[0.99] transition-all"
        >
          Próxima Mão
        </button>
      </div>
    </div>
  );
};