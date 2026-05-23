"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./AdminPage.css";

interface Livro {
  id: number;
  titulo: string;
  autor: string;
  sinopse: string;
  imagem: string;
}

export default function AdminPage() {
  const router = useRouter();

  const [titulo, setTitulo] = useState("");
  const [autor, setAutor] = useState("");
  const [sinopse, setSinopse] = useState("");
  const [imagem, setImagem] = useState("");
  const [mensagem, setMensagem] = useState("");

  const [itens, setItens] = useState<Livro[]>([]);
  const [itensFiltrados, setItensFiltrados] = useState<Livro[]>([]);
  const [pesquisa, setPesquisa] = useState("");

  // 🔐 Proteção da rota
  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("TOKEN:", token);
    if (!token) {
      router.push("/login");
      return;
    }

    fetch("http://localhost:5000/livros", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setItens(data);
        setItensFiltrados(data);
      })
      .catch(() => {
        console.error("Erro ao buscar livros");
      });
  }, [router]);

  const handlePesquisar = (texto: string) => {
    setPesquisa(texto);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/livros", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          titulo,
          autor,
          sinopse,
          foto: imagem,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMensagem(data.message || "Erro ao cadastrar item");
        return;
      }

      setMensagem("Item cadastrado com sucesso!");
      setTitulo("");
      setAutor("");
      setSinopse("");
      setImagem("");
    } catch {
      setMensagem("Erro de conexão com o servidor");
    }
  };
  const handleExcluir = async (id: number) => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    const confirmar = confirm("Deseja realmente excluir este livro?");

    if (!confirmar) return;

    try {
      const response = await fetch(`http://localhost:5000/livros/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        setMensagem("Erro ao excluir livro");
        return;
      }

      // remove da lista sem precisar recarregar
      const novaLista = itens.filter((item) => item.id !== id);

      setItens(novaLista);
      setItensFiltrados(novaLista);

      setMensagem("Livro excluído com sucesso!");
    } catch (error) {
      setMensagem("Erro de conexão");
    }
  };

  return (
    <div>
      <header className="cabecalho">
        <h1>Painel Administrativo</h1>
      </header>
      <div className="corpo">
        {/* LADO ESQUERDO - CADASTRO */}
        <div className="corpo-esq">
          <div className="corpo-form">
            <form onSubmit={handleSubmit}>
              <div className="caixa-form">
                <label>Título</label>
                <input
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                />
              </div>

              <div className="caixa-form">
                <label>Criador</label>
                <input
                  value={autor}
                  onChange={(e) => setAutor(e.target.value)}
                />
              </div>

              <div className="caixa-form">
                <label>Descrição</label>
                <textarea
                  value={sinopse}
                  onChange={(e) => setSinopse(e.target.value)}
                />
              </div>

              <div className="caixa-form">
                <label>Imagem (URL)</label>
                <input
                  value={imagem}
                  onChange={(e) => setImagem(e.target.value)}
                />
                <button type="submit">Cadastrar</button>
              </div>
            </form>
          </div>
        </div>

        {/* LADO DIREITO - PESQUISA */}
        <div className="corpo-dir">
          <div className="corpo-form">
            <div className="barra-pesquisa">
              <input
                type="text"
                placeholder="Pesquisar por ID ou título"
                value={pesquisa}
                onChange={(e) => handlePesquisar(e.target.value)}
              />
            </div>
            <div className="lista-livros">
              {itensFiltrados.length === 0 && <p>Nenhum livro encontrado</p>}

              {itensFiltrados.map((livro) => (
                <div key={livro.id} className="livro-card">
                  <p>
                    <strong>ID:</strong> {livro.id}
                  </p>
                  <p>
                    <strong>Título:</strong> {livro.titulo}
                  </p>
                  <p>
                    <strong>Autor:</strong> {livro.autor}
                  </p>
                  <p>
                    <strong>Imagem:</strong> {livro.imagem}
                  </p>
                  <button
                    className="botao-excluir"
                    onClick={() => handleExcluir(livro.id)}
                  >
                    Excluir
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {mensagem && <p className="mensagem">{mensagem}</p>}
      </div>
    </div>
  );
}
