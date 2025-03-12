import { useCart } from "../context/CartContext";
import CartItem from "../components/Cart/CartItem";

export default function Cart() {
  const { cart, removeFromCart } = useCart();

  return (
    <div>
      <h2>Twój koszyk</h2>
      {cart.length === 0 ? (
        <p>Koszyk jest pusty</p>
      ) : (
        cart.map((suborder) => (
          <CartItem key={suborder.suborderNumber} suborder={suborder} onRemove={removeFromCart} />
        ))
      )}
    </div>
  );
}
