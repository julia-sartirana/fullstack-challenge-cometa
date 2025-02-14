import requests
import os
import logging
from time import sleep

NYT_API_KEY = os.getenv("NYT_API_KEY")
NYT_BASE_URL = "https://api.nytimes.com/svc/books/v3"

logger = logging.getLogger(__name__)

def fetch_books_from_nyt(genre="hardcover-fiction", retries=3, delay=5):
    """Get NYT books with retries."""
    url = f"{NYT_BASE_URL}/lists/current/{genre}.json?api-key={NYT_API_KEY}"

    for attempt in range(retries):
        try:
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            return response.json()["results"]["books"]
        except requests.RequestException as e:
            logger.error(f"Intento {attempt+1} fallido: {e}")
            sleep(delay)

    logger.error("Could not get list of books.")
    return []

