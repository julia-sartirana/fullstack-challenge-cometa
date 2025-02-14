"use client";
import { useNYTBooks } from "@/hooks/useNYTBooks";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useRouter } from "next/navigation";

const GENRES = ["hardcover-fiction", "hardcover-nonfiction"];

export default function NYTBooksPage() {
  const { books, genre, setGenre, loading, error, updating, triggerUpdate } =
    useNYTBooks();
  const router = useRouter();

  return (
    <div className="max-w-5xl mx-auto p-6">
      <button
        type="button"
        onClick={() => router.back()}
        style={{ border: "none", background: "none", cursor: "pointer" }}
      >
        <FaArrowLeftLong size={24} />
      </button>

      <h1 className="text-3xl font-bold text-center mb-4">
        Libros Recomendados por NYT 📚
      </h1>
      <p className="text-center text-gray-400 mb-6">
        Explora los libros más populares y compra en Amazon.
      </p>

      <div className="flex justify-center my-4">
        <label className="mr-2 text-lg font-semibold">
          Filtrar por género:
        </label>
        <select
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className="p-2 border border-gray-300 rounded-md text-black bg-white shadow-md"
        >
          {GENRES.map((g) => (
            <option key={g} value={g}>
              {g.replace(/-/g, " ")}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={triggerUpdate}
        disabled={updating}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {updating ? "Actualizando..." : "Actualizar Libros"}
      </button>

      {loading && (
        <p className="text-blue-500 text-center">Cargando libros...</p>
      )}
      {error && <p className="text-red-500 text-center">{error}</p>}

      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {books &&
          books.length > 0 &&
          books.map((book) => (
            <li
              key={book.title}
              className="border p-4 rounded-lg shadow-lg bg-gray-900 text-white flex flex-col items-center h-full"
            >
              <div className="flex flex-col items-center flex-grow">
                <img
                  src={book.book_image}
                  alt={book.title}
                  className="w-40 h-60 object-cover rounded-lg shadow-md mb-4"
                />
                <h3 className="text-lg font-bold text-center">{book.title}</h3>
                <p className="text-gray-400 text-center">{book.author}</p>
              </div>
              <a
                href={book.amazon_product_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition duration-200 w-full text-center"
              >
                Comprar en Amazon
              </a>
            </li>
          ))}
      </ul>
    </div>
  );
}
