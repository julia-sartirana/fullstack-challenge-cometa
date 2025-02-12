import { useState, useEffect } from "react";

interface PaymentFormProps {
  bill: { total: number; payments: Record<string, number> };
  onPay: (friend: string, amount: number) => void;
}

export default function PaymentForm({ bill, onPay }: PaymentFormProps) {
  const [friend, setFriend] = useState<string>("");
  const [amount, setAmount] = useState<number | null>(null);

  const getAmountOwed = (friend: string): number => {
    if (!bill || !friend) return 0;

    const equalShare = bill.total / 3;
    const individualPayment = bill.payments[friend] || 0;

    return Math.max(equalShare - individualPayment, 0);
  };

  useEffect(() => {
    if (friend) {
      setAmount(getAmountOwed(friend));
    } else {
      setAmount(null);
    }
  }, [friend, bill]);

  const handlePayment = () => {
    if (friend && amount !== null) {
      onPay(friend, amount);
      setAmount(null);
    }
  };

  const totalPaid = Object.values(bill.payments).reduce(
    (acc, curr) => acc + curr,
    0
  );
  const remainingTotal = bill.total - totalPaid;

  const paidFriends = Object.entries(bill.payments).filter(
    ([_, paidAmount]) => paidAmount > 0
  );

  return (
    <div className="bg-gray-800 p-4 rounded-lg w-full">
      <h2 className="text-xl font-bold text-white mb-4">Pagar Cuenta</h2>
      <p className="text-white mb-4">Total: ${bill.total.toFixed(2)}</p>
      <p className="text-white mb-4">
        Total restante: ${remainingTotal.toFixed(2)}
      </p>
      <div className="mt-2">
        <label className="text-white block">Selecciona un amigo:</label>
        <select
          className="p-2 rounded bg-gray-700 text-white"
          value={friend}
          onChange={(e) => setFriend(e.target.value)}
        >
          <option value="">Seleccionar...</option>
          {Object.keys(bill.payments).map((friendName) => (
            <option key={friendName} value={friendName}>
              {friendName}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-2">
        <label className="text-white block">Monto a pagar:</label>
        <input
          type="number"
          className="p-2 rounded bg-gray-700 text-white"
          value={amount !== null ? amount.toFixed(2) : ""}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
      </div>

      <button
        className={`mt-4 p-2 rounded text-white w-full ${
          !friend || amount === null || amount <= 0
            ? "bg-gray-500 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-700"
        }`}
        onClick={handlePayment}
        disabled={!friend || amount === null || amount <= 0}
      >
        Pagar
      </button>

      <div className="mt-4">
        <h3 className="text-white font-bold">Amigos que ya pagaron:</h3>
        <ul className="text-green-400">
          {paidFriends.length > 0 ? (
            paidFriends.map(([friend, amount]) => (
              <li key={friend}>
                ✔️ {friend} pagó ${amount.toFixed(2)}
              </li>
            ))
          ) : (
            <li className="text-gray-400">Nadie ha pagado aún</li>
          )}
        </ul>
      </div>
    </div>
  );
}
