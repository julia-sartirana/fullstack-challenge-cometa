"use client";

import React, { useState } from "react";

interface Beer {
  name: string;
  price: number;
  quantity: number;
}

interface Bill {
  total: number;
  payments: Record<string, number>;
}

interface OrderFormProps {
  onSubmit: (order: Beer & { quantity: number }) => void;
  beers: Beer[];
  bill: Bill | null;
}

const OrderForm: React.FC<OrderFormProps> = React.memo(
  ({ onSubmit, beers, bill }) => {
    const [selectedBeer, setSelectedBeer] = useState<Beer | null>(
      beers[0] || null
    );
    const [quantity, setQuantity] = useState(1);
    const [errorMessage, setErrorMessage] = useState("");

    const selectedBeerStock = selectedBeer?.quantity || 0;
    const isOutOfStock = selectedBeerStock === 0;

    const totalPaid = bill
      ? Object.values(bill.payments).reduce((acc, curr) => acc + curr, 0)
      : 0;
    const isOrderDisabled = !!(
      (bill?.total || 0) > 0 &&
      totalPaid > 0 &&
      totalPaid < (bill?.total || 0)
    );

    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newQuantity = parseInt(e.target.value, 10);
      if (newQuantity > selectedBeerStock) {
        setErrorMessage(`Solo hay ${selectedBeerStock} disponibles`);
      } else {
        setErrorMessage("");
        setQuantity(newQuantity);
      }
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (selectedBeer && quantity > 0 && selectedBeerStock >= quantity) {
        onSubmit({
          ...selectedBeer,
          quantity,
        });
      }
    };

    return (
      <div className="bg-gray-800 p-6 rounded-xl shadow-md w-full">
        <h2 className="text-xl font-semibold text-white mb-4">
          Hacer un Pedido
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="text-white">Selecciona una cerveza:</label>
          <select
            className="p-2 rounded bg-gray-700 text-white"
            value={selectedBeer?.name || ""}
            onChange={(e) => {
              const beer = beers.find((b) => b.name === e.target.value);
              setSelectedBeer(beer || null);
            }}
            disabled={isOrderDisabled}
          >
            {beers.map((beer) => (
              <option key={beer.name} value={beer.name}>
                {beer.name}
              </option>
            ))}
          </select>

          <label className="text-white">Cantidad:</label>
          <input
            type="number"
            min="1"
            max={selectedBeerStock}
            value={quantity}
            onChange={handleQuantityChange}
            className="p-2 rounded bg-gray-700 text-white"
            disabled={isOutOfStock || isOrderDisabled}
          />

          {errorMessage && (
            <p className="text-red-400 text-sm">{errorMessage}</p>
          )}
          {isOutOfStock && (
            <p className="text-red-400 text-sm">No hay stock disponible.</p>
          )}

          <button
            type="submit"
            disabled={
              isOutOfStock || quantity > selectedBeerStock || isOrderDisabled
            }
            className={`py-2 px-4 rounded font-bold transition ${
              isOutOfStock || quantity > selectedBeerStock || isOrderDisabled
                ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                : "bg-yellow-500 text-gray-900 hover:bg-yellow-400"
            }`}
          >
            {isOutOfStock ? "Sin stock" : "Ordenar"}
          </button>
        </form>
      </div>
    );
  }
);

export default React.memo(OrderForm, (prevProps, nextProps) => {
  return (
    prevProps.beers === nextProps.beers &&
    prevProps.bill?.total === nextProps.bill?.total &&
    JSON.stringify(prevProps.bill?.payments || {}) ===
      JSON.stringify(nextProps.bill?.payments || {})
  );
});
