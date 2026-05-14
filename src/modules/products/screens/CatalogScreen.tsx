import { useState, useRef, useEffect } from 'react';
import { useProducts } from '../hooks/useProducts';
import { BookCard } from '../components/BookCard';
import type { Book, ProductFilters } from '../../../shared/types';
import './CatalogScreen.css';

const GENRES = ['Novela', 'Misterio', 'Clásico', 'Romance', 'Cuento', 'Ficción', 'Ciencia ficción', 'Fantasía', 'Terror', 'Divulgación', 'Autoayuda'];

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder: string;
}

const CustomSelect = ({ value, onChange, options, placeholder }: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="custom-select" ref={ref}>
      <button
        type="button"
        className={`custom-select__trigger ${value ? 'custom-select__trigger--has-value' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="custom-select__text">{value || placeholder}</span>
        <svg className={`custom-select__arrow ${isOpen ? 'custom-select__arrow--open' : ''}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {isOpen && (
        <div className="custom-select__dropdown">
          <button
            type="button"
            className={`custom-select__option ${!value ? 'custom-select__option--selected' : ''}`}
            onClick={() => { onChange(''); setIsOpen(false); }}
          >
            Todos los géneros
          </button>
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              className={`custom-select__option ${value === opt ? 'custom-select__option--selected' : ''}`}
              onClick={() => { onChange(opt); setIsOpen(false); }}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

interface CatalogScreenProps {
  onBookClick?: (book: Book) => void;
  defaultFilters?: ProductFilters;
}

export const CatalogScreen = ({ onBookClick, defaultFilters = {} }: CatalogScreenProps) => {
  const { books, isLoading, error, setFilters, fetchBooks } = useProducts();
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
            <span>Género</span>
            <CustomSelect
              value={localFilters.genre ?? ''}
              onChange={(val) => handleFilterChange({ genre: val || undefined })}
              options={GENRES}
              placeholder="Todos los géneros"
            />
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
        <div className="catalog__error-state">
          <h3 className="catalog__error-title">No hay productos disponibles</h3>
          <p className="catalog__error-text">Hubo un problema al cargar el catalogo. Por favor intenta de nuevo.</p>
          <button className="catalog__error-btn" type="button" onClick={() => fetchBooks()}>
            Reintentar
          </button>
        </div>
      )}

      {!error && !isLoading && (
        <>
          <div className="catalog__grid" aria-live="polite">
            {books.map((book) => (
              <BookCard key={book.id} book={book} onClick={onBookClick} />
            ))}
          </div>

          {!isLoading && books.length === 0 && (
            <p className="catalog__empty">No hay libros que coincidan con los filtros.</p>
          )}
        </>
      )}
    </section>
  );
};