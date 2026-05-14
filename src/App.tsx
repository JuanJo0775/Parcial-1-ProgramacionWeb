import { useEffect } from 'react';
import { Routes, Route, Link, NavLink, useNavigate, useParams } from 'react-router-dom';
import { CatalogScreen } from './modules/products/screens/CatalogScreen';
import { ProductDetailScreen } from './modules/products/screens/ProductDetailScreen';
import { OrderFormScreen } from './modules/orders/screens/OrderFormScreen';
import { OrderReceiptScreen } from './modules/orders/screens/OrderReceiptScreen';
import { ContactScreen } from './modules/contact/screens/ContactScreen';
import { BranchSelectorScreen } from './modules/branches/screens/BranchSelectorScreen';
import { CartScreen } from './modules/cart/screens/CartScreen';
import { useOrdersStore } from './modules/orders/store';
import { useBranchesStore } from './modules/branches/store';
import { useProductsStore } from './modules/products/store';
import type { Branch } from './shared/types';
import './App.css';

function AppDataLoader({ children }: { children: React.ReactNode }) {
  const fetchBooks = useProductsStore((s) => s.fetchBooks);
  const fetchBranches = useBranchesStore((s) => s.fetchBranches);

  useEffect(() => {
    fetchBooks();
    fetchBranches();
  }, [fetchBooks, fetchBranches]);

  return <>{children}</>;
}

export default function App() {
  const draft = useOrdersStore((s) => s.draft);
  const branches = useBranchesStore((s) => s.branches);
  const itemCount = draft.items?.reduce((sum, i) => sum + i.quantity, 0) ?? 0;

  const getBranchFromState = (): Branch | null => {
    const branchId = draft.delivery?.branchId;
    if (!branchId) return null;
    return branches.find(b => b.id === branchId) ?? null;
  };

  return (
    <AppDataLoader>
    <div className="app">
      <header className="app-header">
        <div className="app-header__inner">
          <Link to="/" className="app-brand">
            <p className="app-brand__eyebrow">Libreria del Eje Cafetero</p>
            <h1 className="app-header__title">Letras del Eje</h1>
          </Link>
          <nav className="app-nav" aria-label="Navegacion principal">
            <ul className="app-nav__list">
              <li>
                <NavLink to="/" className={({ isActive }) => isActive ? 'app-nav__btn app-nav__btn--active' : 'app-nav__btn'}>
                  Catalogo
                </NavLink>
              </li>
              <li>
                <NavLink to="/carrito" className={({ isActive }) => isActive ? 'app-nav__btn app-nav__btn--active app-nav__btn--cart' : 'app-nav__btn app-nav__btn--cart'}>
                  Carrito
                  {itemCount > 0 && <span className="app-nav__badge">{itemCount}</span>}
                </NavLink>
              </li>
              <li>
                <NavLink to="/contacto" className={({ isActive }) => isActive ? 'app-nav__btn app-nav__btn--active' : 'app-nav__btn'}>
                  Contacto
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="app-main">
        <div className="app-main__inner">
          <Routes>
            <Route path="/" element={<CatalogWrapper />} />
            <Route path="/libro/:id" element={<ProductDetailWrapper />} />
            <Route path="/carrito" element={<CartWrapper />} />
            <Route path="/sucursales" element={<BranchesWrapper />} />
            <Route path="/pedido" element={<OrderWrapper branch={getBranchFromState()} />} />
            <Route path="/recibo" element={<ReceiptWrapper />} />
            <Route path="/contacto" element={<ContactScreen />} />
          </Routes>
        </div>
      </main>

      <footer className="app-footer">
        <div className="app-footer__inner">
          <p className="app-footer__text">Eje Cafetero, Colombia · Entregas locales y retiro en sucursal.</p>
          <p className="app-footer__text">Horario: Lun–Sab 9:00–19:00 · Tel: (606) 000-0000</p>
        </div>
      </footer>
    </div>
    </AppDataLoader>
  );
}

function CatalogWrapper() {
  const navigate = useNavigate();
  return <CatalogScreen onBookClick={(book) => navigate(`/libro/${book.id}`)} />;
}

function ProductDetailWrapper() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  if (!id) return null;
  return <ProductDetailScreen id={id} onBack={() => navigate('/')} onGoToCart={() => navigate('/carrito')} />;
}

function CartWrapper() {
  const navigate = useNavigate();
  return <CartScreen onContinueShopping={() => navigate('/')} onGoToCheckout={() => navigate('/sucursales')} />;
}

function BranchesWrapper() {
  const navigate = useNavigate();
  const setBranchInDraft = useOrdersStore((s) => s.setDraft);
  
  const handleSelect = (branch: Branch) => {
    setBranchInDraft({
      delivery: {
        type: 'pickup',
        branchId: branch.id,
      },
    });
    navigate('/pedido');
  };
  
  return <BranchSelectorScreen onSelect={handleSelect} />;
}

function OrderWrapper({ branch }: { branch: Branch | null }) {
  const navigate = useNavigate();
  
  const handleOrderPlaced = () => {
    navigate('/recibo');
  };
  
  const handleCancel = () => {
    navigate('/');
  };
  
  return <OrderFormScreen selectedBranch={branch} onOrderPlaced={handleOrderPlaced} onCancel={handleCancel} />;
}

function ReceiptWrapper() {
  const navigate = useNavigate();
  
  const handleNewOrder = () => {
    navigate('/');
  };
  
  return <OrderReceiptScreen onNewOrder={handleNewOrder} />;
}