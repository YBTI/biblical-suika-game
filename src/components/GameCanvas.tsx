import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';
import { CHARACTERS, type Character } from '../constants/characters';

const GameCanvas: React.FC = () => {
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const [score, setScore] = useState(0);
  const [nextCharacter, setNextCharacter] = useState<Character>(CHARACTERS[0]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [currentBg, setCurrentBg] = useState("url('/background/eden.png')"); // Default Eden

  const containerWidth = 450;
  const containerHeight = 650;
  const deadlineHeight = 100;

  const imagesRef = useRef<Record<string, HTMLImageElement>>({});

  // Background themes
  const getBackgroundStyle = (level: number) => {
    if (level >= 18) return "url('/background/heaven.png')";
    if (level >= 16) return "url('/background/stairway.png')";
    if (level >= 13) return "url('/background/israel.png')";
    if (level >= 10) return "url('/background/canaan.png')";
    if (level >= 7) return "url('/background/desert.png')";
    if (level >= 4) return "url('/background/egypt.png')";
    return "url('/background/eden.png')";
  };

  const updateBackground = () => {
    if (!engineRef.current) return;
    const bodies = Matter.Composite.allBodies(engineRef.current.world);
    let maxLevel = 1;
    bodies.forEach(body => {
      if (body.label.startsWith('char-')) {
        const level = parseInt(body.label.split('-')[1]);
        if (level > maxLevel) maxLevel = level;
      }
    });
    setCurrentBg(getBackgroundStyle(maxLevel));
  };

  useEffect(() => {
    // Preload character images
    CHARACTERS.forEach(char => {
      const img = new Image();
      img.src = char.image;
      img.onload = () => {
        imagesRef.current[char.name] = img;
      };
    });

    // Preload background images
    const backgrounds = [
      '/background/eden.png',
      '/background/egypt.png',
      '/background/desert.png',
      '/background/canaan.png',
      '/background/israel.png',
      '/background/stairway.png',
      '/background/heaven.png'
    ];
    backgrounds.forEach(bg => {
      const img = new Image();
      img.src = bg;
    });
  }, []);

  useEffect(() => {
    if (!sceneRef.current) return;

    const engine = Matter.Engine.create();
    engineRef.current = engine;

    const render = Matter.Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width: containerWidth,
        height: containerHeight,
        wireframes: false,
        background: 'transparent',
      },
    });
    renderRef.current = render;

    // Walls
    const ground = Matter.Bodies.rectangle(containerWidth / 2, containerHeight + 30, containerWidth, 60, { 
      isStatic: true, 
      restitution: 0, 
      friction: 0.8,
      render: { fillStyle: '#e2e8f0' } 
    });
    const leftWall = Matter.Bodies.rectangle(-30, containerHeight / 2, 60, containerHeight, { 
      isStatic: true, 
      restitution: 0, 
      friction: 0.8,
      render: { fillStyle: '#e2e8f0' } 
    });
    const rightWall = Matter.Bodies.rectangle(containerWidth + 30, containerHeight / 2, 60, containerHeight, { 
      isStatic: true, 
      restitution: 0, 
      friction: 0.8,
      render: { fillStyle: '#e2e8f0' } 
    });

    Matter.Composite.add(engine.world, [ground, leftWall, rightWall]);

    // Collision Event
    Matter.Events.on(engine, 'collisionStart', (event) => {
      event.pairs.forEach((pair) => {
        const { bodyA, bodyB } = pair;
        
        if (bodyA.label === bodyB.label && bodyA.label.startsWith('char-')) {
          const level = parseInt(bodyA.label.split('-')[1]);
          if (level < CHARACTERS.length) {
            const nextLevel = level + 1;
            const character = CHARACTERS[nextLevel - 1];
            
            const midX = (bodyA.position.x + bodyB.position.x) / 2;
            const midY = (bodyA.position.y + bodyB.position.y) / 2;
            
            Matter.Composite.remove(engine.world, [bodyA, bodyB]);
            
            const newChar = createCharacterBody(midX, midY, character);
            Matter.Composite.add(engine.world, newChar);
            
            setScore((prev) => prev + character.score);
          }
        }
      });
    });

    // Custom Rendering for Images
    Matter.Events.on(render, 'afterRender', () => {
      const context = render.context;
      const bodies = Matter.Composite.allBodies(engine.world);

      bodies.forEach(body => {
        if (body.label.startsWith('char-') && render.bounds) {
          const level = parseInt(body.label.split('-')[1]);
          const character = CHARACTERS[level - 1];
          const img = imagesRef.current[character.name];
          
          if (img) {
            const { x, y } = body.position;
            const radius = character.radius;

            context.save();
            context.beginPath();
            context.arc(x, y, radius, 0, 2 * Math.PI);
            context.clip();
            context.drawImage(img, x - radius, y - radius, radius * 2, radius * 2);
            context.restore();
            
            // Optional: Add a subtle border
            context.beginPath();
            context.arc(x, y, radius, 0, 2 * Math.PI);
            context.lineWidth = 2;
            context.strokeStyle = "#ffffff";
            context.stroke();
          }
        }
      });
    });

    Matter.Render.run(render);
    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);

    return () => {
      Matter.Render.stop(render);
      Matter.Engine.clear(engine);
      if (render.canvas) render.canvas.remove();
    };
  }, []);

  const createCharacterBody = (x: number, y: number, character: Character) => {
    return Matter.Bodies.circle(x, y, character.radius, {
      label: `char-${character.level}`,
      restitution: 0.05, // Significant reduction in bounciness
      friction: 0.5,     // More grip, less "slippery plastic" feel
      frictionAir: 0.02, // Slight air damping for smoother movement
      slop: 0.1,        // Allow a tiny bit of overlap for "squishy" feel
      render: {
        fillStyle: 'transparent',
        strokeStyle: 'transparent',
        lineWidth: 0,
      },
    });
  };

  const handleClick = (e: React.MouseEvent) => {
    if (isGameOver || !engineRef.current || !sceneRef.current) return;

    const rect = sceneRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / scale;
    
    const safeX = Math.max(nextCharacter.radius, Math.min(containerWidth - nextCharacter.radius, x));
    
    const newChar = createCharacterBody(safeX, 50, nextCharacter);
    Matter.Composite.add(engineRef.current.world, newChar);
    
    const nextIdx = Math.floor(Math.random() * 5);
    setNextCharacter(CHARACTERS[nextIdx]);
  };

  const checkGameOver = () => {
    if (!engineRef.current) return;
    const bodies = Matter.Composite.allBodies(engineRef.current.world);
    const overflow = bodies.some(body => {
      return !body.isStatic && body.position.y < deadlineHeight && body.velocity.y < 0.1;
    });

    if (overflow) {
      setIsGameOver(true);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      checkGameOver();
      updateBackground();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const [scale, setScale] = useState(1);

  // Responsive scaling
  useEffect(() => {
    const handleResize = () => {
      const padding = 32; // Standard padding
      const availableWidth = window.innerWidth - padding;
      const availableHeight = window.innerHeight - 200; // Leave space for header
      
      const scaleX = availableWidth / containerWidth;
      const scaleY = availableHeight / containerHeight;
      const newScale = Math.min(1, scaleX, scaleY); // Don't scale up past original size
      
      setScale(newScale);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex flex-col items-center gap-2 md:gap-4 w-full max-w-full overflow-hidden">
      <div 
        className="text-slate-700 text-center bg-white/50 px-4 py-2 md:py-4 rounded-3xl shadow-sm backdrop-blur-sm border-2 border-white w-full max-w-[450px]"
        style={{ transform: `scale(${scale < 0.9 ? 0.9 : 1})`, transformOrigin: 'top' }}
      >
        <h1 className="text-2xl md:text-3xl font-bold mb-2 md:mb-3 text-pink-500 tracking-widest drop-shadow-sm whitespace-nowrap">✨ キリスト・バトン ✨</h1>
        <div className="flex gap-4 md:gap-8 text-lg md:text-xl items-center justify-center">
          <div className="bg-orange-100 px-3 py-0.5 md:px-4 md:py-1 rounded-full text-orange-600 font-bold border-2 border-orange-200">
            Score: <span className="font-mono text-xl md:text-2xl ml-1 md:ml-2">{score}</span>
          </div>
          <div className="flex items-center gap-2 md:gap-3 bg-blue-100 px-3 py-0.5 md:px-4 md:py-1 rounded-full border-2 border-blue-200">
            <span className="text-blue-600 font-bold text-xs md:text-sm">Next:</span>
            <div 
              className="flex items-center justify-center bg-white rounded-full border-2 border-blue-200 overflow-hidden relative shadow-inner"
              style={{ 
                width: nextCharacter.radius * 1.2 * 0.6, // Adjusted for mobile
                height: nextCharacter.radius * 1.2 * 0.6,
                backgroundColor: nextCharacter.color 
              }}
            >
              <img 
                src={nextCharacter.image} 
                alt={nextCharacter.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-bold text-slate-600 text-sm md:text-base">{nextCharacter.name}</span>
          </div>
        </div>
      </div>
      
      <div className="relative flex items-center justify-center" style={{ width: containerWidth * scale, height: containerHeight * scale }}>
        <div 
          ref={sceneRef} 
          onClick={handleClick}
          className="relative rounded-3xl shadow-xl border-4 border-white cursor-crosshair overflow-hidden backdrop-blur-sm transition-all duration-1000 ease-in-out origin-center"
          style={{ 
            width: containerWidth, 
            height: containerHeight,
            background: currentBg,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transform: `scale(${scale})`,
            position: 'absolute'
          }}
        >
          <div 
            className="absolute w-full border-t-4 border-pink-300 border-dashed opacity-60 pointer-events-none" 
            style={{ top: deadlineHeight }}
          ></div>
          {isGameOver && (
            <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center text-slate-700 z-10 backdrop-blur-sm">
              <h2 className="text-4xl md:text-5xl font-bold mb-2 text-pink-500 drop-shadow-sm">GAME OVER</h2>
              <p className="text-lg md:text-xl mb-6 font-bold text-slate-500">Score: {score}</p>
              <button 
                onClick={() => window.location.reload()}
                className="px-6 py-2 md:px-8 md:py-3 bg-gradient-to-r from-pink-400 to-orange-400 text-white rounded-full font-bold shadow-lg hover:scale-105 transition-transform border-2 border-white text-lg md:text-xl"
              >
                もう一度遊ぶ 🔄
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameCanvas;
