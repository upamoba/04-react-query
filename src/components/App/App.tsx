import  { useState, useEffect  } from 'react';
import { useQuery } from '@tanstack/react-query';
import ReactPaginate from 'react-paginate';
import { Toaster, toast } from 'react-hot-toast';

import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';

import { fetchMovies } from '../../services/movieService';
import type { TMDBSearchResponse } from '../../services/movieService';
import type { Movie } from '../../types/movie';

import css from './App.module.css';



const App: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);


 const { data, isLoading, isError, isSuccess } = useQuery<TMDBSearchResponse, Error>({
    queryKey: ['movies', searchTerm, page],
    queryFn: () => fetchMovies(searchTerm, page),
    enabled: !!searchTerm,
      placeholderData: prev => prev ??{
      page: 1,
      results: [],
      total_results: 0,
      total_pages: 0,
    },
  });
useEffect(() => {
    if (isError) {
      toast.error('There was an error, please try again...');
    }
  }, [isError]);

  
  useEffect(() => {
    if (isSuccess && data?.results.length === 0 && page === 1) {
      toast('No movies found for your request.');
    }
  }, [isSuccess, data, page]);
  
  

  const handleSearch = (q: string) => {
    setSearchTerm(q);
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

      {isSuccess && (
        <>
          <MovieGrid movies={movies} onSelect={setSelectedMovie} />

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

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
      )}
    
    </>
  );
};

export default App;