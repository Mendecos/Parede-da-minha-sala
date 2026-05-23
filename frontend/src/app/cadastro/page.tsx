import Image from "next/image";
import "./cadastro.css";

const TelaCadastro = () => {
  return (
    <div className="tela-cadastro">
      {/* Lado esquerdo - imagem */}
      <div className="tela-cadastro-esquerda">
        <Image
          src="/" // coloque sua imagem dentro da pasta /public
          alt="Banner de cadastro"
          layout="fill"
          objectFit="cover"
          priority
        />
      </div>

      {/* Lado direito - formulário */}
      <div className="tela-cadastro-direita">
        <div className="folha">
          <h3>Criando uma nova conta</h3>
          <form>
            <div className="campo">
              <label htmlFor="email">E-mail:</label>
              <input type="email" id="email" required />
            </div>

            <div className="campo">
              <label htmlFor="nome-real">Nome Completo:</label>
              <input type="text" id="nome-real" required />
            </div>

            <div className="campo">
              <label htmlFor="nome-usuario">Nome de Usuário:</label>
              <input type="text" id="nome-usuario" required />
            </div>

            <div className="campo">
              <label htmlFor="senha">Senha:</label>
              <input type="password" id="senha" required />
            </div>

            <div className="campo">
              <label htmlFor="confirmar-senha">Confirme a senha:</label>
              <input type="password" id="confirmar-senha" required />
            </div>

            <button type="submit" className="botao-cadastro">
              Criar conta
            </button>
          </form>

          <p className="texto-cadastro">
            Já possui conta? <a href="/login">Faça login</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default TelaCadastro;
