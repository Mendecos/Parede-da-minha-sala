import Cabecalho from "./componentes/Cabecalho/page";
import Corpo from "./componentes/Corpo/page";
import Rodape from "./componentes/Rodape/page";
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