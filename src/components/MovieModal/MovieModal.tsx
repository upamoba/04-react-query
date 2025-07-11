import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import styles from './MovieModal.module.css';
import type { Movie } from '../../types/movie';

export interface MovieModalProps {
  movie: Movie;
  onClose: () => void;
}




const modalRoot = document.getElementById('modal-root')!;

const MovieModal: React.FC<MovieModalProps> = ({ movie, onClose }) => {
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onEsc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onEsc);
    return () => {
      window.removeEventListener('keydown', onEsc);
      document.body.style.overflow = original;
    };
  }, [onClose]);

  const onBackdropClick = (e: React.MouseEvent) =>
    e.target === e.currentTarget && onClose();

  return ReactDOM.createPortal(
    <div
      className={styles.backdrop}
      role="dialog"
      aria-modal="true"
      onClick={onBackdropClick}
    >
      <div className={styles.modal}>
        <button
          className={styles.closeButton}
          aria-label="Close modal"
          onClick={onClose}
        >
          &times;
        </button>
        <img
          className={styles.image}
          src={`${import.meta.env.VITE_TMDB_IMG_BASE}/original${movie.backdrop_path}`}
          alt={movie.title}
        />
        <div className={styles.content}>
          <h2 className={styles.title}>{movie.title}</h2>
          <p className={styles.overview}>{movie.overview}</p>
          <p>
            <strong>Release Date:</strong> {movie.release_date}
          </p>
          <p>
            <strong>Rating:</strong> {movie.vote_average}/10
          </p>
        </div>
      </div>
    </div>,
    modalRoot
  );
};

export default MovieModal;