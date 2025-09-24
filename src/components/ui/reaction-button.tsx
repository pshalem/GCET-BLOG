import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import type { Reaction } from '@/types';

interface ReactionButtonProps {
  type: Reaction['type'];
  count?: number;
  isActive?: boolean;
  onReact: (type: Reaction['type']) => void;
}

const reactionEmojis = {
  clap: '👏',
  like: '❤️',
  celebrate: '🎉',
  fire: '🔥'
};

const reactionColors = {
  clap: 'hover:bg-reaction-clap/10 hover:text-reaction-clap',
  like: 'hover:bg-reaction-like/10 hover:text-reaction-like',
  celebrate: 'hover:bg-reaction-celebrate/10 hover:text-reaction-celebrate',
  fire: 'hover:bg-reaction-fire/10 hover:text-reaction-fire'
};

const activeColors = {
  clap: 'bg-reaction-clap/10 text-reaction-clap',
  like: 'bg-reaction-like/10 text-reaction-like',
  celebrate: 'bg-reaction-celebrate/10 text-reaction-celebrate',
  fire: 'bg-reaction-fire/10 text-reaction-fire'
};

export function ReactionButton({ type, count = 0, isActive = false, onReact }: ReactionButtonProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    setIsAnimating(true);
    onReact(type);
    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <motion.div
      whileTap={{ scale: 0.95 }}
      animate={isAnimating ? { scale: [1, 1.3, 1] } : {}}
      transition={{ duration: 0.3 }}
    >
      <Button
        variant="ghost"
        size="sm"
        onClick={handleClick}
        className={`
          px-2 py-1 h-auto text-sm transition-all duration-200
          ${isActive ? activeColors[type] : reactionColors[type]}
        `}
      >
        <span className="text-base mr-1">{reactionEmojis[type]}</span>
        {count > 0 && <span className="text-xs">{count}</span>}
      </Button>
    </motion.div>
  );
}