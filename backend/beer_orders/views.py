# Create your views here.
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from .utils.data import stock, order, bill
from .serializers import OrderCreateSerializer, OrderDetailSerializer, BillSerializer, PayBillSerializer

class StockView(APIView):
    """Returns the current beer stock"""
    def get(self, request):
        return Response(stock, status=status.HTTP_200_OK)

class OrderView(APIView):
    """Returns the current order status"""
    def get(self, request):
        return Response(OrderDetailSerializer(order).data, status=status.HTTP_200_OK)

    """Adds beers to the order while validating stock"""
    def post(self, request):
        serializer = OrderCreateSerializer(data=request.data)
        if serializer.is_valid():
            updated_order = serializer.save()
            return Response(OrderDetailSerializer(updated_order).data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class BillView(APIView):
    """Returns the bill details"""
    def get(self, request):
        return Response(BillSerializer(bill).data, status=status.HTTP_200_OK)

class PayBillView(APIView):
    """Processes a payment by a friend"""
    def post(self, request):
        serializer = PayBillSerializer(data=request.data)
        if serializer.is_valid():
            updated_bill = serializer.save()
            return Response(BillSerializer(updated_bill).data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

