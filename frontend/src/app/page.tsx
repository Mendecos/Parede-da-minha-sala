import Cabecalho from "./componentes/Cabecalho/cabecalho";
import Corpo from "./componentes/Corpo/corpo";
import Rodape from "./componentes/Rodape/rodape";
import "../../public/fundoPag/Fundo.css";


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Cabecalho></Cabecalho>
        <Corpo></Corpo>
      </header>
      <footer>
        <Rodape></Rodape>
      </footer>
    </div>
  );
}

export default App;