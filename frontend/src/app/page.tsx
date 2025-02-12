import Link from "next/link";
import { FaBeer, FaBook } from "react-icons/fa";

const exercises = [
  {
    id: 1,
    name: "Pedidos de Cerveza",
    description: "Gestiona pedidos y pagos en el bar.",
    href: "/beer-orders",
    icon: <FaBeer className="text-yellow-500 text-6xl" />,
    bgColor: "bg-yellow-500/20",
    textColor: "text-yellow-300",
  },
  {
    id: 2,
    name: "Libros NYT",
    description: "Explora los libros recomendados por el NYT.",
    href: "/nyt-books",
    icon: <FaBook className="text-blue-500 text-6xl" />,
    bgColor: "bg-blue-500/20",
    textColor: "text-blue-300",
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white">
      <h1 className="text-5xl font-extrabold mb-10 text-center">
        Ejercicios Full Stack
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {exercises.map((exercise) => (
          <Link key={exercise.id} href={exercise.href} className="h-full">
            <div
              className={`${exercise.bgColor} ${exercise.textColor} flex flex-col items-center justify-between h-full p-8 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-105 text-center border border-white/20`}
            >
              <div className="flex flex-col items-center">
                <div className="mb-4">{exercise.icon}</div>
                <h2 className="text-2xl font-semibold">{exercise.name}</h2>
                <p className="text-sm mt-2">{exercise.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
