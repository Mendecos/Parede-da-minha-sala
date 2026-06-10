"use client";
import { useState } from "react";
import Pesquisa from "../PesquisaNodatabase/page";
import CardArte from "../CardArte/page"

import { artes } from "../../data/artes";

export default function Lancamento() {
  const [artesFiltradas, setArtesFiltradas] =
    useState(artes);

  const handlePesquisar = (
    texto: string
  ) => {
    if (!texto.trim()) {
      setArtesFiltradas(artes);
      return;
    }

    const termo = texto.toLowerCase();

    const resultado = artes.filter(
      (arte) =>
        arte.nome
          .toLowerCase()
          .includes(termo) ||
        arte.artista
          .toLowerCase()
          .includes(termo)
    );

    setArtesFiltradas(resultado);
  };

  return (
    <>
      <Pesquisa
        onPesquisar={handlePesquisar}
      />

      <div className="titulo">
        Artes Recentes
      </div>

      <div className="cards-container">
        {artesFiltradas.map((arte) => (
          <CardArte
            key={arte.id}
            arte={arte}
          />
        ))}
      </div>
    </>
  );
}