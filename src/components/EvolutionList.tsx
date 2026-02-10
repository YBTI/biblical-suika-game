import React from 'react';
import { CHARACTERS } from '../constants/characters';

const EvolutionList: React.FC = () => {
  return (
    <div className="h-full w-full md:w-64 bg-white/60 rounded-2xl shadow-xl border-2 border-white/80 flex flex-col overflow-hidden backdrop-blur-md">
      <div className="p-4 bg-white/50 border-b-2 border-white/50">
        <h2 className="text-lg font-bold text-center text-pink-500 tracking-wider">☁️ 進化の系譜 ☁️</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        {CHARACTERS.map((char) => (
          <div 
            key={char.level} 
            className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/60 transition-colors bg-white/30 shadow-sm"
          >
            <div 
              className="flex-shrink-0 w-12 h-12 rounded-full border-2 border-white/20 overflow-hidden bg-slate-900"
              style={{ borderColor: char.color }}
            >
              <img 
                src={char.image} 
                alt={char.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-slate-500">Level {char.level}</span>
              <span className="font-bold text-sm text-slate-700">{char.name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EvolutionList;
