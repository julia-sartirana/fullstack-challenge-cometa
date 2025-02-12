"use client";

import React from "react";

interface Beer {
  name: string;
  price: number;
  quantity: number;
}

interface BeerListProps {
  beers: Beer[];
}

const BeerList: React.FC<BeerListProps> = ({ beers }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-md w-full">
      <h2 className="text-xl font-semibold text-white mb-4">
        Cervezas Disponibles
      </h2>
      <ul>
        {beers.map((beer, index) => (
          <li
            key={index}
            className="flex justify-between border-b border-gray-600 py-2"
          >
            <span className="text-white">{beer.name}</span>
            <span className="text-yellow-400">${beer.price}</span>
            <span
              className={`text-sm ${
                beer.quantity > 0 ? "text-green-400" : "text-red-400"
              }`}
            >
              {beer.quantity > 0 ? `Stock: ${beer.quantity}` : "Agotado"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BeerList;
