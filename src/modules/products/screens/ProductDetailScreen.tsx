import { useState } from 'react';
import { useProductDetail } from '../hooks/useProductDetail';
import { useOrdersStore } from '../../orders/store';
import './ProductDetailScreen.css';

interface ProductDetailScreenProps {
  id: string;
  onBack?: () => void;
  onGoToOrder?: () => void;
}

export const ProductDetailScreen = ({ id, onBack, onGoToOrder }: ProductDetailScreenProps) => {
  const { selectedBook: book, isLoadingDetail: isLoading, errorDetail: error } = useProductDetail(id);
  const { draft, setDraft } = useOrdersStore();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (isLoading) return <p className="detail__loading" role="status">Cargando detalle...</p>;
  if (error) return <p className="detail__error" role="alert">No pudimos cargar el detalle. {error}</p>;
  if (!book) return null;

  const handleAddToOrder = () => {
    if (book.stock === 0) return;
    const currentItems = draft.items ?? [];
    const existing = currentItems.find((i) => i.bookId === book.id);
    const newItems = existing
      ? currentItems.map((i) =>
          i.bookId === book.id ? { ...i, quantity: i.quantity + quantity } : i
        )
      : [...currentItems, { bookId: book.id, quantity }];

    setDraft({ items: newItems });
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
    }, 800);
  };

  return (
    <section className="detail" aria-labelledby="detail-title">
      {onBack && (
        <button className="detail__back-btn" type="button" onClick={onBack}>
          ← Volver al catalogo
        </button>
      )}

      <article className="detail__layout">
        <img src={book.coverUrl} alt={book.title} className="detail__cover" />
        <div className="detail__info">
          <span className="detail__genre">{book.genre}</span>
          <h2 id="detail-title" className="detail__title">{book.title}</h2>
          <p className="detail__author">de {book.author}</p>
          <p className="detail__price">${book.price.toLocaleString('es-CO')} COP</p>
          <p className={`detail__stock ${book.stock === 0 ? 'detail__stock--out' : ''}`}>
            {book.stock > 0 ? `Stock: ${book.stock} unidades` : 'Agotado'}
          </p>
          <p className="detail__isbn">ISBN: {book.isbn}</p>
          <p className="detail__description">{book.description}</p>

          {book.stock > 0 ? (
            <div className="detail__actions">
              <label className="detail__qty-label">
                Cantidad
                <input
                  type="number"
                  min={1}
                  max={book.stock}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.min(Math.max(1, Number(e.target.value)), book.stock))}
                  className="detail__qty-input"
                />
              </label>
              <button className="detail__add-btn" type="button" onClick={handleAddToOrder}>
                {added ? '✓ Agregado' : 'Agregar al pedido'}
              </button>
              {onGoToOrder && (
                <button className="detail__order-btn" type="button" onClick={onGoToOrder}>
                  Elegir sucursal
                </button>
              )}
            </div>
          ) : (
            <p className="detail__no-stock">Este libro esta agotado.</p>
          )}
        </div>
      </article>
    </section>
  );
};