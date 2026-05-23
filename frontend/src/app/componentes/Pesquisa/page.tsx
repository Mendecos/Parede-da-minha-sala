import { useState } from "react";
import "./Pesquisa copy.css";

interface PesquisaProps {
  onPesquisar: (texto: string) => void;
}

function Pesquisa({ onPesquisar }: PesquisaProps) {
  const [pesquisa, setPesquisa] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    setPesquisa(valor);
    onPesquisar(valor);
  };

  return (
    <div className="pesquisa-container">
      <div className="pesquisa-org">
        <span className="icon-lupa">
          🔍
        </span>

        <input
          type="search"
          placeholder="Pesquisar por ID ou título"
          className="pesquisa-input"
          value={pesquisa}
          onChange={handleChange}
        />

        <button type="button" className="botao-pesquisar">
          Pesquisar
        </button>
      </div>
    </div>
  );
}

export default Pesquisa;
