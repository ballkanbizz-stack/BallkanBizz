import { useState } from 'react';
import { NavLink } from 'react-router-dom';

function Homepage() {
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { name: 'Elektronikë', icon: '📱' },
    { name: 'Veshje', icon: '👕' },
    { name: 'Shtëpi & Kopsht', icon: '🏠' },
    { name: 'Automjete', icon: '🚗' },
    { name: 'Libra', icon: '📚' },
    { name: 'Sport', icon: '⚽' }
  ];

  const featuredProducts = [
    { id: 1, name: 'iPhone 15 Pro', price: '1200€', image: '📱', category: 'Elektronikë' },
    { id: 2, name: 'Nike Air Max', price: '150€', image: '👟', category: 'Veshje' },
    { id: 3, name: 'MacBook Pro', price: '2500€', image: '💻', category: 'Elektronikë' },
    { id: 4, name: 'Karrige Kopshti', price: '80€', image: '🪑', category: 'Shtëpi & Kopsht' }
  ];

  return (
    <div className="homepage">
      {/* Header */}
      <header className="main-header">
        <div className="header-content">
          <div className="logo">
            <h1>BallkanBizz</h1>
          </div>
          <nav className="main-nav">
            <NavLink to="/">Kryefaqja</NavLink>
            <NavLink to="/products">Produktet</NavLink>
            <NavLink to="/categories">Kategoritë</NavLink>
            <NavLink to="/about">Rreth Nesh</NavLink>
          </nav>
          <div className="auth-buttons">
            <NavLink to="/login" className="btn-login">Kyçu</NavLink>
            <NavLink to="/register" className="btn-register">Regjistrohu</NavLink>
          </div>
        </div>
      </header>

      {/* Hero Section with Search */}
      <section className="hero-section">
        <div className="hero-content">
          <h2>Zbuloni Produktet Më të Mira në Ballkan</h2>
          <p>Gjeni gjithçka që ju nevojitet nga shitësit lokalë</p>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Kërkoni produkte..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="search-btn">🔍 Kërko</button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="categories-section">
        <h3>Kategoritë Kryesore</h3>
        <div className="categories-grid">
          {categories.map((category, index) => (
            <div key={index} className="category-card">
              <span className="category-icon">{category.icon}</span>
              <h4>{category.name}</h4>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-section">
        <h3>Produktet e Zgjedhura</h3>
        <div className="products-slider">
          {featuredProducts.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-image">{product.image}</div>
              <h4>{product.name}</h4>
              <p className="product-price">{product.price}</p>
              <span className="product-category">{product.category}</span>
              <button className="btn-view">Shiko Produktin</button>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="cta-content">
          <h3>Gati për të Filluar?</h3>
          <p>Bli ose shit produkte në platformën tonë</p>
          <div className="cta-buttons">
            <button className="btn-primary">Shiko Produktet</button>
            <button className="btn-secondary">Shit Produktin Tënd</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="main-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>BallkanBizz</h4>
            <p>Platforma më e madhe për tregti elektronike në Ballkan</p>
          </div>
          <div className="footer-section">
            <h4>Lidhjet</h4>
            <ul>
              <li><a href="#">Rreth Nesh</a></li>
              <li><a href="#">Si Funksionon</a></li>
              <li><a href="#">Ndihmë</a></li>
              <li><a href="#">Kontakti</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Legal</h4>
            <ul>
              <li><a href="#">Termat e Shërbimit</a></li>
              <li><a href="#">Politika e Privatësisë</a></li>
              <li><a href="#">Kushtet e Përdorimit</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Na Ndiqni</h4>
            <div className="social-links">
              <a href="#" className="social-link">📘 Facebook</a>
              <a href="#" className="social-link">📷 Instagram</a>
              <a href="#" className="social-link">🐦 Twitter</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 BallkanBizz. Të gjitha të drejtat e rezervuara.</p>
        </div>
      </footer>
    </div>
  );
}

export default Homepage;
