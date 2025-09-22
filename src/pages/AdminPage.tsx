import React, { useEffect, useState } from 'react';
import { AdminPanel } from '../components/AdminPanel';
import { Joke } from '../types';
import { useAdminAuth } from '../features/admin/hooks/useAdminAuth';
import { LoginModal } from '../components/LoginModal';
import { getJokes } from '../features/jokes/services/jokesApi';
import { useNavigate } from 'react-router-dom';

export default function AdminPage() {
  const [jokes, setJokes] = useState<Joke[]>([]);
  const { isAdmin, login, logout } = useAdminAuth();
  const navigate = useNavigate();

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

  const handleHideJoke = (jokeId: string) => {
    setJokes(prev => prev.map(joke => joke.id === jokeId ? { ...joke, isHidden: true, isReported: false } : joke));
  };
  const handleUnhideJoke = (jokeId: string) => {
    setJokes(prev => prev.map(joke => joke.id === jokeId ? { ...joke, isHidden: false } : joke));
  };
  const handleDeleteJoke = (jokeId: string) => {
    setJokes(prev => prev.filter(joke => joke.id !== jokeId));
  };

  if (!isAdmin) {
    return (
      <LoginModal isOpen={true} onClose={() => {navigate('/')}} onLogin={login} />
    );
  }

  return (
    <AdminPanel
      jokes={jokes}
      onHideJoke={handleHideJoke}
      onDeleteJoke={handleDeleteJoke}
      onUnhideJoke={handleUnhideJoke}
    />
  );
}


