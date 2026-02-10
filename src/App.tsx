import { useState } from 'react';
import { Menu, X, RotateCcw } from 'lucide-react';
import GameCanvas from './components/GameCanvas';
import EvolutionList from './components/EvolutionList';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleReset = () => {
    if (window.confirm('本当にリセットしますか？\n現在のスコアもリセットされます。')) {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-start md:justify-center p-2 md:p-4 gap-2 md:gap-8 overflow-hidden relative font-round pt-4 md:pt-0">
      <div className="flex-initial flex items-center justify-center w-full overflow-hidden">
        <GameCanvas />
      </div>
      
      {/* Desktop View */}
      <div className="hidden md:block h-[650px]">
        <EvolutionList />
      </div>

      {/* Mobile Controls (Bottom Right) */}
      <div className="md:hidden fixed bottom-6 right-6 z-50 flex gap-3">
        <button 
          onClick={handleReset}
          className="p-3 bg-white/80 backdrop-blur-md rounded-full border-2 border-orange-200 text-orange-500 shadow-xl hover:bg-white transition-all active:scale-95"
          title="リセット"
        >
          <RotateCcw size={24} />
        </button>
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-3 bg-slate-800/90 backdrop-blur-md rounded-full border-2 border-slate-600 text-white shadow-xl hover:bg-slate-700 transition-all active:scale-95"
          title="進化の系譜"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <div className={`
        md:hidden fixed inset-y-0 right-0 w-80 bg-slate-900/95 backdrop-blur-md z-40 transform transition-transform duration-300 ease-in-out border-l border-slate-700
        ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <div className="h-full pt-16 px-4 pb-4">
          <EvolutionList />
        </div>
      </div>
    </div>
  );
}

export default App;
