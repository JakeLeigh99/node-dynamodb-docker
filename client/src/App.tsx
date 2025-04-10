import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

type Item = {
  id: string;
  name: string;
};

function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [name, setName] = useState<string>("");

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/items")
      .then((response) => setItems(response.data.Items))
      .catch((error) =>
        console.error("There was an error making the request:", error)
      );
  }, []);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem = { id: Date.now().toString(), name };
    axios.post("http://localhost:3000/api/item", newItem);
    setItems([...items, newItem]);
    setName("");
  };
  return (
    <div>
      <h1>Items</h1>
      <form className="item-form" onSubmit={onSubmit}>
        <input
          className="item-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter item name"
        />
        <button className="item-button" type="submit">
          Add Item
        </button>
      </form>
      <div className="table-container">
        <table className="item-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            {items.length > 0 ? (
              items.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2} className="no-data">
                  No items found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
