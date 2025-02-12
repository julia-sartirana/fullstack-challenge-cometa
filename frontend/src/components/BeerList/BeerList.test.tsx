import React from "react";
import { render, screen } from "@testing-library/react";
import BeerList from "./BeerList";

const mockBeers = [
  { name: "Corona", price: 115, quantity: 5 },
  { name: "Quilmes", price: 120, quantity: 0 },
];

describe("BeerList Component", () => {
  it("renders correctly with beer list", () => {
    render(<BeerList beers={mockBeers} />);

    expect(screen.getByText("Cervezas Disponibles")).toBeInTheDocument();
    expect(screen.getByText("Corona")).toBeInTheDocument();
    expect(screen.getByText("Quilmes")).toBeInTheDocument();
  });

  it("displays stock availability correctly", () => {
    render(<BeerList beers={mockBeers} />);

    expect(screen.getByText("Stock: 5")).toBeInTheDocument();
    expect(screen.getByText("Agotado")).toBeInTheDocument();
  });

  it("displays beer prices correctly", () => {
    render(<BeerList beers={mockBeers} />);

    expect(screen.getByText("$115")).toBeInTheDocument();
    expect(screen.getByText("$120")).toBeInTheDocument();
  });
});
