import { useState } from 'react';
import { useContact } from '../hooks/useContact';
import './ContactScreen.css';

export const ContactScreen = () => {
  const { isLoading, error, confirmation, send } = useContact();
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    subject: '',
    message: '',
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((e) => ({ ...e, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (!form.fullName.trim()) errors.fullName = 'Nombre requerido.';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errors.email = 'Email inválido.';
    if (!form.subject.trim()) errors.subject = 'Asunto requerido.';
    if (form.message.trim().length < 10) errors.message = 'Mínimo 10 caracteres.';

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    await send({ fullName: form.fullName, email: form.email, subject: form.subject, message: form.message });
  };

  const handleReset = () => {
    setForm({ fullName: '', email: '', subject: '', message: '' });
    setFieldErrors({});
  };

  if (confirmation) {
    return (
      <section className="contact" aria-labelledby="contact-success-title">
        <div className="contact__success">
          <h2 id="contact-success-title" className="contact__success-title">Mensaje enviado</h2>
          <p className="contact__ticket">
            <strong>Ticket:</strong> {confirmation.ticketId}
          </p>
          <p>{confirmation.message}</p>
          <button className="contact__reset-btn" type="button" onClick={handleReset}>
            Registrar otro mensaje
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="contact" aria-labelledby="contact-title">
      <header className="contact__header">
        <div>
          <h2 id="contact-title" className="contact__title">Contacto</h2>
          <p className="contact__subtitle">
            ¿Tienes preguntas o sugerencias? Escribenos y te responderemos en menos de 24 horas.
          </p>
        </div>
        <p className="contact__meta">Atencion al cliente · Lun–Sab 9:00–19:00</p>
      </header>

      {error && (
        <div className="contact__api-error" role="alert">
          No pudimos enviar el mensaje. Intenta de nuevo. {error}
        </div>
      )}

      <form className="contact__form" onSubmit={handleSubmit} noValidate>
        <label className="contact__field">
          Nombre completo
          <input
            type="text"
            value={form.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
            placeholder="Ej. Juan Pérez"
            autoComplete="name"
          />
          {fieldErrors.fullName && <span className="contact__field-error">{fieldErrors.fullName}</span>}
        </label>

        <label className="contact__field">
          Correo electrónico
          <input
            type="email"
            value={form.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="Ej. juan@example.com"
            autoComplete="email"
          />
          {fieldErrors.email && <span className="contact__field-error">{fieldErrors.email}</span>}
        </label>

        <label className="contact__field">
          Asunto
          <input
            type="text"
            value={form.subject}
            onChange={(e) => handleChange('subject', e.target.value)}
            placeholder="Ej. Consulta sobre disponibilidad"
          />
          {fieldErrors.subject && <span className="contact__field-error">{fieldErrors.subject}</span>}
        </label>

        <label className="contact__field">
          Mensaje
          <textarea
            value={form.message}
            onChange={(e) => handleChange('message', e.target.value)}
            placeholder="Escribe tu mensaje aquí... (mínimo 10 caracteres)"
            rows={5}
          />
          {fieldErrors.message && <span className="contact__field-error">{fieldErrors.message}</span>}
        </label>

        <button type="submit" className="contact__submit-btn" disabled={isLoading}>
          {isLoading ? 'Registrando mensaje...' : 'Registrar mensaje'}
        </button>
      </form>
    </section>
  );
};