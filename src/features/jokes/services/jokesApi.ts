import { Joke } from '../../../types';

const API_URL = 'https://fun-fact-api-rsu4.onrender.com/funfact';

function mapApiToJoke(item: any): Joke {
  return {
    id: String(item.Id ?? item.id ?? crypto.randomUUID?.() ?? Date.now().toString()),
    title: `Fun Fact #${item.Id ?? item.id ?? ''}`.trim(),
    content: String(item.FunFact ?? item.funfact ?? ''),
    createdAt: new Date(),
    funny: 0,
    meh: 0,
    dislikes: 0,
    comments: [],
    tags: [],
    isReported: false,
    isHidden: false,
    userReaction: null,
  };
}

export async function getJokes(): Promise<Joke[]> {
  const res = await fetch(API_URL);
  const data = await res.json();
  const items = Array.isArray(data) ? data : [];
  items.sort((a: any, b: any) => {
    const aId = Number(a?.Id ?? a?.id ?? 0);
    const bId = Number(b?.Id ?? b?.id ?? 0);
    return bId - aId; // newest/highest first
  });
  return items.map(mapApiToJoke);
}

export async function getJokeById(id: string): Promise<Joke | null> {
  const list = await getJokes();
  const found = list.find(j => j.id === id);
  return found ?? null;
}

export async function createJoke(content: string): Promise<void> {
  await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringify({ funfact: content }),
  });
}
