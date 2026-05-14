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
    <section className="catalog" aria-labelledby="catalog-title">
      <header className="catalog__header">
        <div>
          <h2 id="catalog-title" className="catalog__title">Catalogo</h2>
          <p className="catalog__subtitle">Explora libros seleccionados para el Eje Cafetero.</p>
        </div>
        <p className="catalog__count">{books.length} resultado(s)</p>
      </header>

      <form
        className="catalog__filters"
        aria-label="Filtros del catalogo"
        onSubmit={(event) => event.preventDefault()}
      >
        <fieldset className="catalog__fieldset">
          <legend>Filtrar libros</legend>
          <label className="catalog__filter-group">
            <span>Genero</span>
            <select
              value={localFilters.genre ?? ''}
              onChange={(e) => handleFilterChange({ genre: e.target.value || undefined })}
            >
              <option value="">Todos</option>
              {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </label>

          <label className="catalog__filter-group">
            <span>Precio maximo (COP)</span>
            <input
              type="number"
              min={0}
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
        </fieldset>

        <button
          className="catalog__clear-btn"
          type="button"
          onClick={() => handleFilterChange({ genre: undefined, priceMax: undefined, available: true })}
        >
          Limpiar filtros
        </button>
      </form>

      {isLoading && <p className="catalog__loading" role="status" aria-live="polite">Cargando catalogo...</p>}
      {error && (
        <p className="catalog__error" role="alert">
          No pudimos cargar el catalogo. Intenta de nuevo. {error}
        </p>
      )}

      <div className="catalog__grid" aria-live="polite">
        {books.map((book) => (
          <BookCard key={book.id} book={book} onClick={onBookClick} />
        ))}
      </div>

      {!isLoading && books.length === 0 && (
        <p className="catalog__empty">No hay libros que coincidan con los filtros.</p>
      )}
    </section>
  );
};