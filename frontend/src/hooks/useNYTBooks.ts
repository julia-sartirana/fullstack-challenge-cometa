import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/nyt-books/";

export function useNYTBooks() {
  const [books, setBooks] = useState<any[]>([]);
  const [genre, setGenre] = useState("hardcover-fiction");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    async function fetchBooks() {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${API_URL}?genre=${genre}`);
        setBooks(response.data);
      } catch (err) {
        setError("Error al obtener los libros.");
        setBooks([]);
      } finally {
        setLoading(false);
      }
    }
    fetchBooks();
  }, [genre]);

  async function triggerUpdate() {
    setUpdating(true);
    try {
      await axios.post(`${API_URL}update/`);
    } catch (err) {
      setError("Error al actualizar los libros.");
    } finally {
      setUpdating(false);
    }
  }

  return { books, genre, setGenre, loading, error, updating, triggerUpdate };
}
