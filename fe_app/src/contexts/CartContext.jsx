import React, { createContext, useContext, useState, useEffect } from "react";

// Create the context
const CarrelloContext = createContext();

// Custom hook to access the context
export const useCarrello = () => useContext(CarrelloContext);

// Provider
export const CarrelloProvider = ({ children }) => {
  const [carrello, setCarrello] = useState([]);
  const [subtotale, setSubtotale] = useState(0);
  const [alertMsg, setAlertMsg] = useState("");

  useEffect(() => {
    // Load data from localStorage on first render
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

  const aggiungiAlCarrello = (wine, quantity = 1) => {
    const prodottoEsistente = carrello.find((item) => item.id === wine.id);
    let nuovoCarrello;

    if (prodottoEsistente) {
      nuovoCarrello = carrello.map((item) =>
        item.id === wine.id ? { ...item, qty: item.qty + quantity } : item
      );
      setAlertMsg(
        `${wine.name} aumentata a ${prodottoEsistente.qty + quantity}`
      );
    } else {
      nuovoCarrello = [
        ...carrello,
        {
          id: wine.id,
          nome: wine.name,
          prezzo: wine.price,
          slug: wine.slug,
          qty: quantity, // Set the initial quantity to the passed quantity
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
    if (newQuantity < 1) return;
    const nuovoCarrello = carrello.map((item) =>
      item.id === itemId ? { ...item, qty: newQuantity } : item
    );
    aggiornaStorage(nuovoCarrello);
  };

  //Svuota completamente il carrello -> da usare dopo aggiunta ordine
  const svuotaCarrello = () => {
    setCarrello([]);
    setSubtotale(0);
    localStorage.removeItem("carrello");
    localStorage.removeItem("subtotale");
    setAlertMsg("Carrello svuotato!");
    setTimeout(() => setAlertMsg(""), 3000);
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
        svuotaCarrello, // Aggiungi la nuova funzione al provider
      }}
    >
      {children}
    </CarrelloContext.Provider>
  );
};
