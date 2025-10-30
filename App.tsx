
import React, { useState, useEffect, useCallback } from 'react';
import Card from './components/Card';
import { CardType } from './types';
import { SYMBOLS } from './constants';

const App: React.FC = () => {
  const [cards, setCards] = useState<CardType[]>([]);
  const [flippedCardIds, setFlippedCardIds] = useState<number[]>([]);
  const [moves, setMoves] = useState<number>(0);
  const [isGameWon, setIsGameWon] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(false);

  const initializeGame = useCallback(() => {
    const doubledSymbols = [...SYMBOLS, ...SYMBOLS];
    const shuffledSymbols = doubledSymbols.sort(() => Math.random() - 0.5);

    setCards(
      shuffledSymbols.map((symbol, index) => ({
        id: index,
        symbol: symbol,
        isFlipped: false,
        isMatched: false,
      }))
    );
    setFlippedCardIds([]);
    setMoves(0);
    setIsGameWon(false);
    setIsChecking(false);
  }, []);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  useEffect(() => {
    if (flippedCardIds.length !== 2) return;

    setIsChecking(true);
    setMoves((prev) => prev + 1);

    const [firstId, secondId] = flippedCardIds;
    const firstCard = cards.find((c) => c.id === firstId);
    const secondCard = cards.find((c) => c.id === secondId);

    if (firstCard && secondCard) {
      if (firstCard.symbol === secondCard.symbol) {
        setCards((prevCards) =>
          prevCards.map((card) =>
            card.symbol === firstCard.symbol ? { ...card, isMatched: true, isFlipped: true } : card
          )
        );
        setFlippedCardIds([]);
        setIsChecking(false);
      } else {
        setTimeout(() => {
          setCards((prevCards) =>
            prevCards.map((card) =>
              card.id === firstId || card.id === secondId ? { ...card, isFlipped: false } : card
            )
          );
          setFlippedCardIds([]);
          setIsChecking(false);
        }, 1000);
      }
    }
  }, [flippedCardIds, cards]);
  
  useEffect(() => {
    if (cards.length > 0 && cards.every((card) => card.isMatched)) {
        setTimeout(() => {
            setIsGameWon(true);
        }, 500);
    }
  }, [cards]);

  const handleCardClick = (id: number) => {
    if (isChecking || flippedCardIds.includes(id)) return;
    
    const clickedCard = cards.find(c => c.id === id);
    if (!clickedCard || clickedCard.isFlipped || clickedCard.isMatched) return;

    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === id ? { ...card, isFlipped: true } : card
      )
    );

    setFlippedCardIds((prev) => [...prev, id]);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white font-sans p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          Memory Match
        </h1>
        <p className="text-slate-400 mt-2">Find all the matching pairs!</p>
      </div>

      <div className="mb-6 px-6 py-2 bg-slate-800 rounded-full">
        <p className="text-lg font-medium">Moves: <span className="text-xl font-bold text-cyan-400">{moves}</span></p>
      </div>

      <div className="grid grid-cols-4 gap-2 sm:gap-4 p-4 bg-slate-800/50 rounded-lg shadow-2xl shadow-black/30">
        {cards.map((card) => (
          <Card key={card.id} card={card} onClick={handleCardClick} isDisabled={isChecking} />
        ))}
      </div>

      <button 
        onClick={initializeGame} 
        className="mt-8 px-6 py-2 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-full transition-transform duration-200 hover:scale-105"
      >
        Restart Game
      </button>

      {isGameWon && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-slate-800 p-8 rounded-2xl shadow-lg text-center border border-slate-700 animate-fade-in-up">
            <h2 className="text-4xl font-bold text-green-400 mb-2">You Won!</h2>
            <p className="text-slate-300 mb-6">Congratulations! You matched all pairs in {moves} moves.</p>
            <button 
              onClick={initializeGame}
              className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-full text-lg transition-transform duration-200 hover:scale-105"
            >
              Play Again
            </button>
          </div>
        </div>
      )}
      <style>{`
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
        }
        .perspective-1000 {
            perspective: 1000px;
        }
      `}</style>
    </div>
  );
};

export default App;
