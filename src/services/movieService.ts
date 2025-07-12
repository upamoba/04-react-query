import axios from 'axios';
import type { Movie } from '../types/movie';

const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL as string;
const TOKEN    = import.meta.env.VITE_TMDB_TOKEN   as string;


 export interface TMDBSearchResponse {
  page: number;
  results: Movie[];
  total_results: number;
  total_pages: number;
}

export const fetchMovies = async (
  query: string,
  page: number
): Promise<TMDBSearchResponse> => {
  const { data } = await axios.get<TMDBSearchResponse>(
    `${BASE_URL}/search/movie`,
    {
      params: { query: query.trim(), page },
      headers: { Authorization: `Bearer ${TOKEN}` },
    }
  );
  return data;
};