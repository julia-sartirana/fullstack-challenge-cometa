import React from "react";
import { render, screen } from "@testing-library/react";
import OrderSummary from "./OrderSummary";

const mockOrder = {
  items: [
    { name: "Corona", quantity: 2 },
    { name: "Quilmes", quantity: 1 },
  ],
  subtotal: 230,
  taxes: 36.8,
  discounts: 10,
  total: 256.8,
};

describe("OrderSummary Component", () => {
  it("renders correctly", () => {
    render(<OrderSummary order={mockOrder} />);
    expect(screen.getByText("Resumen de Orden")).toBeInTheDocument();
  });

  it("displays ordered items", () => {
    render(<OrderSummary order={mockOrder} />);
    expect(screen.getByText("Corona")).toBeInTheDocument();
    expect(screen.getByText("Quilmes")).toBeInTheDocument();
  });

  it("displays correct order totals", () => {
    render(<OrderSummary order={mockOrder} />);
    expect(screen.getByText("Subtotal: $230.00")).toBeInTheDocument();
    expect(screen.getByText("Impuestos: $36.80")).toBeInTheDocument();
    expect(screen.getByText("Descuentos: -$10.00")).toBeInTheDocument();
    expect(screen.getByText("Total: $256.80")).toBeInTheDocument();
  });

  it("shows empty message if no items", () => {
    render(<OrderSummary order={{ ...mockOrder, items: [] }} />);
    expect(screen.getByText("No hay pedidos aún.")).toBeInTheDocument();
  });
});
