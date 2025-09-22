import React, { useMemo, useState } from 'react';
import { FilterBar } from '../components/FilterBar';
import { JokeCard } from '../components/JokeCard';
import { AddJokeModal } from '../components/AddJokeModal';
import { JokeDetailModal } from '../components/JokeDetailModal';
import { Button } from '../components/ui/button';
import { Loader2 } from 'lucide-react';
import { Joke, Comment, Filter, Reaction } from '../types';
import { toast } from 'sonner';
import { useJokes } from '../features/jokes/hooks/useJokes';

export default function HomePage() {
  const { jokes, setJokes, initialLoading, actionLoading, addJoke, updateReaction, addComment } = useJokes();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedJoke, setSelectedJoke] = useState<Joke | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [currentFilter, setCurrentFilter] = useState<Filter>('all');
  const [selectedTag, setSelectedTag] = useState('');

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const ITEMS_PER_PAGE = 5;

  // data loading handled in useJokes

  const availableTags = useMemo(() => {
    const tags = new Set<string>();
    jokes.forEach(joke => joke.tags.forEach(tag => tags.add(tag)));
    return Array.from(tags).sort();
  }, [jokes]);

  const filteredJokes = useMemo(() => {
    let filtered = jokes.filter(joke => !joke.isHidden);
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(joke =>
        joke.title.toLowerCase().includes(query) ||
        joke.content.toLowerCase().includes(query) ||
        joke.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    if (selectedTag) {
      filtered = filtered.filter(joke => joke.tags.includes(selectedTag));
    }
    switch (currentFilter) {
      case 'recent':
        filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
      case 'popular':
        filtered.sort((a, b) => (b.funny - b.dislikes) - (a.funny - a.dislikes));
        break;
      case 'controversial':
        filtered.sort((a, b) => (b.funny + b.meh + b.dislikes) - (a.funny + a.meh + a.dislikes));
        break;
      default:
        filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }
    return filtered;
  }, [jokes, searchQuery, selectedTag, currentFilter]);

  const paginatedJokes = filteredJokes.slice(0, page * ITEMS_PER_PAGE);
  const hasMore = filteredJokes.length > page * ITEMS_PER_PAGE;

  const loadMore = () => {
    setLoading(true);
    setTimeout(() => {
      setPage(prev => prev + 1);
      setLoading(false);
    }, 800);
  };

  const handleAddJoke = async (
    newJokeData: Omit<Joke, 'id' | 'createdAt' | 'funny' | 'meh' | 'dislikes' | 'comments' | 'isReported' | 'isHidden' | 'userReaction'>
  ) => {
    await addJoke(newJokeData.content, newJokeData.tags ?? []);
    setIsAddModalOpen(false);
  };

  const handleReaction = (jokeId: string, reaction: Reaction) => updateReaction(jokeId, reaction);

  const handleViewDetails = (jokeId: string) => {
    const joke = jokes.find(j => j.id === jokeId);
    if (joke) {
      setSelectedJoke(joke);
      setIsDetailModalOpen(true);
    }
  };

  const handleAddComment = (jokeId: string, content: string) => {
    const newComment: Comment = { id: Date.now().toString(), content, createdAt: new Date(), jokeId };
    setJokes(prev => prev.map(j => j.id === jokeId ? { ...j, comments: [...j.comments, newComment] } : j));
    if (selectedJoke?.id === jokeId) setSelectedJoke(prev => (prev ? { ...prev, comments: [...prev.comments, newComment] } : null));
  };

  const handleReport = (jokeId: string) => {
    setJokes(prev => prev.map(joke => (joke.id === jokeId ? { ...joke, isReported: true } : joke)));
    toast.success('Contenu signalé aux modérateurs');
  };

  if (initialLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin" />
          <p className="text-muted-foreground">Chargement des fun facts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1">
      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        currentFilter={currentFilter}
        onFilterChange={setCurrentFilter}
        selectedTag={selectedTag}
        onTagChange={setSelectedTag}
        availableTags={availableTags}
      />
      <div className="container mx-auto px-4 mt-2 flex justify-end">
        <Button onClick={() => setIsAddModalOpen(true)}>
          Ajouter un fun fact
        </Button>
      </div>
      <div className="container mx-auto px-4 py-4 md:py-8">
        {paginatedJokes.length === 0 && !loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Aucun fun fact trouvé.</p>
            <Button onClick={() => setIsAddModalOpen(true)} className="mt-4">Créer le premier fun fact</Button>
          </div>
        ) : (
          <div className="space-y-4 md:space-y-6">
            {paginatedJokes.map((joke) => (
              <JokeCard
                key={joke.id}
                joke={joke}
                onReaction={handleReaction}
                onViewDetails={handleViewDetails}
                onReport={handleReport}
              />
            ))}
            {hasMore && (
              <div className="flex justify-center pt-6">
                <Button onClick={loadMore} disabled={loading} variant="outline" className="w-full md:w-auto">
                  {loading ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" />Chargement...</>) : ('Charger plus')}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      <AddJokeModal
        isOpen={isAddModalOpen}
        onClose={() => !actionLoading && setIsAddModalOpen(false)}
        onSubmit={handleAddJoke}
        loading={actionLoading}
      />

      <JokeDetailModal
        joke={selectedJoke}
        isOpen={isDetailModalOpen}
        onClose={() => { setIsDetailModalOpen(false); setSelectedJoke(null); }}
        onReaction={handleReaction}
        onAddComment={handleAddComment}
      />
    </div>
  );
}


