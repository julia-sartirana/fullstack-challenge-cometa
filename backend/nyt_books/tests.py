from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from .utils import fetch_books_from_nyt
from .tasks import BOOKS_CACHE
from unittest.mock import patch
import requests

class NYTIntegrationTests(TestCase):
    """Tests for the NYT Books API integration."""

    def setUp(self):
        self.client = APIClient()

    @patch("nyt_books.utils.requests.get")
    def test_fetch_books_success(self, mock_get):
        """Test that books are retrieved successfully from the NYT API."""
        mock_get.return_value.status_code = 200
        mock_get.return_value.json.return_value = {"results": {"books": [{"title": "Test Book"}]}}

        books = fetch_books_from_nyt()
        self.assertEqual(len(books), 1)
        self.assertEqual(books[0]["title"], "Test Book")

    @patch("nyt_books.utils.requests.get")
    def test_fetch_books_fail(self, mock_get):
        """Test that failed API requests return an empty list."""
        mock_get.side_effect = requests.exceptions.RequestException("API error")
        
        books = fetch_books_from_nyt()
        self.assertEqual(books, [])

class BookListViewTests(TestCase):
    """Tests for the BookListView."""

    def setUp(self):
        self.client = APIClient()
        BOOKS_CACHE.clear()  # Limpia el caché antes de cada test

    def test_get_books_no_data(self):
        """Test that the endpoint returns 503 when no books are available."""
        response = self.client.get("/api/nyt-books/")
        self.assertEqual(response.status_code, status.HTTP_503_SERVICE_UNAVAILABLE)

    def test_get_books_with_data(self):
        """Test fetching books when data is available."""
        BOOKS_CACHE["Test Book"] = {"title": "Test Book", "author": "Author Name"}

        response = self.client.get("/api/nyt-books/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)  # Debe ser 1, no 15
        self.assertEqual(response.data[0]["title"], "Test Book")


class TriggerUpdateViewTests(TestCase):
    """Tests for the TriggerUpdateView."""

    def setUp(self):
        self.client = APIClient()

    @patch("nyt_books.tasks.update_books.now")
    def test_trigger_update(self, mock_update):
        """Test triggering the book update process."""
        response = self.client.post("/api/nyt-books/update/")
        self.assertEqual(response.status_code, status.HTTP_202_ACCEPTED)
        mock_update.assert_called_once()  # Verifica que la función se haya llamado correctamente

