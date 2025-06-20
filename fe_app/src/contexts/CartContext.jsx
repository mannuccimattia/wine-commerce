import React, { createContext, useContext, useState, useEffect } from "react";

// Crea il context
const CarrelloContext = createContext();

// Hook custom per accedere al context
export const useCarrello = () => useContext(CarrelloContext);

// Provider
export const CarrelloProvider = ({ children }) => {
  const [carrello, setCarrello] = useState([]);
  const [subtotale, setSubtotale] = useState(0);
  const [alertMsg, setAlertMsg] = useState("");

  useEffect(() => {
    // Carica dati da localStorage al primo rendering
    const storedCarrello = JSON.parse(localStorage.getItem("carrello")) || [];
    const storedSubtotale = parseFloat(localStorage.getItem("subtotale")) || 0;

    setCarrello(storedCarrello);
    setSubtotale(storedSubtotale);
  }, []);

  const aggiornaStorage = (carrelloAggiornato) => {
    const nuovoSubtotale = carrelloAggiornato.reduce(
      (acc, item) => acc + item.qty * (item.prezzo || 0),
      0
    );

    setCarrello(carrelloAggiornato);
    setSubtotale(nuovoSubtotale);

    localStorage.setItem("carrello", JSON.stringify(carrelloAggiornato));
    localStorage.setItem("subtotale", nuovoSubtotale.toFixed(2));
  };

  const aggiungiAlCarrello = (wine) => {
    const prodottoEsistente = carrello.find((item) => item.id === wine.id);
    let nuovoCarrello;

    if (prodottoEsistente) {
      nuovoCarrello = carrello.map((item) =>
        item.id === wine.id ? { ...item, qty: item.qty + 1 } : item
      );
      setAlertMsg(`${wine.name} aumentata a ${prodottoEsistente.qty + 1}`);
    } else {
      nuovoCarrello = [
        ...carrello,
        {
          id: wine.id,
          nome: wine.name,
          prezzo: wine.price,
          qty: 1,
          img: wine.image_front_url,
        },
      ];
      setAlertMsg(`${wine.name} aggiunto al carrello!`);
    }

    aggiornaStorage(nuovoCarrello);
    setTimeout(() => setAlertMsg(""), 3000);
  };

  const rimuoviDalCarrello = (itemId) => {
    const nuovoCarrello = carrello.filter((item) => item.id !== itemId);
    aggiornaStorage(nuovoCarrello);
  };

  const aggiornaQuantita = (itemId, newQuantity) => {
    if (newQuantity < 1) return; // Prevent negative quantities
    const nuovoCarrello = carrello.map((item) =>
      item.id === itemId ? { ...item, qty: newQuantity } : item
    );
    aggiornaStorage(nuovoCarrello);
  };

  return (
    <CarrelloContext.Provider
      value={{
        carrello,
        subtotale,
        alertMsg,
        aggiungiAlCarrello,
        rimuoviDalCarrello,
        aggiornaQuantita,
      }}
    >
      {children}
    </CarrelloContext.Provider>
  );
};
