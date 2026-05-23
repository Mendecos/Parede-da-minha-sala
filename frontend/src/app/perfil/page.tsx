import "./perfil.css";
import Image from "next/image";
import "./perfil.css";
import Cabecalho from "../componentes/Cabecalho/page";
const Perfil = () => {
  return (
    <div>
      <Cabecalho></Cabecalho>
      <div className="container">
        <div className="esquerda">
          <Image
            src=""
            alt="Imagem de perfil"
            width={90}
            height={25}
          />
          <div>
            <h1>--USUARIO--</h1>
          </div>
          <div className="botoes-info">
            <div className="info-container">
              <div className="info-box">
                <div className="card-conteudo">
                  <h1>Dados Pessoais</h1>
                </div>
              </div>
              <div className="info-box">
                <div className="card-conteudo">
                  <h1>Senha e Segurança</h1>
                </div>
              </div>
              <div className="info-box">
                <div className="card-conteudo">
                  <h1>Alterar Dados</h1>
                </div>
              </div>
              <div className="info-box">
                <div className="card-conteudo">
                  <h1>Suporte</h1>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="direita">
          <div className="colecao">
            <h1>Seus Favoritos</h1>
          </div>
          <div className="cards-container">
        <div className="card-lancamento">
          <div className="card-conteudo">
            <h1>Item Numero 000*</h1>
            <div className="img-card">
              <img src="./Cabecalho_img/logoescrito.png" alt="" />
            </div>
            <h3>breve descrição*</h3>
          </div>
        </div>
      </div>
        </div>
      </div>
    </div>
  );
};

export default Perfil;
