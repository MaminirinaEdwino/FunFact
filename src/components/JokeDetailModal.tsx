import React, { useState } from 'react';
import { Send, Share, Maximize2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { JokeCard } from './JokeCard';
import { Joke, Reaction } from '../types';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface JokeDetailModalProps {
  joke: Joke | null;
  isOpen: boolean;
  onClose: () => void;
  onReaction: (jokeId: string, reaction: Reaction) => void;
  onAddComment: (jokeId: string, content: string) => void;
}

export function JokeDetailModal({ 
  joke, 
  isOpen, 
  onClose, 
  onReaction, 
  onAddComment 
}: JokeDetailModalProps) {
  const [newComment, setNewComment] = useState('');
  const navigate = useNavigate();

  if (!joke) return null;

  const handleAddComment = () => {
    if (newComment.trim()) {
      onAddComment(joke.id, newComment.trim());
      setNewComment('');
    }
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/joke/${joke.id}`;
    
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Lien copié dans le presse-papiers !');
    } catch {
      toast.error('Impossible de copier le lien');
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Fun Fact Détail</DialogTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => navigate(`/joke/${joke.id}`)}>
                <Maximize2 className="w-4 h-4 mr-2" />
                Agrandir
              </Button>
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share className="w-4 h-4 mr-2" />
                Partager
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <JokeCard
            joke={joke}
            onReaction={onReaction}
            onViewDetails={() => {}}
          />

          <div className="border-t pt-6">
            <h3 className="mb-4">
              Commentaires ({joke.comments.length})
            </h3>
            
            <div className="space-y-4 mb-6">
              {joke.comments.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  Aucun commentaire pour le moment. Soyez le premier à réagir !
                </p>
              ) : (
                joke.comments.map((comment) => (
                  <div key={comment.id} className="flex space-x-3 p-4 bg-muted/30 rounded-lg">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback>C</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-sm">Commentateur</span>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm">{comment.content}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="space-y-3">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Ajoutez votre commentaire..."
                rows={3}
                maxLength={300}
              />
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">
                  {newComment.length}/300 caractères
                </span>
                <Button 
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  size="sm"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Publier
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}