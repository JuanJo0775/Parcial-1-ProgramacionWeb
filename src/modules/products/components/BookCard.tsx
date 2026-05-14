import type { Book } from '../../../shared/types';
import './BookCard.css';

interface BookCardProps {
  book: Book;
  onClick?: (book: Book) => void;
}

export const BookCard = ({ book, onClick }: BookCardProps) => (
  <article className="book-card">
    <button
      className="book-card__action"
      type="button"
      onClick={() => onClick?.(book)}
      aria-label={`Ver detalle de ${book.title}`}
    >
      <img src={book.coverUrl} alt={book.title} className="book-card__cover" />
      <div className="book-card__info">
        <span className="book-card__genre">{book.genre}</span>
        <h3 className="book-card__title">{book.title}</h3>
        <p className="book-card__author">{book.author}</p>
        <p className="book-card__price">${book.price.toLocaleString('es-CO')} COP</p>
        <span className={`book-card__stock ${book.stock === 0 ? 'book-card__stock--out' : ''}`}>
          {book.stock > 0 ? `Stock: ${book.stock}` : 'Agotado'}
        </span>
      </div>
    </button>
  </article>
);