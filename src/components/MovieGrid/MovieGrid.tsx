import React from 'react';
import styles from './MovieGrid.module.css';
import type { Movie } from '../../types/movie';


export interface MovieGridProps {
  movies: Movie[];
  onSelect: (movie: Movie) => void;
}

const MovieGrid: React.FC<MovieGridProps> = ({ movies, onSelect }) => {
  if (movies.length === 0) return null;
  

  return (
    <ul className={styles.grid}>
      {movies.map(movie => (
        <li key={movie.id}>
          <div
            className={styles.card}
            role="button"
            tabIndex={0}
            onClick={() => onSelect(movie)}
            onKeyDown={e => e.key === 'Enter' && onSelect(movie)}
          >
            <img
              className={styles.image}
              src={`${import.meta.env.VITE_TMDB_IMG_BASE}/w500${movie.poster_path}`}
              alt={movie.title}
              loading="lazy"
            />
            <h2 className={styles.title}>{movie.title}</h2>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default MovieGrid;