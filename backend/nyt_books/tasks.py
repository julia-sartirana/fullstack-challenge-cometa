import os
import json
import requests
import logging
from time import sleep
from background_task import background

# Logging configuration
logger = logging.getLogger(__name__)

# Path where books data will be stored
BOOKS_FILE_PATH = os.path.join(os.path.dirname(__file__), "books_data.json")

NYT_API_KEY = os.getenv("NYT_API_KEY")

GENRES = ["hardcover-fiction", "hardcover-nonfiction"]

def save_books_to_json(data):
    """Saves book data to a JSON file."""
    with open(BOOKS_FILE_PATH, "w", encoding="utf-8") as json_file:
        json.dump(data, json_file, indent=4)
    logger.info("Books saved in books_data.json")

def fetch_books():
    """Fetches books from NYT and saves them to JSON immediately (foreground)."""
    logger.info("Running fetch_books() directly (foreground)...")

    if not NYT_API_KEY:
        logger.error("NYT API Key not found.")
        return

    books_data = {}

    for genre in GENRES:
        url = f"https://api.nytimes.com/svc/books/v3/lists/current/{genre}.json?api-key={NYT_API_KEY}"
        logger.info(f"fetching {genre} from {url}")

        try:
            response = requests.get(url, timeout=10)
            response.raise_for_status()

            data = response.json()
            books_data[genre] = data.get("results", {}).get("books", [])
            logger.info(f"Books retrieved for {genre}: {len(books_data[genre])}")

        except requests.RequestException as e:
            logger.error(f"Error fetching {genre}: {e}")

    save_books_to_json(books_data) 
    logger.info("fetch_books() completed.")

@background(schedule=10)
def update_books():
    """Fetches books in the background and saves them to JSON."""
    logger.info("Starting book update in background...")
    fetch_books()
    logger.info("update_books() completed in background.")

def trigger_update_books_immediate():
    """Runs the update immediately in foreground if JSON does not exist."""
    fetch_books()
    logger.info("fetch_books() executed immediately.")







