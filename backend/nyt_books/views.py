from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import json
import os
import logging
from .tasks import update_books, trigger_update_books_immediate

# Logging configuration
logger = logging.getLogger(__name__)

# Path where books data is stored
BOOKS_FILE_PATH = os.path.join(os.path.dirname(__file__), "books_data.json")

def read_books_from_json():
    """Reads stored book data from JSON."""
    if os.path.exists(BOOKS_FILE_PATH):
        with open(BOOKS_FILE_PATH, "r", encoding="utf-8") as file:
            return json.load(file)
    return {}

class BookListView(APIView):
    """Endpoint to retrieve books filtered by genre."""

    def get(self, request):
        genre = request.GET.get("genre", "hardcover-fiction")
        books_data = read_books_from_json()
        logger.info(f"Checking books JSON on request: {books_data}")

        if not books_data:
            logger.warning("No books found in JSON file")
            trigger_update_books_immediate()
            return Response(
                {"loading": True, "message": "Fetching books, please try again in a few seconds."},
                status=status.HTTP_202_ACCEPTED
            )

        filtered_books = books_data.get(genre, [])
        logger.info(f"Books retrieved for {genre}: {len(filtered_books)}")

        if not filtered_books:
            return Response({"message": "No books available"}, status=status.HTTP_204_NO_CONTENT)

        return Response(filtered_books, status=status.HTTP_200_OK)

class TriggerUpdateView(APIView):
    """Endpoint to manually update books in the background."""

    def post(self, request):
        update_books()
        return Response({"message": "Books update triggered"}, status=status.HTTP_202_ACCEPTED)
