"use client";
import "./Lancamento.css";
import { useEffect, useState } from "react";
import axios from "axios";
import Pesquisa from "../Pesquisa/page";

interface Item {
  id: number;
  titulo: string;
  sinopse: string;
  foto?: string;
}

const Lancamento = () => {
  const [itens, setitens] = useState<Item[]>([]);
  const [itensFiltrados, setItensFiltrados] = useState<Item[]>([]);

  useEffect(() => {
    const buscaritens = async () => {
      try {
        const resposta = await axios.get<Item[]>(
          "http://127.0.0.1:5000/livros",
        );
        setitens(resposta.data);
        setItensFiltrados(resposta.data); // 👈 inicia com todos
      } catch (erro) {
        console.error("Erro ao buscar itens:", erro);
      }
    };

    buscaritens();
  }, []);

  const handlePesquisar = (texto: string) => {
    if (!texto.trim()) {
      setItensFiltrados(itens);
      return;
    }

    const termo = texto.toLowerCase();

    const resultado = itens.filter(
      (item) =>
        item.titulo.toLowerCase().includes(termo) ||
        item.id.toString() === termo,
    );

    setItensFiltrados(resultado);
  };

  return (
    <div>
      {/* 🔍 Pesquisa */}
      <Pesquisa onPesquisar={handlePesquisar} />

      <div className="titulo">Lançamentos Recentes</div>

      <div className="cards-container">
        {itensFiltrados.length > 0 ? (
          itensFiltrados.map((livro) => (
            <div className="card-lancamento" key={livro.id}>
              <div className="card-conteudo">
                <div className="img-card">
                  <img
                    src={livro.foto || "./Cabecalho_img/logoescrito.png"}
                    alt={livro.titulo}
                  />
                </div>
                <div className="descricao">
                  <h1>{livro.titulo}</h1>
                  <h3>{livro.sinopse}</h3>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p style={{ color: "black", textAlign: "center" }}>
            Nenhum livro encontrado.
          </p>
        )}
      </div>
    </div>
  );
};

export default Lancamento;
