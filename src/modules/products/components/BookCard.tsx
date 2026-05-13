import type { Book } from '../../../shared/types';
import './BookCard.css';

interface BookCardProps {
  book: Book;
  onClick?: (book: Book) => void;
}

export const BookCard = ({ book, onClick }: BookCardProps) => (
  <div className="book-card" onClick={() => onClick?.(book)}>
    <img src={book.coverUrl} alt={book.title} className="book-card__cover" />
    <div className="book-card__info">
      <h3 className="book-card__title">{book.title}</h3>
      <p className="book-card__author">{book.author}</p>
      <p className="book-card__price">${book.price.toLocaleString('es-CO')} COP</p>
      <span className={`book-card__stock ${book.stock === 0 ? 'book-card__stock--out' : ''}`}>
        {book.stock > 0 ? `Stock: ${book.stock}` : 'Agotado'}
      </span>
    </div>
  </div>
);