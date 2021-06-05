import React, { useEffect, useState } from "react";
import Header from "./Header";
import PizzaForm from "./PizzaForm";
import PizzaList from "./PizzaList";

function App() {
  const [pizzas, setPizzas] = useState([]);
  const baseURL = "http://localhost:3001/pizzas"

  useEffect(() => {
    fetch(baseURL)
      .then(resp => resp.json())
      .then(data => {
        setPizzas(data)
      })
  }, [])

  const [formData, setFormData] = useState({
    topping: "",
    size: "Initial"
  });
  const [vegetarian, setVegatarian] = useState("");
  const [pizzaId, setPizzaId] = useState(undefined);

  function editPizza(pizza) {
    setFormData({
      topping: pizza.topping,
      size: pizza.size
    })
    setVegatarian(prevState => pizza.vegetarian ? "Vegetarian" : "Not Vegetarian")
    setPizzaId(prevState => pizza.id)
  }

  function submitPizza() {
    const configObj = {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        vegetarian: vegetarian === "Vegetarian"
      })
    }
    fetch(`${baseURL}/${pizzaId}`, configObj)
      .then(resp => resp.json())
      .then(newPizza => {
        const newPizzas = pizzas.map(pizza => {
          if (pizza.id === pizzaId) {
            return newPizza
          }
          return pizza
        })
        setPizzas(newPizzas)
      })
    setFormData({
      topping: "",
      size: "Initial"
    })
    setVegatarian("")
    setPizzaId(undefined)
  }
  return (
    <>
      <Header />
      <PizzaForm
        formData={formData}
        setFormData={setFormData}
        vegetarian={vegetarian}
        setVegatarian={setVegatarian}
        submitPizza={submitPizza} />
      <PizzaList pizzas={pizzas} editPizza={editPizza} />
    </>
  );
}

export default App;
