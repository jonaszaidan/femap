"use client";

import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function MortalidadeChart({
  dados,
}: {
  dados: any[];
}) {
  const dadosOrdenados = [...dados].sort(
  (a, b) => b.mortalidade - a.mortalidade
);
  
  
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4">
        Mortalidade por Município
      </h2>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={dadosOrdenados}>
          <XAxis dataKey="municipio" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="mortalidade">
  {dadosOrdenados.map((entry, index) => {
    let color = "#22c55e"; // verde

    if (entry.mortalidade >= 3 && entry.mortalidade <= 4.5) {
      color = "#facc15"; // amarelo
    }

    if (entry.mortalidade > 4.5) {
      color = "#ef4444"; // vermelho
    }

    return (
      <Cell
        key={`cell-${index}`}
        fill={color}
      />
    );
  })}
</Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}