"use client";

import React from "react";

interface OrderItem {
  name: string;
  quantity: number;
}

interface OrderSummaryProps {
  order: {
    items: OrderItem[];
    subtotal: number;
    taxes: number;
    discounts: number;
    total: number;
  };
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ order }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-md w-full">
      <h2 className="text-xl font-semibold text-white mb-4">
        Resumen de Orden
      </h2>
      {order.items.length === 0 ? (
        <p className="text-gray-400">No hay pedidos aún.</p>
      ) : (
        <ul>
          {order.items.map((item, index) => (
            <li
              key={index}
              className="flex justify-between border-b border-gray-600 py-2 items-center"
            >
              <div>
                <span className="text-white">{item.name}</span>
                <span className="text-yellow-400 ml-2"> x{item.quantity}</span>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4 text-white">
        <p>Subtotal: ${order.subtotal.toFixed(2)}</p>
        <p>Impuestos: ${order.taxes.toFixed(2)}</p>
        <p>Descuentos: -${order.discounts.toFixed(2)}</p>
        <hr className="my-2 border-gray-600" />
        <p className="font-bold text-yellow-400 text-lg">
          Total: ${order.total.toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default OrderSummary;
