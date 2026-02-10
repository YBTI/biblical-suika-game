import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import GameCanvas from './components/GameCanvas';
import EvolutionList from './components/EvolutionList';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center p-2 md:p-4 gap-4 md:gap-8 overflow-hidden relative font-round">
      <div className="flex-1 flex items-center justify-center w-full h-full overflow-hidden">
        <GameCanvas />
      </div>
      
      {/* Desktop View */}
      <div className="hidden md:block h-[650px]">
        <EvolutionList />
      </div>

      {/* Mobile Toggle Button */}
      <button 
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="md:hidden fixed top-4 right-4 z-50 p-2 bg-slate-800 rounded-full border border-slate-600 text-white shadow-lg"
      >
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

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
