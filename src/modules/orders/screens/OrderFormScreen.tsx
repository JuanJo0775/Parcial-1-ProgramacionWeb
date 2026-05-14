import { useEffect, useState } from 'react';
import { useCreateOrder } from '../hooks/useCreateOrder';
import { useProductsStore } from '../../products/store';
import type { Branch } from '../../../shared/types';
import './OrderFormScreen.css';

interface OrderFormScreenProps {
  selectedBranch: Branch | null;
  onOrderPlaced?: () => void;
  onCancel?: () => void;
}

export const OrderFormScreen = ({ selectedBranch, onOrderPlaced, onCancel }: OrderFormScreenProps) => {
  const { draft, setDraft, setSelectedBranchId, submitOrder, receipt, isLoading, error, reset } = useCreateOrder();
  const booksMap = useProductsStore((s) => s.books).reduce<Record<string, string>>((acc, b) => {
    acc[b.id] = b.title;
    return acc;
  }, {});
  const [form, setForm] = useState({
    fullName: draft.customer?.fullName ?? '',
    email: draft.customer?.email ?? '',
    phone: draft.customer?.phone ?? '',
    deliveryType: draft.delivery?.type ?? 'pickup',
    address: draft.delivery?.address ?? '',
    city: draft.delivery?.city ?? '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirmAction, setConfirmAction] = useState<
    | { type: 'remove'; bookId: string; title: string }
    | { type: 'cancel' }
    | null
  >(null);

  const items = draft.items ?? [];
  const isEmpty = items.length === 0;

  useEffect(() => {
    if (selectedBranch) {
      setSelectedBranchId(selectedBranch.id);
    }
  }, [selectedBranch, setSelectedBranchId]);

  if (receipt) return null;

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!form.fullName.trim()) newErrors.fullName = 'Nombre requerido.';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = 'Email inválido.';
    if (!form.phone.trim()) newErrors.phone = 'Teléfono requerido.';
    if (isEmpty) newErrors.items = 'Agrega al menos un libro antes de confirmar.';
    if (form.deliveryType === 'home_delivery') {
      if (!form.address.trim()) newErrors.address = 'Dirección requerida.';
      if (!form.city.trim()) newErrors.city = 'Ciudad requerida.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRemoveItem = (bookId: string) => {
    const title = booksMap[bookId] ?? bookId;
    setConfirmAction({ type: 'remove', bookId, title });
  };

  const confirmRemoveItem = (bookId: string) => {
    const nextItems = items.filter((item) => item.bookId !== bookId);
    setDraft({ items: nextItems });
    if (nextItems.length === 0) {
      setErrors((prev) => ({ ...prev, items: 'Agrega al menos un libro antes de confirmar.' }));
    }
  };

  const handleCancelOrder = () => {
    setConfirmAction({ type: 'cancel' });
  };

  const confirmCancelOrder = () => {
    reset();
    onCancel?.();
  };

  const handleCustomerChange = (field: string, value: string) => {
    const next = { ...form, [field]: value };
    setForm(next);
    setErrors((prev) => {
      const { [field]: _removed, ...rest } = prev;
      return rest;
    });
    setDraft({
      customer: {
        fullName: next.fullName || undefined,
        email: next.email || undefined,
        phone: next.phone || undefined,
      } as typeof draft.customer,
    });
  };

  const handleDeliveryChange = (field: string, value: string) => {
    const next = { ...form, [field]: value };
    setForm(next);
    setErrors((prev) => {
      const { [field]: _removed, ...rest } = prev;
      return rest;
    });
    setDraft({
      delivery: {
        type: next.deliveryType as 'pickup' | 'home_delivery',
        branchId: selectedBranch?.id ?? '',
        address: next.deliveryType === 'home_delivery' ? next.address : undefined,
        city: next.deliveryType === 'home_delivery' ? next.city : undefined,
      },
    });
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setDraft({
      customer: { fullName: form.fullName, email: form.email, phone: form.phone },
      delivery: {
        type: form.deliveryType as 'pickup' | 'home_delivery',
        branchId: selectedBranch?.id ?? '',
        address: form.deliveryType === 'home_delivery' ? form.address : undefined,
        city: form.deliveryType === 'home_delivery' ? form.city : undefined,
      },
    });

    const ok = await submitOrder();
    if (ok) {
      onOrderPlaced?.();
    }
  };

  return (
    <section className="order-form" aria-labelledby="order-title">
      <header className="order-form__header">
        <div>
          <h2 id="order-title" className="order-form__title">Tu pedido</h2>
          <p className="order-form__subtitle">Confirma los datos para crear tu orden.</p>
        </div>
        <p className="order-form__count">{items.length} libro(s)</p>
      </header>

      {selectedBranch ? (
        <div className="order-form__branch-info">
          <strong>Sucursal:</strong> {selectedBranch.name} — {selectedBranch.city}
        </div>
      ) : (
        <div className="order-form__no-branch" role="status">Selecciona una sucursal antes de continuar.</div>
      )}

      {error && (
        <div className="order-form__submit-error" role="alert">
          No pudimos registrar el pedido. Intenta de nuevo. {error}
        </div>
      )}

      <section className="order-form__section" aria-labelledby="order-summary">
        <h3 id="order-summary">Resumen del pedido</h3>
        {errors.items && <span className="order-form__error">{errors.items}</span>}
        {isEmpty ? (
          <p className="order-form__empty">No hay libros en tu pedido. Agrega libros desde el catálogo.</p>
        ) : (
          <ul className="order-form__items-list">
            {items.map((item) => (
              <li key={item.bookId} className="order-form__item">
                <span className="order-form__item-title">{booksMap[item.bookId] ?? item.bookId}</span>
                <span className="order-form__item-qty">× {item.quantity}</span>
                <button
                  className="order-form__item-remove"
                  type="button"
                  onClick={() => handleRemoveItem(item.bookId)}
                >
                  Quitar libro
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="order-form__section" aria-labelledby="order-customer">
        <h3 id="order-customer">Datos del cliente</h3>
        <label className="order-form__field">
          Nombre completo
          <input
            type="text"
            value={form.fullName}
            onChange={(e) => handleCustomerChange('fullName', e.target.value)}
            placeholder="Ej. Juan Pérez"
            autoComplete="name"
          />
          {errors.fullName && <span className="order-form__error">{errors.fullName}</span>}
        </label>
        <label className="order-form__field">
          Correo electrónico
          <input
            type="email"
            value={form.email}
            onChange={(e) => handleCustomerChange('email', e.target.value)}
            placeholder="Ej. juan@example.com"
            autoComplete="email"
          />
          {errors.email && <span className="order-form__error">{errors.email}</span>}
        </label>
        <label className="order-form__field">
          Teléfono
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => handleCustomerChange('phone', e.target.value)}
            placeholder="Ej. 3001234567"
            autoComplete="tel"
          />
          {errors.phone && <span className="order-form__error">{errors.phone}</span>}
        </label>
      </section>

      <section className="order-form__section" aria-labelledby="order-delivery">
        <h3 id="order-delivery">Tipo de entrega</h3>
        <div className="order-form__delivery-options">
          <label className="order-form__radio">
            <input
              type="radio"
              name="deliveryType"
              value="pickup"
              checked={form.deliveryType === 'pickup'}
              onChange={() => handleDeliveryChange('deliveryType', 'pickup')}
            />
            <span>Retiro en sucursal (sin costo adicional)</span>
          </label>
          <label className="order-form__radio">
            <input
              type="radio"
              name="deliveryType"
              value="home_delivery"
              checked={form.deliveryType === 'home_delivery'}
              onChange={() => handleDeliveryChange('deliveryType', 'home_delivery')}
            />
            <span>Domicilio (COP 8.000)</span>
          </label>
        </div>

        {form.deliveryType === 'home_delivery' && (
          <div className="order-form__address">
            <label className="order-form__field">
              Dirección
              <input
                type="text"
                value={form.address}
                onChange={(e) => handleDeliveryChange('address', e.target.value)}
                placeholder="Ej. Calle 10 # 5-20"
                autoComplete="street-address"
              />
              {errors.address && <span className="order-form__error">{errors.address}</span>}
            </label>
            <label className="order-form__field">
              Ciudad
              <input
                type="text"
                value={form.city}
                onChange={(e) => handleDeliveryChange('city', e.target.value)}
                placeholder="Ej. Pereira"
                autoComplete="address-level2"
              />
              {errors.city && <span className="order-form__error">{errors.city}</span>}
            </label>
          </div>
        )}
      </section>

      <div className="order-form__actions">
        <button
          className="order-form__cancel-btn"
          type="button"
          onClick={handleCancelOrder}
        >
          Cancelar pedido
        </button>
        <button
          className="order-form__submit-btn"
          onClick={handleSubmit}
          disabled={isEmpty || !selectedBranch || isLoading}
          type="button"
        >
          {isLoading ? 'Confirmando pedido...' : 'Confirmar pedido'}
        </button>
      </div>

      {confirmAction && (
        <div className="order-form__modal" role="dialog" aria-modal="true">
          <div className="order-form__modal-card">
            <h3 className="order-form__modal-title">
              {confirmAction.type === 'cancel'
                ? 'Cancelar pedido'
                : 'Quitar libro del pedido'}
            </h3>
            <p className="order-form__modal-text">
              {confirmAction.type === 'cancel'
                ? 'Vas a cancelar el pedido en progreso. Se perdera la informacion ingresada.'
                : `Vas a quitar "${confirmAction.title}" del pedido. Esta accion no se puede deshacer.`}
            </p>
            <div className="order-form__modal-actions">
              <button
                className="order-form__modal-btn order-form__modal-btn--ghost"
                type="button"
                onClick={() => setConfirmAction(null)}
              >
                Volver
              </button>
              <button
                className="order-form__modal-btn"
                type="button"
                onClick={() => {
                  if (confirmAction.type === 'cancel') {
                    confirmCancelOrder();
                  } else {
                    confirmRemoveItem(confirmAction.bookId);
                  }
                  setConfirmAction(null);
                }}
              >
                Confirmar accion
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};