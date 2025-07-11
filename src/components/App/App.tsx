import  { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import ReactPaginate from 'react-paginate';
import { Toaster, toast } from 'react-hot-toast';

import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';

import { fetchMoviesPage } from '../services/movieService';
import type { TMDBSearchResponse } from '../services/movieService';
import type { Movie } from '../types/movie';

import css from './App.module.css';


const App: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [selected, setSelected] = useState<Movie | null>(null);

  const { data, isLoading, isError, refetch } = useQuery<
    TMDBSearchResponse,
    Error
  >(
    ['movies', query, page],
    () => fetchMoviesPage(query, page),
    {
      enabled: false,
      onSuccess: resp => {
        if (resp.results.length === 0 && page === 1) {
          toast('No movies found for your request.');
        }
      },
      onError: () => {
        toast.error('There was an error, please try again...');
      },
    }
  );

  
  useEffect(() => {
    if (query) {
      refetch();
    }
  }, [query, page, refetch]);

  const handleSearch = (q: string) => {
    setQuery(q);
    setPage(1);
  };

  const movies = data?.results ?? [];
  const totalPages = data?.total_pages ?? 0;

  return (
    <>
      <Toaster />
      <SearchBar onSubmit={handleSearch} />

      {isLoading && <Loader />}
      {isError && <ErrorMessage />}

      {!isLoading && !isError && (
        <>
          <MovieGrid movies={movies} onSelect={setSelected} />

          {totalPages > 1 && (
            <ReactPaginate
              pageCount={totalPages}
              pageRangeDisplayed={5}
              marginPagesDisplayed={1}
              onPageChange={({ selected }) => setPage(selected + 1)}
              forcePage={page - 1}
              containerClassName={css.pagination}
              activeClassName={css.active}
              nextLabel="→"
              previousLabel="←"
            />
          )}
        </>
      )}

      {selected && (
        <MovieModal movie={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
};

export default App;