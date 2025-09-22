import React from 'react';
import { MessageCircle, Flag, Eye } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { ReactionBar } from './ReactionBar';
import { Joke, Reaction } from '../types';

interface JokeCardProps {
  joke: Joke;
  onReaction: (jokeId: string, reaction: Reaction) => void;
  onViewDetails: (jokeId: string) => void;
  onReport?: (jokeId: string) => void;
  showAdminActions?: boolean;
}

export function JokeCard({ 
  joke, 
  onReaction, 
  onViewDetails, 
  onReport,
  showAdminActions = false 
}: JokeCardProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <Card className="w-full hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="w-8 h-8 md:w-10 md:h-10">
              <AvatarFallback className="text-base md:text-lg">🤠</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-sm md:text-base">Blagueur</p>
              <p className="text-xs md:text-sm text-muted-foreground">
                {formatDate(joke.createdAt)}
              </p>
            </div>
          </div>
          {showAdminActions && joke.isReported && (
            <Badge variant="destructive" className="text-xs">
              <Flag className="w-3 h-3 mr-1" />
              Signalé
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <h3 className="mb-3 font-medium text-base md:text-lg">{joke.title}</h3>
        <p className="text-sm md:text-base leading-relaxed text-muted-foreground mb-4">
          {joke.content}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {joke.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              #{tag}
            </Badge>
          ))}
        </div>

        {/* Comments preview */}
        {joke.comments.length > 0 && (
          <div className="space-y-2 mb-4 p-3 bg-muted/30 rounded-lg">
            <p className="text-xs font-medium text-muted-foreground">Commentaires récents :</p>
            {joke.comments.slice(-2).map((comment) => (
              <div key={comment.id} className="flex items-start space-x-2">
                <Avatar className="w-5 h-5 md:w-6 md:h-6">
                  <AvatarFallback className="text-xs">C</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground truncate">
                    {comment.content}
                  </p>
                </div>
              </div>
            ))}
            {joke.comments.length > 2 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onViewDetails(joke.id)}
                className="text-xs h-6 p-0"
              >
                Voir tous les {joke.comments.length} commentaires
              </Button>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-3 border-t">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-3">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <ReactionBar
              funny={joke.funny}
              meh={joke.meh}
              dislikes={joke.dislikes}
              userReaction={joke.userReaction}
              onReaction={(reaction) => onReaction(joke.id, reaction)}
            />

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewDetails(joke.id)}
              className="flex items-center space-x-1"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Commenter</span>
              <span className="sm:hidden">({joke.comments.length})</span>
              <span className="hidden sm:inline">({joke.comments.length})</span>
            </Button>
          </div>

          <div className="flex items-center space-x-2 self-end sm:self-auto">
            {onReport && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onReport(joke.id)}
                className="text-xs"
              >
                <Flag className="w-4 h-4" />
                <span className="hidden sm:inline ml-1">Signaler</span>
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewDetails(joke.id)}
              className="text-xs"
            >
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline ml-1">Détails</span>
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}