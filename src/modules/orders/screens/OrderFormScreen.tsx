import { useState } from 'react';
import { useCreateOrder } from '../hooks/useCreateOrder';
import { useProductsStore } from '../../products/store';
import type { Branch } from '../../../shared/types';
import './OrderFormScreen.css';

interface OrderFormScreenProps {
  selectedBranch: Branch | null;
  onOrderPlaced?: () => void;
}

export const OrderFormScreen = ({ selectedBranch, onOrderPlaced }: OrderFormScreenProps) => {
  const { draft, setDraft, setSelectedBranchId, submitOrder, receipt } = useCreateOrder();
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

  const items = draft.items ?? [];
  const isEmpty = items.length === 0;

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

  const handleCustomerChange = (field: string, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    setDraft({
      customer: {
        fullName: form.fullName || undefined,
        email: form.email || undefined,
        phone: form.phone || undefined,
        [field]: value,
      } as typeof draft.customer,
    });
  };

  const handleDeliveryChange = (field: string, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    if (selectedBranch) {
      setSelectedBranchId(selectedBranch.id);
    }

    setDraft({
      customer: { fullName: form.fullName, email: form.email, phone: form.phone },
      delivery: {
        type: form.deliveryType as 'pickup' | 'home_delivery',
        branchId: selectedBranch?.id ?? '',
        address: form.deliveryType === 'home_delivery' ? form.address : undefined,
        city: form.deliveryType === 'home_delivery' ? form.city : undefined,
      },
    });

    await submitOrder();
    onOrderPlaced?.();
  };

  return (
    <div className="order-form">
      <h2 className="order-form__title">Tu Pedido</h2>

      {selectedBranch ? (
        <div className="order-form__branch-info">
          <strong>Sucursal:</strong> {selectedBranch.name} — {selectedBranch.city}
        </div>
      ) : (
        <div className="order-form__no-branch">Selecciona una sucursal antes de continuar.</div>
      )}

      <section className="order-form__section">
        <h3>Resumen del pedido</h3>
        {errors.items && <span className="order-form__error">{errors.items}</span>}
        {isEmpty ? (
          <p className="order-form__empty">No hay libros en tu pedido. Agrega libros desde el catálogo.</p>
        ) : (
          <ul className="order-form__items-list">
            {items.map((item) => (
              <li key={item.bookId} className="order-form__item">
                <span className="order-form__item-title">{booksMap[item.bookId] ?? item.bookId}</span>
                <span className="order-form__item-qty">× {item.quantity}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="order-form__section">
        <h3>Datos del cliente</h3>
        <label className="order-form__field">
          Nombre completo
          <input
            type="text"
            value={form.fullName}
            onChange={(e) => handleCustomerChange('fullName', e.target.value)}
            placeholder="Ej. Juan Pérez"
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
          />
          {errors.phone && <span className="order-form__error">{errors.phone}</span>}
        </label>
      </section>

      <section className="order-form__section">
        <h3>Tipo de entrega</h3>
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
              />
              {errors.city && <span className="order-form__error">{errors.city}</span>}
            </label>
          </div>
        )}
      </section>

      <button
        className="order-form__submit-btn"
        onClick={handleSubmit}
        disabled={isEmpty || !selectedBranch}
      >
        Confirmar Pedido
      </button>
    </div>
  );
};