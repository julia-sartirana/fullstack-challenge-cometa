"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import BeerList from "@/components/BeerList/BeerList";
import OrderForm from "@/components/OrderForm/OrderForm";
import OrderSummary from "@/components/OrderSummary/OrderSummary";

interface Beer {
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  created: string;
  paid: boolean;
  subtotal: number;
  total: number;
  taxes: number;
  discounts: number;
  items: (Beer & { quantity: number })[];
  rounds: any[];
}

export default function BeerOrdersPage() {
  const [beers, setBeers] = useState<Beer[]>([]);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshOrder, setRefreshOrder] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [stockResponse, orderResponse] = await Promise.all([
          axios.get("http://127.0.0.1:8000/api/beer-orders/stock/"),
          axios.get("http://127.0.0.1:8000/api/beer-orders/order/"),
        ]);

        setBeers(stockResponse.data.beers);
        setOrder(orderResponse.data);
      } catch (error) {
        console.error("Error:", error);
        setError("Error al cargar los datos");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [refreshOrder]);

  const handleOrderSubmit = async (orderItem: Beer & { quantity: number }) => {
    try {
      const orderItemWithPrice = {
        name: orderItem.name,
        quantity: orderItem.quantity,
        price_per_unit: orderItem.price,
        total: orderItem.price * orderItem.quantity,
      };

      const response = await axios.post(
        "http://127.0.0.1:8000/api/beer-orders/order/",
        { items: [orderItemWithPrice] },
        { headers: { "Content-Type": "application/json" } }
      );

      setOrder(response.data);
      setRefreshOrder((prev) => !prev);
    } catch (error) {
      console.error("Error al enviar la orden:", error);
      setError("No se pudo actualizar la orden");
    }
  };

  if (loading) return <p className="text-white">Cargando...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="flex flex-col items-center gap-6 p-6">
      <h1 className="text-4xl font-bold text-white">Pedidos de Cerveza</h1>
      <BeerList beers={beers} />
      <OrderForm onSubmit={handleOrderSubmit} beers={beers} />
      {order && <OrderSummary order={order} />}
    </div>
  );
}
