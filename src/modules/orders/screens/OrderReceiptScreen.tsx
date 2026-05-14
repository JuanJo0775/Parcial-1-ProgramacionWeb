import { useCreateOrder } from '../hooks/useCreateOrder';
import { useOrdersStore } from '../../orders/store';
import './OrderReceiptScreen.css';

interface OrderReceiptScreenProps {
  onNewOrder?: () => void;
}

export const OrderReceiptScreen = ({ onNewOrder }: OrderReceiptScreenProps) => {
  const { receipt } = useCreateOrder();
  const { reset } = useOrdersStore();

  if (!receipt) return null;

  const handleNewOrder = () => {
    reset();
    onNewOrder?.();
  };

  const deliveryLabel =
    receipt.delivery.type === 'pickup'
      ? 'Retiro en sucursal'
      : `Domicilio a ${receipt.delivery.city}`;

  return (
    <section className="receipt" aria-labelledby="receipt-title">
      <article className="receipt__card">
        <header className="receipt__header">
          <div>
            <h2 id="receipt-title" className="receipt__title">Pedido confirmado</h2>
            <p className="receipt__subtitle">Tu orden quedo registrada correctamente.</p>
          </div>
          <p className="receipt__order-id">{receipt.orderId}</p>
        </header>

        <section className="receipt__section" aria-labelledby="receipt-customer">
          <h3 id="receipt-customer">Datos del cliente</h3>
          <p><strong>Nombre:</strong> {receipt.customer.fullName}</p>
          <p><strong>Email:</strong> {receipt.customer.email}</p>
          <p><strong>Telefono:</strong> {receipt.customer.phone}</p>
        </section>

        <section className="receipt__section" aria-labelledby="receipt-items">
          <h3 id="receipt-items">Libros pedidos</h3>
          <ul className="receipt__items">
            {receipt.items.map((item) => (
              <li key={item.bookId} className="receipt__item">
                <span className="receipt__item-title">{item.title}</span>
                <span className="receipt__item-qty">x{item.quantity}</span>
                <span className="receipt__item-price">
                  ${item.subtotal.toLocaleString('es-CO')} COP
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="receipt__section" aria-labelledby="receipt-delivery">
          <h3 id="receipt-delivery">Forma de entrega</h3>
          <p>{deliveryLabel}</p>
          {receipt.delivery.type === 'home_delivery' && receipt.delivery.address && (
            <p>{receipt.delivery.address}, {receipt.delivery.city}</p>
          )}
        </section>

        <section className="receipt__totals" aria-label="Totales del pedido">
          <div className="receipt__total-row">
            <span>Subtotal</span>
            <span>${receipt.totals.subtotal.toLocaleString('es-CO')} COP</span>
          </div>
          {receipt.totals.deliveryFee > 0 && (
            <div className="receipt__total-row">
              <span>Costo de domicilio</span>
              <span>${receipt.totals.deliveryFee.toLocaleString('es-CO')} COP</span>
            </div>
          )}
          <div className="receipt__total-row receipt__total-row--grand">
            <span>Total a pagar</span>
            <span>${receipt.totals.total.toLocaleString('es-CO')} COP</span>
          </div>
          <p className="receipt__payment">
            Pago: {receipt.paymentMethod === 'cash_on_delivery' ? 'Contra entrega' : receipt.paymentMethod}
          </p>
        </section>

        <p className="receipt__instructions">{receipt.instructions}</p>

        <button className="receipt__new-btn" type="button" onClick={handleNewOrder}>
          Hacer un nuevo pedido
        </button>
      </article>
    </section>
  );
};