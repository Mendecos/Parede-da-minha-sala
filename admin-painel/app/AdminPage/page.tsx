"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./AdminPage.css";

interface Arte {
  id: number;
  nome: string;
  descricao: string;
  artista: string;
  foto?: string;
}

export default function AdminPage() {
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [artista, setArtista] = useState("");
  const [descricao, setDescricao] = useState("");
  const [foto, setFoto] = useState("");
  const [mensagem, setMensagem] = useState("");

  const [itens, setItens] = useState<Arte[]>([]);
  const [itensFiltrados, setItensFiltrados] = useState<Arte[]>([]);
  const [pesquisa, setPesquisa] = useState("");

  // 🔐 Proteção da rota
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    fetch("http://localhost:5000/artes", {
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
        console.error("Erro ao buscar artes");
      });
  }, [router]);

  // 🔎 Pesquisa
  const handlePesquisar = (texto: string) => {
    setPesquisa(texto);

    if (!texto.trim()) {
      setItensFiltrados(itens);
      return;
    }

    const termo = texto.toLowerCase();

    const resultado = itens.filter(
      (item) =>
        item.nome.toLowerCase().includes(termo) || item.id.toString() === termo,
    );

    setItensFiltrados(resultado);
  };

  // ➕ Cadastro
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/artes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nome,
          artista,
          descricao,
          foto,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMensagem(data.message || "Erro ao cadastrar arte");
        return;
      }

      setMensagem("Arte cadastrada com sucesso!");

      // limpa os campos
      setNome("");
      setArtista("");
      setDescricao("");
      setFoto("");

      // atualiza lista automaticamente
      const novaLista = [...itens, data];

      setItens(novaLista);
      setItensFiltrados(novaLista);
    } catch {
      setMensagem("Erro de conexão com o servidor");
    }
  };

  // ❌ Exclusão
  const handleExcluir = async (id: number) => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    const confirmar = confirm("Deseja realmente excluir esta arte?");

    if (!confirmar) return;

    try {
      const response = await fetch(`http://localhost:5000/artes/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        setMensagem("Erro ao excluir arte");
        return;
      }

      const novaLista = itens.filter((item) => item.id !== id);

      setItens(novaLista);
      setItensFiltrados(novaLista);

      setMensagem("Arte excluída com sucesso!");
    } catch {
      setMensagem("Erro de conexão");
    }
  };

  return (
    <div>
      <header className="cabecalho">
        <h1>Painel Administrativo</h1>
      </header>

      <div className="corpo">
        {/* ESQUERDA */}
        <div className="corpo-esq">
          <div className="corpo-form">
            <form onSubmit={handleSubmit}>
              <div className="caixa-form">
                <label>Nome da Arte</label>

                <input value={nome} onChange={(e) => setNome(e.target.value)} />
              </div>

              <div className="caixa-form">
                <label>Artista</label>

                <input
                  value={artista}
                  onChange={(e) => setArtista(e.target.value)}
                />
              </div>

              <div className="caixa-form">
                <label>Descrição</label>

                <textarea
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                />
              </div>

              <div className="caixa-form">
                <label>Imagem (URL)</label>

                <input value={foto} onChange={(e) => setFoto(e.target.value)} />
              </div>

              <button type="submit">Cadastrar</button>
            </form>
          </div>
        </div>

        {/* DIREITA */}
        <div className="corpo-dir">
          <div className="corpo-form">
            <div className="barra-pesquisa">
              <input
                type="text"
                placeholder="Pesquisar por ID ou nome"
                value={pesquisa}
                onChange={(e) => handlePesquisar(e.target.value)}
              />
            </div>

            <div className="lista-livros">
              {itensFiltrados.length === 0 && <p>Nenhuma arte encontrada</p>}

              {itensFiltrados.map((arte) => (
                <div key={arte.id} className="livro-card">
                  <p>
                    <strong>ID:</strong> {arte.id}
                  </p>

                  <p>
                    <strong>Nome:</strong> {arte.nome}
                  </p>

                  <p>
                    <strong>Artista:</strong> {arte.artista}
                  </p>

                  <p>
                    <strong>Descrição:</strong> {arte.descricao}
                  </p>

                  <div className="imagem-preview">
                    <strong>Imagem:</strong>

                    {arte.foto ? (
                      <img
                        src={arte.foto}
                        alt={arte.nome}
                        className="preview-img"
                      />
                    ) : (
                      <p>Imagem não disponível</p>
                    )}
                  </div>

                  <button
                    className="botao-excluir"
                    onClick={() => handleExcluir(arte.id)}
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
