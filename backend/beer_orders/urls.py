from django.urls import path
from .views import StockView, OrderView

urlpatterns = [
    path("stock/", StockView.as_view(), name="stock"),
    path("order/", OrderView.as_view(), name="order"),
    #path("order/add/", AddToOrderView.as_view(), name="add_order"),
    #path("order/pay/", PayOrderView.as_view(), name="pay_order"),
]
