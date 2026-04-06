import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAdminStores, adminConfirmPayment } from '../api';

function formatDate(timestamp) {
  return timestamp ? new Date(timestamp).toLocaleDateString() : '–';
}

export default function AdminDashboard() {
  const [stores, setStores] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  useEffect(() => {
    if (!token || userRole !== 'admin') {
      navigate('/login');
      return;
    }

    getAdminStores(token)
      .then((response) => {
        setStores(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.error || 'Failed to load stores');
        setLoading(false);
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('userRole');
          navigate('/login');
        }
      });
  }, [token, userRole, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    window.dispatchEvent(new Event('authChange'));
    navigate('/login');
  };

  const handleConfirmPayment = async (storeId) => {
    setError('');
    setMessage('');
    try {
      await adminConfirmPayment(token, storeId);
      setMessage('Payment confirmed for store ' + storeId);
      const response = await getAdminStores(token);
      setStores(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to confirm payment');
    }
  };

  return (
    <section className="card">
      <div className="dashboard-header">
        <h2>Admin Dashboard</h2>
        <button className="secondary" onClick={handleLogout}>Logout</button>
      </div>

      {error && <p className="error">{error}</p>}
      {message && <p className="success">{message}</p>}
      {loading && !error && <p>Loading registered stores...</p>}
      {!loading && !stores.length && !error && <p>No stores registered yet.</p>}

      <div className="store-grid">
        {stores.map((store) => (
          <div key={store.id} className="store-card">
            <h3>{store.storeName}</h3>
            <p><strong>Owner:</strong> {store.ownerName}</p>
            <p><strong>Email:</strong> {store.ownerEmail}</p>
            <p><strong>Status:</strong> {store.status}</p>
            <p><strong>Payment Status:</strong> {store.paymentStatus}</p>
            <p><strong>Free ends:</strong> {formatDate(store.freePeriodEndsAt)}</p>
            <p><strong>Next due:</strong> {formatDate(store.paymentDueAt)}</p>
            <p><strong>Description:</strong> {store.description || 'No description'}</p>
            {store.paymentStatus !== 'paid' && (
              <button onClick={() => handleConfirmPayment(store.id)}>
                Confirm Payment
              </button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
