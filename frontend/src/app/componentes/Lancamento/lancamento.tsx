/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import "./Lancamento.css";
import axios from "axios";
import Pesquisa from "../Pesquisa/pesquisa";

interface Arte {
  id: number;
  nome: string;
  descricao: string;
  artista: string;
  foto?: string;
}

const Lancamento = () => {
  const [artes, setArtes] = useState<Arte[]>([]);
  const [artesFiltradas, setArtesFiltradas] = useState<Arte[]>([]);

  useEffect(() => {
    const buscarArtes = async () => {
      try {
        const resposta = await axios.get<Arte[]>(
          "http://127.0.0.1:5000/artes"
        );

        setArtes(resposta.data);
        setArtesFiltradas(resposta.data);
      } catch (erro) {
        console.error("Erro ao buscar artes:", erro);
      }
    };

    buscarArtes();
  }, []);

  const handlePesquisar = (texto: string) => {
    if (!texto.trim()) {
      setArtesFiltradas(artes);
      return;
    }

    const termo = texto.toLowerCase();

    const resultado = artes.filter(
      (arte) =>
        arte.nome.toLowerCase().includes(termo) ||
        arte.id.toString() === termo
    );

    setArtesFiltradas(resultado);
  };

  return (
    <div>
      {/* Pesquisa */}
      <Pesquisa onPesquisar={handlePesquisar} />

      <div className="titulo">Artes Recentes</div>

      <div className="cards-container">
        {artesFiltradas.length > 0 ? (
          artesFiltradas.map((arte) => (
            <div className="card-lancamento" key={arte.id}>
              <div className="card-conteudo">

                <div className="img-card">
                  <img
                    src={
                      arte.foto ||
                      "./Cabecalho_img/logoescrito.png"
                    }
                    alt={arte.nome}
                  />
                </div>

                <div className="descricao">
                  <h1>{arte.nome}</h1>

                  <h2>{arte.artista}</h2>

                  <p>{arte.descricao}</p>
                </div>

              </div>
            </div>
          ))
        ) : (
          <p style={{ color: "black", textAlign: "center" }}>
            Nenhuma arte encontrada.
          </p>
        )}
      </div>
    </div>
  );
};

export default Lancamento;