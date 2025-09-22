import React, { useEffect, useState } from 'react';
import { Leaderboard } from '../components/Leaderboard';
import { Joke } from '../types';
import { getJokes } from '../features/jokes/services/jokesApi';

export default function LeaderboardPage() {
  const [jokes, setJokes] = useState<Joke[]>([]);

  useEffect(() => {
    const fetchJokes = async () => {
      try {
        const list = await getJokes();
        setJokes(list);
      } catch (e) {
        console.error(e);
      }
    };
    fetchJokes();
  }, []);

  return <Leaderboard jokes={jokes} />;
}


