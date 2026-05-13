import { useState } from 'react';
import { useProducts } from '../hooks/useProducts';
import { BookCard } from '../components/BookCard';
import type { Book, ProductFilters } from '../../../shared/types';
import './CatalogScreen.css';

const GENRES = ['Novela', 'Misterio', 'Clásico', 'Romance', 'Cuento', 'Ficción', 'Ciencia ficción', 'Fantasía', 'Terror', 'Divulgación', 'Autoayuda'];

interface CatalogScreenProps {
  onBookClick?: (book: Book) => void;
  defaultFilters?: ProductFilters;
}

export const CatalogScreen = ({ onBookClick, defaultFilters = {} }: CatalogScreenProps) => {
  const { books, isLoading, error, setFilters } = useProducts();
  const [localFilters, setLocalFilters] = useState<ProductFilters>({
    available: true,
    ...defaultFilters,
  });

  const handleFilterChange = (partial: Partial<ProductFilters>) => {
    const next = { ...localFilters, ...partial };
    setLocalFilters(next);
    setFilters(next);
  };

  return (
    <div className="catalog">
      <h2 className="catalog__title">Catálogo</h2>

      <div className="catalog__filters">
        <label className="catalog__filter-group">
          <span>Género</span>
          <select
            value={localFilters.genre ?? ''}
            onChange={(e) => handleFilterChange({ genre: e.target.value || undefined })}
          >
            <option value="">Todos</option>
            {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        </label>

        <label className="catalog__filter-group">
          <span>Precio máximo (COP)</span>
          <input
            type="number"
            placeholder="Ej. 40000"
            value={localFilters.priceMax ?? ''}
            onChange={(e) => handleFilterChange({ priceMax: e.target.value ? Number(e.target.value) : undefined })}
          />
        </label>

        <label className="catalog__filter-group catalog__filter-group--checkbox">
          <input
            type="checkbox"
            checked={localFilters.available ?? false}
            onChange={(e) => handleFilterChange({ available: e.target.checked || undefined })}
          />
          <span>Solo disponibles</span>
        </label>

        <button
          className="catalog__clear-btn"
          onClick={() => handleFilterChange({ genre: undefined, priceMax: undefined, available: true })}
        >
          Limpiar filtros
        </button>
      </div>

      {isLoading && <p className="catalog__loading">Cargando...</p>}
      {error && <p className="catalog__error">Error: {error}</p>}

      <div className="catalog__grid">
        {books.map((book) => (
          <BookCard key={book.id} book={book} onClick={onBookClick} />
        ))}
      </div>

      {!isLoading && books.length === 0 && (
        <p className="catalog__empty">No hay libros que coincidan con los filtros.</p>
      )}
    </div>
  );
};