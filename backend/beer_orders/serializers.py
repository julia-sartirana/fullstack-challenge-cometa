from rest_framework import serializers
from .utils.data import stock, order
from datetime import datetime

class OrderItemSerializer(serializers.Serializer):
    name = serializers.CharField()
    quantity = serializers.IntegerField(min_value=1)
    price_per_unit = serializers.FloatField(required=False)
    total = serializers.FloatField(required=False)

    def validate(self, data):
        """Validates stock availability and assigns prices"""
        beer = next((b for b in stock["beers"] if b["name"] == data["name"]), None)
        if not beer:
            raise serializers.ValidationError(f"Beer {data['name']} not found.")
        if beer["quantity"] < data["quantity"]:
            raise serializers.ValidationError(f"Insufficient stock for {data['name']}. Available: {beer['quantity']}.")

        # Automatically assign price_per_unit and total
        data["price_per_unit"] = beer["price"]
        data["total"] = beer["price"] * data["quantity"]

        return data

class OrderCreateSerializer(serializers.Serializer):
    items = OrderItemSerializer(many=True)

    def create(self, validated_data):
        """Adds items to the order and updates stock"""
        new_round = {"created": datetime.now().strftime("%Y-%m-%d %H:%M:%S"), "items": []}

        for item in validated_data["items"]:
            beer_name = item["name"]
            quantity = item["quantity"]

            # Find the beer in stock
            beer = next((b for b in stock["beers"] if b["name"] == beer_name), None)
            if not beer:
                raise serializers.ValidationError(f"Beer {beer_name} not found.")
            if beer["quantity"] < quantity:
                raise serializers.ValidationError(f"Insufficient stock for {beer_name}. Available: {beer['quantity']}.")

            # Create item with calculated prices
            order_item = {
                "name": beer_name,
                "quantity": quantity,
                "price_per_unit": beer["price"],
                "total": beer["price"] * quantity,
            }

            # Update stock and order
            beer["quantity"] -= quantity
            new_round["items"].append(order_item)
            order["items"].append(order_item)
            order["subtotal"] += order_item["total"]

        order["rounds"].append(new_round)
        order["taxes"] = order["subtotal"] * 0.16
        order["total"] = order["subtotal"] + order["taxes"] - order["discounts"]

        return order

class OrderDetailSerializer(serializers.Serializer):
    created = serializers.CharField()
    paid = serializers.BooleanField()
    subtotal = serializers.FloatField()
    taxes = serializers.FloatField()
    discounts = serializers.FloatField()
    total = serializers.FloatField()
    items = OrderItemSerializer(many=True)
    rounds = serializers.ListField(child=serializers.DictField())



