export interface Note {
  id: string;
  title: string;
  excerpt: string;
  tags: string[];
  date: string;
  author: string;
  authorInitial: string;
  color?: string;
}
