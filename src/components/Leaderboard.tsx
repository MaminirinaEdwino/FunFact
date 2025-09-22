import React, { useState } from 'react';
import { Trophy, Medal, Award, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Joke } from '../types';

interface LeaderboardProps {
  jokes: Joke[];
}

export function Leaderboard({ jokes }: LeaderboardProps) {
  const [period, setPeriod] = useState<'week' | 'alltime'>('week');

  // Filter jokes by period
  const getFilteredJokes = () => {
    if (period === 'week') {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      return jokes.filter(joke => joke.createdAt >= oneWeekAgo);
    }
    return jokes;
  };

  const filteredJokes = getFilteredJokes().filter(joke => !joke.isHidden);
  const sortedByFunny = [...filteredJokes].sort((a, b) => b.funny - a.funny);
  const sortedByEngagement = [...filteredJokes].sort((a, b) => (b.funny + b.meh + b.dislikes + b.comments.length) - (a.funny + a.meh + a.dislikes + a.comments.length));

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 1:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 2:
        return <Award className="w-5 h-5 text-amber-600" />;
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-sm font-medium">{index + 1}</span>;
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'short'
    }).format(date);
  };

  const JokeCard = ({ joke, rank, metric }: { joke: Joke; rank: number; metric: 'funny' | 'engagement' }) => (
    <div className="flex items-center space-x-4 p-4 border rounded-lg">
      <div className="flex items-center justify-center w-8 h-8">
        {getRankIcon(rank)}
      </div>
      
      <Avatar className="w-12 h-12">
        <AvatarFallback className="text-lg">🤠</AvatarFallback>
      </Avatar>
      
      <div className="flex-1">
        <div className="flex items-center space-x-2 mb-1">
          <h3 className="font-medium truncate">{joke.title}</h3>
          {rank < 3 && (
            <Badge variant="secondary" className="text-xs">
              Top {rank + 1}
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          {formatDate(joke.createdAt)} • {joke.tags.slice(0, 2).map(tag => `#${tag}`).join(' ')}
        </p>
      </div>
      
      <div className="text-right">
        <p className="font-semibold">
          {metric === 'funny' ? joke.funny : (joke.funny + joke.meh + joke.dislikes + joke.comments.length)}
        </p>
        <p className="text-sm text-muted-foreground">
          {metric === 'funny' ? '😂 reactions' : 'interactions'}
        </p>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">🏆 Classement</h1>
        <p className="text-muted-foreground">
          Découvrez les meilleurs contributeurs de fun facts !
        </p>
      </div>

      <Tabs value={period} onValueChange={(value) => setPeriod(value as 'week' | 'alltime')} className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="week" className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4" />
            <span>Cette semaine</span>
          </TabsTrigger>
          <TabsTrigger value="alltime" className="flex items-center space-x-2">
            <Trophy className="w-4 h-4" />
            <span>All-time</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={period} className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                <span>Plus Drôles</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {sortedByFunny.slice(0, 10).map((joke, index) => (
                <JokeCard
                  key={`funny-${joke.id}`}
                  joke={joke}
                  rank={index}
                  metric="funny"
                />
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Medal className="w-5 h-5 text-blue-500" />
                <span>Plus d'Engagement</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {sortedByEngagement.slice(0, 10).map((joke, index) => (
                <JokeCard
                  key={`engagement-${joke.id}`}
                  joke={joke}
                  rank={index}
                  metric="engagement"
                />
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {period === 'week' && (
        <div className="mt-8 p-4 bg-muted/30 rounded-lg">
          <p className="text-sm text-muted-foreground text-center">
            📊 Le classement hebdomadaire est remis à zéro chaque lundi à minuit.
            Continuez à partager des fun facts pour grimper dans le classement !
          </p>
        </div>
      )}
    </div>
  );
}