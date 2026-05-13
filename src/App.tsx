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

  const handleNewOrder = () => {
    setScreen('catalog');
    setSelectedBookId(null);
    setSelectedBranch(null);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header__inner">
          <h1 className="app-header__title">Letras del Eje</h1>
          <nav className="app-nav">
            <button
              className={`app-nav__btn ${screen === 'catalog' || screen === 'branches' ? 'app-nav__btn--active' : ''}`}
              onClick={() => { setScreen('catalog'); setSelectedBookId(null); }}
            >
              Catálogo
            </button>
            <button
              className={`app-nav__btn app-nav__btn--cart ${screen === 'order' ? 'app-nav__btn--active' : ''}`}
              onClick={() => setScreen('branches')}
            >
              Hacer Pedido
              {itemCount > 0 && <span className="app-nav__badge">{itemCount}</span>}
            </button>
            <button
              className={`app-nav__btn ${screen === 'contact' ? 'app-nav__btn--active' : ''}`}
              onClick={() => setScreen('contact')}
            >
              Contacto
            </button>
          </nav>
        </div>
      </header>

      <main className="app-main">
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
          />
        )}
        {screen === 'receipt' && <OrderReceiptScreen onNewOrder={handleNewOrder} />}
        {screen === 'contact' && <ContactScreen />}
      </main>
    </div>
  );
}