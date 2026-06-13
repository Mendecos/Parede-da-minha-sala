import { Arte } from "@/types/Arte";
import "./arte.css";

interface Props {
  arte: Arte;
}

export default function CardArte({ arte }: Props) {
  return (
    <div className="card-lancamento">
      <div className="card-conteudo">

        <div className="img-card">
          <img
            src={arte.foto}
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
  );
}