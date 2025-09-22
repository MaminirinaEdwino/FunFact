import React, { useState } from 'react';
import { Flag, Eye, EyeOff, Trash2, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { JokeCard } from './JokeCard';
import { Joke } from '../types';
import { toast } from 'sonner';

interface AdminPanelProps {
  jokes: Joke[];
  onHideJoke: (jokeId: string) => void;
  onDeleteJoke: (jokeId: string) => void;
  onUnhideJoke: (jokeId: string) => void;
}

export function AdminPanel({ jokes, onHideJoke, onDeleteJoke, onUnhideJoke }: AdminPanelProps) {
  const [filter, setFilter] = useState<'reported' | 'hidden' | 'all'>('reported');

  const reportedJokes = jokes.filter(joke => joke.isReported);
  const hiddenJokes = jokes.filter(joke => joke.isHidden);
  const allJokes = jokes;

  const getFilteredJokes = () => {
    switch (filter) {
      case 'reported':
        return reportedJokes;
      case 'hidden':
        return hiddenJokes;
      case 'all':
        return allJokes;
      default:
        return reportedJokes;
    }
  };

  const handleHideJoke = (jokeId: string) => {
    onHideJoke(jokeId);
    toast.success('Fun fact masqué avec succès');
  };

  const handleDeleteJoke = (jokeId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer définitivement ce fun fact ?')) {
      onDeleteJoke(jokeId);
      toast.success('Fun fact supprimé avec succès');
    }
  };

  const handleUnhideJoke = (jokeId: string) => {
    onUnhideJoke(jokeId);
    toast.success('Fun fact rendu visible');
  };

  const filteredJokes = getFilteredJokes();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">⚙️ Administration</h1>
        <p className="text-muted-foreground">
          Gérez les signalements et modérez le contenu.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center">
              <Flag className="w-4 h-4 mr-2 text-red-500" />
              Signalements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportedJokes.length}</div>
            <p className="text-xs text-muted-foreground">À traiter</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center">
              <EyeOff className="w-4 h-4 mr-2 text-orange-500" />
              Masqués
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{hiddenJokes.length}</div>
            <p className="text-xs text-muted-foreground">Fun facts cachés</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center">
              <Eye className="w-4 h-4 mr-2 text-green-500" />
              Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{jokes.length}</div>
            <p className="text-xs text-muted-foreground">Fun facts totaux</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2 mb-6">
        <Button
          variant={filter === 'reported' ? 'default' : 'outline'}
          onClick={() => setFilter('reported')}
          className="flex items-center space-x-2"
        >
          <Flag className="w-4 h-4" />
          <span>Signalés ({reportedJokes.length})</span>
        </Button>
        <Button
          variant={filter === 'hidden' ? 'default' : 'outline'}
          onClick={() => setFilter('hidden')}
          className="flex items-center space-x-2"
        >
          <EyeOff className="w-4 h-4" />
          <span>Masqués ({hiddenJokes.length})</span>
        </Button>
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
          className="flex items-center space-x-2"
        >
          <Eye className="w-4 h-4" />
          <span>Tous ({jokes.length})</span>
        </Button>
      </div>

      {/* Content */}
      {filteredJokes.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-medium mb-2">Aucun contenu à afficher</h3>
            <p className="text-muted-foreground">
              {filter === 'reported' && 'Aucun fun fact signalé pour le moment.'}
              {filter === 'hidden' && 'Aucun fun fact masqué pour le moment.'}
              {filter === 'all' && 'Aucun fun fact trouvé.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {filteredJokes.map((joke) => (
            <div key={joke.id} className="relative">
              {joke.isHidden && (
                <Alert className="mb-4">
                  <EyeOff className="h-4 w-4" />
                  <AlertDescription>
                    Ce fun fact est actuellement masqué et n'est pas visible par les utilisateurs.
                  </AlertDescription>
                </Alert>
              )}
              
              <div className="flex gap-4">
                <div className="flex-1">
                  <JokeCard
                    joke={joke}
                    onReaction={() => {}}
                    onViewDetails={() => {}}
                    showAdminActions={true}
                  />
                </div>
                
                <div className="flex flex-col space-y-2 min-w-[120px]">
                  {!joke.isHidden ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleHideJoke(joke.id)}
                      className="flex items-center space-x-2"
                    >
                      <EyeOff className="w-4 h-4" />
                      <span>Masquer</span>
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUnhideJoke(joke.id)}
                      className="flex items-center space-x-2"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Afficher</span>
                    </Button>
                  )}
                  
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteJoke(joke.id)}
                    className="flex items-center space-x-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Supprimer</span>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}