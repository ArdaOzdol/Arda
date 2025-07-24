import React, { useState, useEffect, useRef } from "react";

const totalRaflar = 12;
const katSayisi = 3;
const bolmeSayisi = 3;

const rafHarfleri = "ABCDEFGHIJKL";

const generateInitialData = () => {
  const raflar = {};
  for (let i = 0; i < totalRaflar; i++) {
    const raf = rafHarfleri[i];
    for (let kat = 1; kat <= katSayisi; kat++) {
      for (let bolme = 1; bolme <= bolmeSayisi; bolme++) {
        const adres = ${raf}${kat}.${bolme};
        raflar[adres] = { dolu: false, kasaAdedi: 0 };
      }
    }
  }
  return raflar;
};

function App() {
  const [raflar, setRaflar] = useState(() => {
    const saved = localStorage.getItem("umg-raflar");
    return saved ? JSON.parse(saved) : generateInitialData();
  });
  const [aktifAdres, setAktifAdres] = useState("");
  const [kasaAdedi, setKasaAdedi] = useState(0);

  const inputRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("umg-raflar", JSON.stringify(raflar));
  }, [raflar]);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, [aktifAdres]);

  const qrOkundu = (adres) => {
    if (!raflar[adres]) {
      alert("Geçersiz raf adresi: " + adres);
      return;
    }
    setAktifAdres(adres);
    setKasaAdedi(raflar[adres].kasaAdedi || 0);
  };

  const onInputChange = (e) => {
    const val = e.target.value.trim().toUpperCase();
    if (val.length > 0) {
      qrOkundu(val);
      e.target.value = "";
    }
  };

  const kaydet = () => {
    setRaflar({
      ...raflar,
      [aktifAdres]: { dolu: kasaAdedi > 0, kasaAdedi },
    });
    setAktifAdres("");
    setKasaAdedi(0);
  };

  const sifirla = () => {
    setRaflar({
      ...raflar,
      [aktifAdres]: { dolu: false, kasaAdedi: 0 },
    });
    setAktifAdres("");
    setKasaAdedi(0);
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
      <h1>ÜMG Coder</h1>
      <p style={{ fontStyle: "italic", marginBottom: 10 }}>
        Coder by M.Kilic
      </p>

      <input
        ref={inputRef}
        type="text"
        autoFocus
        onChange={onInputChange}
        style={{ opacity: 0, position: "absolute" }}
      />

      {aktifAdres && (
        <div
          style={{
            position: "fixed",
            top: "30%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            border: "1px solid #ccc",
            padding: 20,
            boxShadow: "0 0 10px rgba(0,0,0,0.3)",
            zIndex: 9999,
            minWidth: 300,
          }}
        >
          <h2>{aktifAdres} - Kasa adedi giriniz</h2>
          <input
            type="number"
            min="0"
            value={kasaAdedi}
            onChange={(e) => setKasaAdedi(Number(e.target.value))}
            style={{ width: "100%", fontSize: 18, padding: 5, marginTop: 10 }}
          />
          <div style={{ marginTop: 15, display: "flex", justifyContent: "space-between" }}>
            <button onClick={kaydet} style={{ padding: "10px 20px" }}>
              Kaydet
            </button>
            <button onClick={sifirla} style={{ padding: "10px 20px" }}>
              Sıfırla
            </button>
            <button onClick={() => setAktifAdres("")} style={{ padding: "10px 20px" }}>
              İptal
            </button>
          </div>
        </div>
      )}

      <div style={{ display: "flex", flexWrap: "wrap", marginTop: 30 }}>
        {Object.keys(raflar).map((adres) => {
          const raf = raflar[adres];
          return (
            <div
              key={adres}
              onClick={() => qrOkundu(adres)}
              style={{
                cursor: "pointer",
                border: "1px solid #ddd",
                padding: 10,
                margin: 5,
                width: 90,
                textAlign: "center",
                backgroundColor: raf.dolu ? "#ffcccc" : "#ccffcc",
              }}
            >
              <div style={{ fontWeight: "bold" }}>{adres}</div>
              <div>{raf.dolu ? ${raf.kasaAdedi} kasa : "Boş"}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
