import { useState, useEffect } from "react";
import axios from "axios";

interface Beer {
  name: string;
  price: number;
  quantity: number;
}

interface OrderItem {
  name: string;
  quantity: number;
  price_per_unit: number;
  total: number;
}

interface Round {
  id: number;
  items: OrderItem[];
  timestamp: string;
}

interface Order {
  created: string;
  paid: boolean;
  subtotal: number;
  total: number;
  taxes: number;
  discounts: number;
  items: OrderItem[];
  rounds: Round[];
}

interface Bill {
  total: number;
  remaining_total: number;
  payments: Record<string, number>;
}

// API URLs
const API_BASE_URL = "http://127.0.0.1:8000/api/beer-orders";
const API_ENDPOINTS = {
  stock: `${API_BASE_URL}/stock/`,
  order: `${API_BASE_URL}/order/`,
  bill: `${API_BASE_URL}/bill/`,
  pay: `${API_BASE_URL}/bill/pay/`,
};

export function useBeerOrders() {
  const [beers, setBeers] = useState<Beer[]>([]);
  const [order, setOrder] = useState<Order | null>(null);
  const [bill, setBill] = useState<Bill | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Handles API errors
  const handleError = (error: unknown, customMessage: string) => {
    console.error(customMessage, error);
    setError(error instanceof Error ? error.message : customMessage);
    return null;
  };

  // Fetch data
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [stockResult, orderResult, billResult] = await Promise.allSettled([
        axios.get<{ beers: Beer[] }>(API_ENDPOINTS.stock),
        axios.get<Order>(API_ENDPOINTS.order),
        axios.get<Bill>(API_ENDPOINTS.bill),
      ]);

      if (stockResult.status === "fulfilled")
        setBeers(stockResult.value.data.beers);
      if (orderResult.status === "fulfilled") setOrder(orderResult.value.data);
      if (billResult.status === "fulfilled") setBill(billResult.value.data);
    } catch (error) {
      handleError(error, "Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Place an order
  const placeOrder = async (
    orderItem: Beer & { quantity: number }
  ): Promise<Order | null> => {
    try {
      setError(null);

      const orderItemWithPrice: OrderItem = {
        name: orderItem.name,
        quantity: orderItem.quantity,
        price_per_unit: orderItem.price,
        total: orderItem.price * orderItem.quantity,
      };

      const response = await axios.post<Order>(
        API_ENDPOINTS.order,
        { items: [orderItemWithPrice] },
        { headers: { "Content-Type": "application/json" } }
      );

      setOrder(response.data);
      await fetchData();
      return response.data;
    } catch (error) {
      return handleError(error, "No se pudo actualizar la orden");
    }
  };

  // Pay the bill
  const payBill = async (
    friend: string,
    amount: number
  ): Promise<Bill | null> => {
    try {
      setError(null);

      const response = await axios.post<Bill>(
        API_ENDPOINTS.pay,
        { friend, amount },
        { headers: { "Content-Type": "application/json" } }
      );

      setBill(response.data);

      const totalPaid = Object.values(response.data.payments).reduce(
        (acc, curr) => acc + curr,
        0
      );

      if (totalPaid === response.data.total) {
        setOrder(null);
      }

      await fetchData();
      return response.data;
    } catch (error) {
      return handleError(error, "No se pudo procesar el pago");
    }
  };

  return {
    beers,
    order,
    bill,
    loading,
    error,
    placeOrder,
    payBill,
  };
}
