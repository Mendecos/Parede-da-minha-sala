"use client";

import "./Pesquisa copy.css";

interface Props {
  onPesquisar: (texto: string) => void;
}

export default function Pesquisa({ onPesquisar }: Props) {
  return (
    <div className="pesquisa-container">
      <form
        className="pesquisa-form"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="pesquisa-org">
          <span className="icon-lupa">
            <svg
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </span>

          <input
            type="text"
            className="pesquisa-input"
            placeholder="Pesquisar arte..."
            onChange={(e) =>
              onPesquisar(e.target.value)
            }
          />

          <button
            type="submit"
            className="botao-pesquisar"
          >
            Pesquisar
          </button>
        </div>
      </form>
    </div>
  );
}