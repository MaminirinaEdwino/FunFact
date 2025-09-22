import { useEffect, useMemo, useState } from 'react';
import { Joke, Filter, Reaction, Comment } from '../../../types';
import { getJokes, createJoke } from '../services/jokesApi';
import { toast } from 'sonner';

export function useJokes() {
  const [jokes, setJokes] = useState<Joke[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setInitialLoading(true);
        const list = await getJokes();
        setJokes(list);
      } catch (e) {
        console.error(e);
        toast.error("Impossible de charger les fun facts depuis l'API");
      } finally {
        setInitialLoading(false);
      }
    })();
  }, []);

  const addJoke = async (content: string, tags: string[] = []) => {
    try {
      setActionLoading(true);
      await createJoke(content);
      const list = await getJokes();
      setJokes(list);
      toast.success('Fun fact publié avec succès ! 🎉');
    } catch (e) {
      console.error(e);
      toast.error("La publication via l'API a échoué.");
    } finally {
      setActionLoading(false);
    }
  };

  const updateReaction = (jokeId: string, reaction: Reaction) => {
    setJokes(prev => prev.map(joke => {
      if (joke.id !== jokeId) return joke;
      const wasFunny = joke.userReaction === 'funny';
      const wasMeh = joke.userReaction === 'meh';
      const wasDisliked = joke.userReaction === 'dislike';
      let funny = joke.funny - (wasFunny ? 1 : 0) + (reaction === 'funny' && !wasFunny ? 1 : 0);
      let meh = joke.meh - (wasMeh ? 1 : 0) + (reaction === 'meh' && !wasMeh ? 1 : 0);
      let dislikes = joke.dislikes - (wasDisliked ? 1 : 0) + (reaction === 'dislike' && !wasDisliked ? 1 : 0);
      const next = reaction === joke.userReaction ? null : reaction;
      return { ...joke, funny, meh, dislikes, userReaction: next };
    }));
  };

  const addComment = (jokeId: string, content: string) => {
    const comment: Comment = { id: Date.now().toString(), content, createdAt: new Date(), jokeId };
    setJokes(prev => prev.map(joke => joke.id === jokeId ? { ...joke, comments: [...joke.comments, comment] } : joke));
    toast.success('Commentaire ajouté !');
  };

  return { jokes, setJokes, initialLoading, actionLoading, addJoke, updateReaction, addComment };
}
