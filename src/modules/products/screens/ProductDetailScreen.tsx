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

  if (isLoading) return <p className="detail__loading">Cargando...</p>;
  if (error) return <p className="detail__error">Error: {error}</p>;
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
      onGoToOrder?.();
    }, 800);
  };

  return (
    <div className="detail">
      {onBack && (
        <button className="detail__back-btn" onClick={onBack}>
          ← Volver al catálogo
        </button>
      )}

      <div className="detail__layout">
        <img src={book.coverUrl} alt={book.title} className="detail__cover" />
        <div className="detail__info">
          <span className="detail__genre">{book.genre}</span>
          <h2 className="detail__title">{book.title}</h2>
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
                Cantidad:
                <input
                  type="number"
                  min={1}
                  max={book.stock}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.min(Math.max(1, Number(e.target.value)), book.stock))}
                  className="detail__qty-input"
                />
              </label>
              <button className="detail__add-btn" onClick={handleAddToOrder}>
                {added ? '✓ Agregado' : 'Agregar al pedido'}
              </button>
            </div>
          ) : (
            <p className="detail__no-stock">Este libro está agotado.</p>
          )}
        </div>
      </div>
    </div>
  );
};