"use client";
import "./login.css";
import Link from "next/link";
import { useState } from "react";

const TelaLogin = () => {
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErro("");
    setCarregando(true);

    const email = (event.currentTarget.email as HTMLInputElement).value;
    const senha = (event.currentTarget.password as HTMLInputElement).value;

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, senha }),
      });

      const data = await response.json();

      if (response.ok) {
        // ✅ Login bem-sucedido
        console.log("Token JWT:", data.access_token);

        // Armazena o token no localStorage para autenticação posterior
        localStorage.setItem("token", data.access_token);

        // Redireciona o usuário para a página de perfil (por exemplo)
        window.location.href = "/";
      } else {
        // ❌ Erro de login
        setErro(data.message || "Erro ao fazer login");
      }
    } catch (err) {
      console.error(err);
      setErro("Erro de conexão com o servidor");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="container">
      <div className="tela-login-container">
        <form className="folha" onSubmit={handleLogin}>
          <h3>Login</h3>

          <div className="campo">
            <label htmlFor="email">E-mail:</label>
            <input
              type="email"
              id="email"
              placeholder="name@flowbite.com"
              required
            />
          </div>

          <div className="campo">
            <label htmlFor="password">Senha de Acesso:</label>
            <input type="password" id="password" required />
          </div>

          <button type="submit" className="botao-login" disabled={carregando}>
            {carregando ? "Entrando..." : "Entrar"}
          </button>

          {erro && <p className="erro">{erro}</p>}

        </form>
      </div>
    </div>
  );
};

export default TelaLogin;
