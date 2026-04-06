import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyStore } from '../api';

function formatDate(timestamp) {
  return timestamp ? new Date(timestamp).toLocaleDateString() : '–';
}

export default function Dashboard() {
  const [store, setStore] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) return;
    getMyStore(token)
      .then((response) => setStore(response.data))
      .catch((err) => {
        setError(err.response?.data?.error || 'Failed to load store data');
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      });
  }, [token, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    window.dispatchEvent(new Event('authChange'));
    navigate('/login');
  };

  return (
    <section className="card">
      <div className="dashboard-header">
        <h2>Store Dashboard</h2>
        <button className="secondary" onClick={handleLogout}>Logout</button>
      </div>

      {error && <p className="error">{error}</p>}
      {!store && !error && <p>Loading store data...</p>}

      {store && (
        <div className="store-info">
          <div>
            <strong>Store Name:</strong>
            <p>{store.storeName}</p>
          </div>
          <div>
            <strong>Owner:</strong>
            <p>{store.ownerName}</p>
          </div>
          <div>
            <strong>Email:</strong>
            <p>{store.ownerEmail}</p>
          </div>
          <div>
            <strong>Status:</strong>
            <p>{store.status}</p>
          </div>
          <div>
            <strong>Payment Status:</strong>
            <p>{store.paymentStatus}</p>
          </div>
          <div>
            <strong>First-year free ends:</strong>
            <p>{formatDate(store.freePeriodEndsAt)}</p>
          </div>
          <div>
            <strong>Next payment due:</strong>
            <p>{formatDate(store.paymentDueAt)}</p>
          </div>
          <div>
            <strong>Description:</strong>
            <p>{store.description || 'No description provided.'}</p>
          </div>
        </div>
      )}
    </section>
  );
}
