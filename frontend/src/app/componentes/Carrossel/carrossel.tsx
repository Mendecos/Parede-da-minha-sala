"use client";
import { useEffect } from "react";
import Image from "next/image";
import "./carrossel.css";

const Carrossel = () => {
  useEffect(() => {
    const imgs = document.getElementById("img");
    const img = document.querySelectorAll("#img img");
    let idx = 0;

    function carrossel() {
      idx++;
      if (idx > img.length - 1) {
        idx = 0;
      }
      const largura = img[0].clientWidth; // pega largura do 1º item
      if (imgs) {
        imgs.style.transform = `translateX(${-idx * largura}px)`;
      }
    }

    const intervalo = setInterval(carrossel, 2000); // troca a cada 2s
    return () => clearInterval(intervalo);
  }, []);

  return (
    <div className="principal">
      <div className="carrossel">
        <div className="container" id="img">
          <Image src="/Cabecalho_img/logoescrito.png" alt="logo 1" width={600} height={300} />
          <Image src="/Cabecalho_img/logoescrito.png" alt="logo 2" width={600} height={300} />
          <Image src="/Cabecalho_img/logoescrito.png" alt="logo 3" width={600} height={300} />
          <Image src="/Cabecalho_img/logoescrito.png" alt="logo 1" width={600} height={300} />
          <Image src="/Cabecalho_img/logoescrito.png" alt="logo 2" width={600} height={300} />
          <Image src="/Cabecalho_img/logoescrito.png" alt="logo 3" width={600} height={300} />
        </div>
      </div>
    </div>
  );
};

export default Carrossel;
