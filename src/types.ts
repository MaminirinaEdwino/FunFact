export interface Joke {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  funny: number;
  meh: number;
  dislikes: number;
  comments: Comment[];
  tags: string[];
  isReported: boolean;
  isHidden: boolean;
  userReaction?: 'funny' | 'meh' | 'dislike' | null;
}

export interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  jokeId: string;
}

export type Filter = 'all' | 'recent' | 'popular' | 'controversial';
export type Page = 'home' | 'add' | 'detail' | 'leaderboard' | 'admin';
export type Reaction = 'funny' | 'meh' | 'dislike';