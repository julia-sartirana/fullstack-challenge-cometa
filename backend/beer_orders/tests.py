from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from beer_orders.utils.data import stock, order
from beer_orders.serializers import OrderCreateSerializer

class StockViewTests(TestCase):
    """Tests for the stock endpoint"""

    def setUp(self):
        """Initial setup for each test"""
        self.client = APIClient()

    def test_get_stock(self):
        """Checks that the stock endpoint returns the correct data"""
        response = self.client.get("/api/beer-orders/stock/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("beers", response.data)
        self.assertEqual(response.data["beers"][0]["name"], "Corona")

class OrderViewTests(TestCase):
    """Tests for the order endpoint"""

    def setUp(self):
        """Initial setup"""
        self.client = APIClient()
        self.initial_order = {
            "created": order["created"],
            "paid": order["paid"],
            "subtotal": order["subtotal"],
            "taxes": order["taxes"],
            "discounts": order["discounts"],
            "items": order["items"],
            "rounds": order["rounds"],
        }

    def test_get_order(self):
        """Checks that the initial order is empty"""
        response = self.client.get("/api/beer-orders/order/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["subtotal"], 0)
        self.assertEqual(response.data["items"], [])

    def test_post_order_valid(self):
        """Tests adding a valid beer to the order"""
        data = {"items": [{"name": "Corona", "quantity": 1}]}
        response = self.client.post("/api/beer-orders/order/", data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["subtotal"], 115)
        self.assertEqual(len(response.data["items"]), 1)
        self.assertEqual(response.data["items"][0]["name"], "Corona")

    def test_post_order_invalid_stock(self):
        """Tests attempting to purchase a beer that is out of stock"""
        data = {"items": [{"name": "Quilmes", "quantity": 1}]}
        response = self.client.post("/api/beer-orders/order/", data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("Insufficient stock", str(response.data))

class OrderSerializerTests(TestCase):
    """Tests for the order serializer"""

    def test_order_serializer_valid(self):
        """Checks that the serializer correctly validates and assigns prices"""
        data = {"items": [{"name": "Corona", "quantity": 1}]}
        serializer = OrderCreateSerializer(data=data)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        validated_data = serializer.validated_data
        self.assertEqual(validated_data["items"][0]["price_per_unit"], 115)
        self.assertEqual(validated_data["items"][0]["total"], 115)

    def test_order_serializer_invalid_stock(self):
        """Checks that the serializer detects insufficient stock"""
        data = {"items": [{"name": "Quilmes", "quantity": 5}]}
        serializer = OrderCreateSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("items", serializer.errors)
        self.assertIn("Insufficient stock for Quilmes", str(serializer.errors["items"]))

