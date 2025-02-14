import logging
from background_task.models import Task
from .tasks import update_books

logger = logging.getLogger(__name__)

def schedule_nyt_update(sender, **kwargs):
    """Registers the background update task after migrations."""
    if not Task.objects.filter(task_name="nyt_books.tasks.update_books").exists():
        update_books(repeat=3600)
        logger.info("Scheduled book update task every hour.")
    else:
        logger.info("The book update task was already scheduled.")


