import { useState } from 'react';
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

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');

    try {
      const response = await registerStore(form);
      setMessage(response.data.message);
      setForm({ ownerName: '', email: '', password: '', storeName: '', description: '' });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to register store');
    }
  };

  return (
    <section className="card">
      <h2>Register Your Store</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Owner Name
          <input name="ownerName" value={form.ownerName} onChange={handleChange} required />
        </label>
        <label>
          Email
          <input name="email" type="email" value={form.email} onChange={handleChange} required />
        </label>
        <label>
          Password
          <input name="password" type="password" value={form.password} onChange={handleChange} required />
        </label>
        <label>
          Store Name
          <input name="storeName" value={form.storeName} onChange={handleChange} required />
        </label>
        <label>
          Description
          <textarea name="description" value={form.description} onChange={handleChange} />
        </label>
        <button type="submit">Register Store</button>
      </form>
      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}
      <p className="note">Your first year is free. After 12 months, the store will require a manual payment update from admin.</p>
    </section>
  );
}
