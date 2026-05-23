import "./Rodape.css";
import Image from "next/image";
function Rodape() {
  return (
    <footer className="rodape">
      <div className="centroRodape">
        <Image src="/Cabecalho_img/logoescrito.png" alt="boos_storeLogo" width={90} height={45} />
        <p>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Inventore illum recusandae animi? Recusandae neque quia impedit 
          quam omnis? Autem perferendis numquam modi vitae nesciunt mollitia nulla, odit sed ducimus neque?
        </p>
      </div>
    </footer>
  );
}
export default Rodape
