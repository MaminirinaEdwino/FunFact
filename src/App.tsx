import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LeaderboardPage from './pages/LeaderboardPage';
import AdminPage from './pages/AdminPage';
import JokeDetailPage from './pages/JokeDetailPage';
import { Header } from './components/Header';
import { Toaster } from './components/ui/sonner';
import './App.css';

export default function App() {
    return (
    <div className="min-h-screen bg-background flex flex-col">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/joke/:id" element={<JokeDetailPage />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" />
    </div>
  );
}