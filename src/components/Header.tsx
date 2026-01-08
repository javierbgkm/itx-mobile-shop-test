import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/useCart';

const Header = () => {
  const { count } = useCart();
  const location = useLocation();
  const crumbs = [
    { label: 'Inicio', path: '/' },
    ...(location.pathname === '/' ? [] : [{ label: 'Detalle', path: location.pathname }])
  ];

  return (
    <header>
      <div className="header-content">
        <Link className="header-title" to="/">
          ITX Shop
        </Link>
        <nav className="breadcrumbs">
          {crumbs.map((eachCrumb, index) => (
            <span key={eachCrumb.path}>
              {index > 0 && ' / '}
              {index === crumbs.length - 1 ? (
                <span>{eachCrumb.label}</span>
              ) : (
                <Link to={eachCrumb.path}>{eachCrumb.label}</Link>
              )}
            </span>
          ))}
        </nav>
        <div className="cart">
          {/* Esta cantidad no se actualiza más allá de 1 debido a la api como se aclara en el Readme */}
          Carrito {count}
        </div>
      </div>
    </header>
  );
};

export default Header;
