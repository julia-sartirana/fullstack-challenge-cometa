from django.apps import AppConfig
import logging

logger = logging.getLogger(__name__)

class NytBooksConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "nyt_books"

    def ready(self):
        """Schedule NYT book updates on startup after migrations."""
        from django.db.models.signals import post_migrate
        from .signals import schedule_nyt_update

        post_migrate.connect(schedule_nyt_update, sender=self)

