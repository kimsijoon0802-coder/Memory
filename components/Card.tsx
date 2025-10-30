
import React from 'react';
import { CardType } from '../types';
import { CardBackIcon } from '../constants';

interface CardProps {
  card: CardType;
  onClick: (id: number) => void;
  isDisabled: boolean;
}

const Card: React.FC<CardProps> = ({ card, onClick, isDisabled }) => {
  const isVisible = card.isFlipped || card.isMatched;

  const baseClasses =
    'w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-lg flex items-center justify-center text-4xl sm:text-5xl font-bold transition-all duration-300 ease-in-out transform';

  let dynamicClasses = '';
  if (card.isMatched) {
    dynamicClasses = 'bg-green-500/30 text-white cursor-not-allowed scale-95';
  } else if (isVisible) {
    dynamicClasses = 'bg-slate-200 text-slate-900 scale-105';
  } else {
    dynamicClasses =
      'bg-indigo-500 hover:bg-indigo-400 text-transparent cursor-pointer';
  }

  return (
    <div className="perspective-1000">
        <button
          onClick={() => onClick(card.id)}
          disabled={isDisabled || isVisible}
          className={`${baseClasses} ${dynamicClasses}`}
        >
          <span className={`transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            {card.symbol}
          </span>
          <span className={`absolute transition-opacity duration-300 ${isVisible ? 'opacity-0' : 'opacity-100'}`}>
            {CardBackIcon}
          </span>
        </button>
    </div>
  );
};

export default Card;
