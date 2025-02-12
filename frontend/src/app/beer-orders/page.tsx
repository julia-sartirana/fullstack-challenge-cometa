"use client";

import React, { useState } from "react";
import { useBeerOrders } from "@/hooks/useBeerOrder";
import BeerList from "@/components/BeerList/BeerList";
import OrderForm from "@/components/OrderForm";
import OrderSummary from "@/components/OrderSummary";
import PaymentForm from "@/components/PaymentForm";
import CustomSnackbar from "@/components/CustomSnackbar";

export default function BeerOrdersPage() {
  const { beers, order, bill, loading, error, placeOrder, payBill } =
    useBeerOrders();
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handlePayment = async (friend: string, amount: number) => {
    const updatedBill = await payBill(friend, amount);

    if (updatedBill) {
      const totalPaid = Object.values(updatedBill.payments).reduce(
        (acc, curr) => acc + curr,
        0
      );
      if (totalPaid >= updatedBill.total) {
        setPaymentSuccess(true);
      }
    }
  };

  if (loading) return <p className="text-white">Cargando...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="flex flex-col items-center gap-6 p-6 w-full">
      <h1 className="text-4xl font-bold text-white">Pedidos de Cerveza</h1>

      <div className="flex w-full gap-6">
        <div className="flex-1 bg-gray-900 p-6 rounded-lg">
          <BeerList beers={beers} />
          <OrderForm onSubmit={placeOrder} beers={beers} bill={bill} />
          {order && <OrderSummary order={order} />}
        </div>
        {bill && (
          <div className="flex-1 bg-gray-900 p-6 rounded-lg flex flex-col items-center">
            <PaymentForm bill={bill} onPay={handlePayment} />
          </div>
        )}
      </div>
      <CustomSnackbar
        message="✅ ¡La cuenta ha sido pagada completamente!"
        isVisible={paymentSuccess}
        onClose={() => setPaymentSuccess(false)}
      />
    </div>
  );
}
