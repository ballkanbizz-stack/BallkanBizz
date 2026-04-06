import { useState } from 'react';
import { Link } from 'react-router-dom';
import { registerStore } from '../api';

export default function RegisterStore() {
  const [form, setForm] = useState({
    ownerName: '',
    email: '',
    password: '',
    storeName: '',
    description: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const response = await registerStore(form);
      setMessage(response.data.message);
      setForm({ ownerName: '', email: '', password: '', storeName: '', description: '' });
    } catch (err) {
      setError(err.response?.data?.error || 'Regjistrimi i dyqanit dështoi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <Link to="/" className="back-home">← Kthehu në Kryefaqe</Link>
          <h1>Regjistro Dyqanin Tënd</h1>
          <p>Krijo dyqanin tënd në BallkanBizz dhe fillo të shesësh</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="ownerName">Emri i Pronarit</label>
            <input
              id="ownerName"
              name="ownerName"
              value={form.ownerName}
              onChange={handleChange}
              placeholder="Shkruaj emrin tënd"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Shkruaj email-in tënd"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Fjalëkalimi</label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Krijo një fjalëkalim të fortë"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="storeName">Emri i Dyqanit</label>
            <input
              id="storeName"
              name="storeName"
              value={form.storeName}
              onChange={handleChange}
              placeholder="Shkruaj emrin e dyqanit"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Përshkrimi</label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Përshkruaj dyqanin dhe produktet që shet"
              rows="4"
            />
          </div>

          {message && <div className="success-message">{message}</div>}
          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Duke regjistruar...' : 'Regjistro Dyqanin'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Keni llogari? <Link to="/login">Kyçuni këtu</Link></p>
          <p className="note">Viti i parë është falas. Pas 12 muajsh, dyqani do të kërkojë një pagesë manuale nga administratori.</p>
        </div>
      </div>
    </div>
  );
}
