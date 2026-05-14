import { useOrdersStore } from '../../orders/store';
import { useProductsStore } from '../../products/store';
import './CartScreen.css';

interface CartScreenProps {
  onContinueShopping?: () => void;
  onGoToCheckout?: () => void;
}

export const CartScreen = ({ onContinueShopping, onGoToCheckout }: CartScreenProps) => {
  const { draft, setDraft } = useOrdersStore();
  const booksMap = useProductsStore((state) => state.books).reduce<Record<string, import('../../../shared/types').Book>>((acc, b) => {
    acc[b.id] = b;
    return acc;
  }, {});

  const items = draft.items ?? [];
  const isEmpty = items.length === 0;

  const updateQuantity = (bookId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    const book = booksMap[bookId];
    if (!book) return;
    if (newQuantity > book.stock) return;

    const currentItems = draft.items ?? [];
    const newItems = currentItems.map((item) =>
      item.bookId === bookId ? { ...item, quantity: newQuantity } : item
    );
    setDraft({ items: newItems });
  };

  const removeItem = (bookId: string) => {
    const currentItems = draft.items ?? [];
    const newItems = currentItems.filter((item) => item.bookId !== bookId);
    setDraft({ items: newItems });
  };

  const getSubtotal = (bookId: string, quantity: number) => {
    const book = booksMap[bookId];
    return book ? book.price * quantity : 0;
  };

  const getTotal = () => {
    return items.reduce((sum, item) => sum + getSubtotal(item.bookId, item.quantity), 0);
  };

  if (isEmpty) {
    return (
      <section className="cart" aria-labelledby="cart-title">
        <div className="cart__empty">
          <h2 id="cart-title" className="cart__empty-title">Tu carrito está vacío</h2>
          <p className="cart__empty-text">Agrega libros desde el catálogo para comenzar tu pedido.</p>
          {onContinueShopping && (
            <button className="cart__continue-btn" type="button" onClick={onContinueShopping}>
              Ver catálogo
            </button>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="cart" aria-labelledby="cart-title">
      <header className="cart__header">
        <h2 id="cart-title" className="cart__title">Mi Carrito</h2>
        <p className="cart__subtitle">{items.length} libro(s) en tu pedido</p>
      </header>

      <ul className="cart__items">
        {items.map((item) => {
          const book = booksMap[item.bookId];
          if (!book) return null;
          const subtotal = book.price * item.quantity;

          return (
            <li key={item.bookId} className="cart__item">
              <img src={book.coverUrl} alt={book.title} className="cart__item-cover" />
              <div className="cart__item-details">
                <h3 className="cart__item-title">{book.title}</h3>
                <p className="cart__item-author">de {book.author}</p>
                <p className="cart__item-price">${book.price.toLocaleString('es-CO')} COP</p>
              </div>
              <div className="cart__item-actions">
                <div className="cart__item-qty">
                  <button
                    className="cart__qty-btn"
                    type="button"
                    onClick={() => updateQuantity(item.bookId, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    −
                  </button>
                  <span className="cart__qty-value">{item.quantity}</span>
                  <button
                    className="cart__qty-btn"
                    type="button"
                    onClick={() => updateQuantity(item.bookId, item.quantity + 1)}
                    disabled={item.quantity >= book.stock}
                  >
                    +
                  </button>
                </div>
                <p className="cart__item-subtotal">${subtotal.toLocaleString('es-CO')} COP</p>
                <button
                  className="cart__item-remove"
                  type="button"
                  onClick={() => removeItem(item.bookId)}
                >
                  Eliminar
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="cart__summary">
        <div className="cart__total">
          <span>Total del pedido</span>
          <span className="cart__total-value">${getTotal().toLocaleString('es-CO')} COP</span>
        </div>
        <div className="cart__actions">
          {onContinueShopping && (
            <button className="cart__continue-btn" type="button" onClick={onContinueShopping}>
              Agregar más libros
            </button>
          )}
          {onGoToCheckout && (
            <button className="cart__checkout-btn" type="button" onClick={onGoToCheckout}>
              Proceder al pedido
            </button>
          )}
        </div>
      </div>
    </section>
  );
};