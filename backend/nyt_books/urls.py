from django.urls import path
from .views import BookListView, TriggerUpdateView

urlpatterns = [
    path("", BookListView.as_view(), name="book-list"),
    path("update/", TriggerUpdateView.as_view(), name="trigger-update"),
]
