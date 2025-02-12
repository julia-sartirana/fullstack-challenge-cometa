from django.urls import path
from .views import *

urlpatterns = [
    path("stock/", StockView.as_view(), name="stock"),
    path("order/", OrderView.as_view(), name="order"),
    path("bill/", BillView.as_view(), name="bill"),
    path("bill/pay/", PayBillView.as_view(), name="pay_bill"), 
]
