import { useState } from 'react';
import { CatalogScreen } from './modules/products/screens/CatalogScreen';
import { ProductDetailScreen } from './modules/products/screens/ProductDetailScreen';
import { OrderFormScreen } from './modules/orders/screens/OrderFormScreen';
import { OrderReceiptScreen } from './modules/orders/screens/OrderReceiptScreen';
import { ContactScreen } from './modules/contact/screens/ContactScreen';
import { BranchSelectorScreen } from './modules/branches/screens/BranchSelectorScreen';
import { useOrdersStore } from './modules/orders/store';
import type { Book, Branch } from './shared/types';
import './App.css';

type Screen = 'catalog' | 'branches' | 'order' | 'receipt' | 'contact';

export default function App() {
  const [screen, setScreen] = useState<Screen>('catalog');
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const draft = useOrdersStore((s) => s.draft);
  const itemCount = draft.items?.reduce((sum, i) => sum + i.quantity, 0) ?? 0;

  const handleBookClick = (book: Book) => {
    setSelectedBookId(book.id);
  };

  const handleBackToCatalog = () => {
    setSelectedBookId(null);
  };

  const handleGoToOrder = () => {
    setSelectedBookId(null);
    setScreen('branches');
  };

  const handleBranchSelected = (branch: Branch) => {
    setSelectedBranch(branch);
    setScreen('order');
  };

  const handleOrderPlaced = () => {
    setScreen('receipt');
  };

  const handleCancelOrder = () => {
    setScreen('catalog');
    setSelectedBookId(null);
    setSelectedBranch(null);
  };

  const handleNewOrder = () => {
    setScreen('catalog');
    setSelectedBookId(null);
    setSelectedBranch(null);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header__inner">
          <div className="app-brand">
            <p className="app-brand__eyebrow">Libreria del Eje Cafetero</p>
            <h1 className="app-header__title">Letras del Eje</h1>
          </div>
          <nav className="app-nav" aria-label="Navegacion principal">
            <ul className="app-nav__list">
              <li>
                <button
                  className={`app-nav__btn ${screen === 'catalog' || screen === 'branches' ? 'app-nav__btn--active' : ''}`}
                  onClick={() => { setScreen('catalog'); setSelectedBookId(null); }}
                  type="button"
                  aria-current={screen === 'catalog' || screen === 'branches' ? 'page' : undefined}
                >
                  Catalogo
                </button>
              </li>
              <li>
                <button
                  className={`app-nav__btn app-nav__btn--cart ${screen === 'order' ? 'app-nav__btn--active' : ''}`}
                  onClick={() => setScreen('branches')}
                  type="button"
                  aria-current={screen === 'order' ? 'page' : undefined}
                >
                  Hacer pedido
                  {itemCount > 0 && <span className="app-nav__badge">{itemCount}</span>}
                </button>
              </li>
              <li>
                <button
                  className={`app-nav__btn ${screen === 'contact' ? 'app-nav__btn--active' : ''}`}
                  onClick={() => setScreen('contact')}
                  type="button"
                  aria-current={screen === 'contact' ? 'page' : undefined}
                >
                  Contacto
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="app-main">
        <div className="app-main__inner">
        {screen === 'catalog' && (
          selectedBookId ? (
            <ProductDetailScreen id={selectedBookId} onBack={handleBackToCatalog} onGoToOrder={handleGoToOrder} />
          ) : (
            <CatalogScreen onBookClick={handleBookClick} />
          )
        )}
        {screen === 'branches' && (
          <BranchSelectorScreen
            onSelect={handleBranchSelected}
          />
        )}
        {screen === 'order' && (
          <OrderFormScreen
            selectedBranch={selectedBranch}
            onOrderPlaced={handleOrderPlaced}
            onCancel={handleCancelOrder}
          />
        )}
        {screen === 'receipt' && <OrderReceiptScreen onNewOrder={handleNewOrder} />}
        {screen === 'contact' && <ContactScreen />}
        </div>
      </main>

      <footer className="app-footer">
        <div className="app-footer__inner">
          <p className="app-footer__text">Eje Cafetero, Colombia · Entregas locales y retiro en sucursal.</p>
          <p className="app-footer__text">Horario: Lun–Sab 9:00–19:00 · Tel: (606) 000-0000</p>
        </div>
      </footer>
    </div>
  );
}