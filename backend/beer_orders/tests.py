from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from beer_orders.utils.data import stock, order, bill
from beer_orders.serializers import OrderCreateSerializer, BillSerializer

class BaseTestCase(TestCase):
    """Base setup to reset data before each test"""

    def setUp(self):
        """Reset bill and order before each test"""
        global bill, order  # Ensure we're resetting the module-level variables
        bill.update({
            "total": 0,
            "payments": {"Alice": 0, "Bob": 0, "Charlie": 0},
        })
        order.update({
            "subtotal": 0,
            "taxes": 0,
            "total": 0,
            "items": [],
            "rounds": [],
        })


class StockViewTests(BaseTestCase):
    """Tests for the stock endpoint"""

    def setUp(self):
        super().setUp()
        self.client = APIClient()

    def test_get_stock(self):
        """Checks that the stock endpoint returns the correct data"""
        response = self.client.get("/api/beer-orders/stock/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("beers", response.data)
        self.assertEqual(response.data["beers"][0]["name"], "Corona")


class OrderViewTests(BaseTestCase):
    """Tests for the order endpoint"""

    def setUp(self):
        super().setUp()
        self.client = APIClient()

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


class BillViewTests(BaseTestCase):
    """Tests for the bill endpoint"""

    def setUp(self):
        super().setUp()
        self.client = APIClient()

    def test_get_bill(self):
        """Checks that the bill endpoint returns the initial state"""
        response = self.client.get("/api/beer-orders/bill/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["total"], 0)
        self.assertEqual(response.data["remaining_total"], 0)
        self.assertEqual(response.data["payments"]["Alice"], 0)

    def test_bill_updates_after_order(self):
        """Ensures that placing an order updates the bill total"""
        data = {"items": [{"name": "Corona", "quantity": 1}]}
        self.client.post("/api/beer-orders/order/", data, format="json")

        response = self.client.get("/api/beer-orders/bill/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        expected_total = round(115 * 1.16, 2)  # ✅ Corrección de precisión
        self.assertEqual(response.data["total"], expected_total)


class PayBillViewTests(BaseTestCase):
    """Tests for the pay bill endpoint"""

    def setUp(self):
        super().setUp()
        self.client = APIClient()
        data = {"items": [{"name": "Corona", "quantity": 3}]}
        self.client.post("/api/beer-orders/order/", data, format="json")

    def test_pay_partial_amount(self):
        """Tests if a friend can partially pay"""
        data = {"friend": "Alice", "amount": 50}
        response = self.client.post("/api/beer-orders/bill/pay/", data, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["payments"]["Alice"], 50)

    def test_pay_full_bill(self):
        """Tests if friends can completely pay the bill and reset"""
        total_amount = bill["total"]
        self.client.post("/api/beer-orders/bill/pay/", {"friend": "Alice", "amount": total_amount / 3}, format="json")
        self.client.post("/api/beer-orders/bill/pay/", {"friend": "Bob", "amount": total_amount / 3}, format="json")
        response = self.client.post("/api/beer-orders/bill/pay/", {"friend": "Charlie", "amount": total_amount / 3}, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["total"], 0)
        self.assertEqual(response.data["payments"]["Alice"], 0)
        self.assertEqual(response.data["payments"]["Bob"], 0)
        self.assertEqual(response.data["payments"]["Charlie"], 0)

    def test_pay_exceeds_total(self):
        """Tests that a friend cannot pay more than the remaining balance"""
        total_amount = bill["total"]
        self.client.post("/api/beer-orders/bill/pay/", {"friend": "Alice", "amount": total_amount}, format="json")

        response = self.client.post("/api/beer-orders/bill/pay/", {"friend": "Bob", "amount": 10}, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("Payment exceeds remaining balance", str(response.data))


class BillSerializerTests(BaseTestCase):
    """Tests for the bill serializer"""

    def test_bill_serializer_initial_state(self):
        """Verifies that the bill starts with a total of 0"""
        serializer = BillSerializer(bill)
        self.assertEqual(serializer.data["total"], 0)
        self.assertEqual(serializer.data["remaining_total"], 0)

    def test_bill_serializer_after_order(self):
        """Ensures the bill updates correctly when an order is placed"""
        order["total"] = round(115 * 1.16, 2)
        bill["total"] = order["total"]
        serializer = BillSerializer(bill)
        self.assertEqual(serializer.data["total"], order["total"])
        self.assertEqual(serializer.data["remaining_total"], order["total"])
