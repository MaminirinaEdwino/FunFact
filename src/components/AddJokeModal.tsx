import React, { useState } from 'react';
import { X, Eye, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { JokeCard } from './JokeCard';
import { Joke } from '../types';

interface AddJokeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (joke: Omit<Joke, 'id' | 'createdAt' | 'funny' | 'meh' | 'dislikes' | 'comments' | 'isReported' | 'isHidden' | 'userReaction'>) => void;
  loading?: boolean;
}

export function AddJokeModal({ isOpen, onClose, onSubmit, loading = false }: AddJokeModalProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const handleAddTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = () => {
    if (title.trim() && content.trim()) {
      onSubmit({
        title: title.trim(),
        content: content.trim(),
        tags
      });
      
      // Reset form only if not loading (will be reset when modal closes after success)
      if (!loading) {
        setTitle('');
        setContent('');
        setTags([]);
        setCurrentTag('');
        setShowPreview(false);
      }
    }
  };

  const previewJoke: Joke = {
    id: 'preview',
    title,
    content,
    createdAt: new Date(),
    funny: 0,
    meh: 0,
    dislikes: 0,
    comments: [],
    tags,
    isReported: false,
    isHidden: false,
    userReaction: null
  };

  return (
    <Dialog open={isOpen} onOpenChange={loading ? undefined : onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ajouter un Fun Fact</DialogTitle>
        </DialogHeader>

        {!showPreview ? (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Titre</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Le fait incroyable sur les pieuvres"
                maxLength={100}
              />
              <p className="text-xs text-muted-foreground">
                {title.length}/100 caractères
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Contenu</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Racontez votre fun fact ici..."
                rows={6}
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground">
                {content.length}/500 caractères
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <div className="flex space-x-2">
                <Input
                  id="tags"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  placeholder="science, animaux, histoire..."
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                />
                <Button type="button" onClick={handleAddTag} variant="secondary">
                  Ajouter
                </Button>
              </div>
              
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center space-x-1">
                      <span>#{tag}</span>
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 text-xs hover:text-destructive"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={() => setShowPreview(true)}
                disabled={!title.trim() || !content.trim()}
                className="flex items-center space-x-2"
              >
                <Eye className="w-4 h-4" />
                <span>Prévisualiser</span>
              </Button>
              
              <div className="space-x-2">
                <Button variant="outline" onClick={onClose} disabled={loading}>
                  Annuler
                </Button>
                <Button 
                  onClick={handleSubmit}
                  disabled={!title.trim() || !content.trim() || loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Publication...
                    </>
                  ) : (
                    'Publier'
                  )}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3>Aperçu de votre Fun Fact</h3>
              <Button variant="outline" onClick={() => setShowPreview(false)}>
                Modifier
              </Button>
            </div>
            
            <JokeCard
              joke={previewJoke}
              onReaction={() => {}}
              onViewDetails={() => {}}
            />
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={onClose} disabled={loading}>
                Annuler
              </Button>
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Publication...
                  </>
                ) : (
                  'Publier'
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}