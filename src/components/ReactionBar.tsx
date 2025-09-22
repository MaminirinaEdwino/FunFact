import { Button } from './ui/button';
import { ThumbsDown } from 'lucide-react';
import { Reaction } from '../types';
import React from 'react';

interface ReactionBarProps {
  funny: number;
  meh: number;
  dislikes: number;
  userReaction?: Reaction | null;
  onReaction: (reaction: Reaction) => void;
}

export function ReactionBar({ funny, meh, dislikes, userReaction, onReaction }: ReactionBarProps) {
  return (
    <div className="flex items-center space-x-2">
      <Button
        variant={userReaction === 'funny' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onReaction('funny')}
        className="flex items-center space-x-1"
      >
        <span className="text-lg">😂</span>
        <span>{funny}</span>
      </Button>
      
      <Button
        variant={userReaction === 'meh' ? 'secondary' : 'ghost'}
        size="sm"
        onClick={() => onReaction('meh')}
        className="flex items-center space-x-1"
      >
        <span className="text-lg">😐</span>
        <span>{meh}</span>
      </Button>

      <Button
        variant={userReaction === 'dislike' ? 'destructive' : 'ghost'}
        size="sm"
        onClick={() => onReaction('dislike')}
        className="flex items-center space-x-1"
      >
        <ThumbsDown className="w-4 h-4" />
        <span>{dislikes}</span>
      </Button>
    </div>
  );
}