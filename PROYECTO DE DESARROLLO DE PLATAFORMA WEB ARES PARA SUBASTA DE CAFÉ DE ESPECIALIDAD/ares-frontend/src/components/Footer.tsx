import { Link } from 'react-router'

function Footer() {
  return (
    <footer className="bg-cafe-profundo text-crema mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="font-display text-xl mb-3">ARES</h3>
          <p className="text-sm text-crema/70">
            Conectamos productores de café de especialidad ecuatoriano con compradores nacionales e internacionales.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-dorado mb-3">Explorar</h4>
          <ul className="space-y-2 text-sm text-crema/70">
            <li><Link to="/cafes" className="hover:text-crema">Cafés</Link></li>
            <li><Link to="/productores" className="hover:text-crema">Productores</Link></li>
            <li><Link to="/concursos" className="hover:text-crema">Concursos</Link></li>
            <li><Link to="/subastas" className="hover:text-crema">Subastas</Link></li>
            <li><Link to="/suscripcion" className="hover:text-crema">Planes y suscripción</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-dorado mb-3">Empresa</h4>
          <ul className="space-y-2 text-sm text-crema/70">
            <li><Link to="/sobre-ares" className="hover:text-crema">Sobre ARES</Link></li>
            <li><Link to="/login" className="hover:text-crema">Iniciar sesión</Link></li>
            <li><Link to="/registro" className="hover:text-crema">Registrarse</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-dorado mb-3">Contacto</h4>
          <ul className="space-y-2 text-sm text-crema/70">
            <li>Loja, Ecuador</li>
            <li>contacto@ares-cafe.com</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-crema/10 py-4 text-center text-xs text-crema/50">
        © 2026 ARES. Café de especialidad ecuatoriano.
      </div>
    </footer>
  )
}

export default Footer