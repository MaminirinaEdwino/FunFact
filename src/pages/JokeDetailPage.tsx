import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Joke, Comment } from '../types';
import { getJokeById } from '../features/jokes/services/jokesApi';
import { Loader2, Maximize2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { JokeCard } from '../components/JokeCard';
import { Textarea } from '../components/ui/textarea';
import { Avatar, AvatarFallback } from '../components/ui/avatar';

export default function JokeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [joke, setJoke] = useState<Joke | null>(null);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    (async () => {
      if (!id) return;
      setLoading(true);
      const j = await getJokeById(id);
      setJoke(j);
      setLoading(false);
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin" />
          <p className="text-muted-foreground">Chargement du fun fact...</p>
        </div>
      </div>
    );
  }

  if (!joke) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-muted-foreground">Fun fact introuvable.</p>
        <Button className="mt-4" onClick={() => navigate(-1)}>Retour</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Détail du fun fact</h1>
        <Button variant="outline" onClick={() => navigate(-1)}>
          Retour
        </Button>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-end">
          <Button variant="ghost" onClick={() => navigate(`/joke/${joke.id}`)} disabled>
            <Maximize2 className="w-4 h-4 mr-2" />
            Plein écran
          </Button>
        </div>
        <JokeCard joke={joke} onReaction={() => {}} onViewDetails={() => {}} />

        <div className="border-t pt-6">
          <h3 className="mb-4">Commentaires ({joke.comments.length})</h3>

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
                        {new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(comment.createdAt)}
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
              <span className="text-xs text-muted-foreground">{newComment.length}/300 caractères</span>
              <Button
                onClick={() => {
                  if (!newComment.trim()) return;
                  const c: Comment = { id: Date.now().toString(), content: newComment.trim(), createdAt: new Date(), jokeId: joke.id };
                  setJoke(prev => prev ? { ...prev, comments: [...prev.comments, c] } : prev);
                  setNewComment('');
                }}
                disabled={!newComment.trim()}
                size="sm"
              >
                Publier
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
