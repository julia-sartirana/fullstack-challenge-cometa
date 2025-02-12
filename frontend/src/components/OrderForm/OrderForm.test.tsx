import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import OrderForm from "./OrderForm";

const mockOnSubmit = jest.fn();

const mockBeers = [
  { name: "Corona", price: 115, quantity: 5 },
  { name: "Quilmes", price: 120, quantity: 0 },
];

describe("OrderForm Component", () => {
  it("renders correctly", () => {
    render(<OrderForm onSubmit={mockOnSubmit} beers={mockBeers} />);
    expect(screen.getByText("Hacer un Pedido")).toBeInTheDocument();
  });

  it("disables the order button when beer is out of stock", () => {
    render(<OrderForm onSubmit={mockOnSubmit} beers={[mockBeers[1]]} />);
    expect(screen.getByRole("button", { name: /sin stock/i })).toBeDisabled();
  });

  it("enables the order button when beer is in stock", () => {
    render(<OrderForm onSubmit={mockOnSubmit} beers={mockBeers} />);
    expect(screen.getByRole("button", { name: /ordenar/i })).not.toBeDisabled();
  });

  it("calls onSubmit with correct data when ordering", () => {
    render(<OrderForm onSubmit={mockOnSubmit} beers={mockBeers} />);

    fireEvent.change(screen.getByRole("spinbutton"), {
      target: { value: "2" },
    });
    fireEvent.click(screen.getByRole("button", { name: /ordenar/i }));

    expect(mockOnSubmit).toHaveBeenCalledWith({
      name: "Corona",
      price: 115,
      quantity: 2,
    });
  });
});
