import { Routes, Route } from 'react-router'
import PublicLayout from '../layouts/PublicLayout'
import DashboardLayout from '../layouts/DashboardLayout'
import RutaProtegida from './RutaProtegida'
import Inicio from '../pages/Inicio'
import Cafes from '../pages/Cafes'
import DetalleCafe from '../pages/DetalleCafe'
import Productores from '../pages/Productores'
import DetalleProductor from '../pages/DetalleProductor'
import Concursos from '../pages/Concursos'
import Subastas from '../pages/Subastas'
import DetalleSubasta from '../pages/DetalleSubasta'
import SobreAres from '../pages/SobreAres'
import Login from '../pages/Login'
import Registro from '../pages/Registro'
import Verificacion from '../pages/Verificacion'
import DashboardComprador from '../pages/DashboardComprador'
import DashboardProductor from '../pages/DashboardProductor'
import AdminLayout from '../layouts/AdminLayout'
import DashboardAdmin from '../pages/DashboardAdmin'
import Proximamente from '../pages/Proximamente'
import AdministracionProductores from '../pages/AdministracionProductores'
import AdministracionCafes from '../pages/AdministracionCafes'
import AdministracionSubastas from '../pages/AdministracionSubastas'
import AdministracionMuestras from '../pages/AdministracionMuestras'
import AdministracionCompradores from '../pages/AdministracionCompradores'
import SalaSubasta from '../pages/SalaSubasta'
import Suscripcion from '../pages/Suscripcion'
import AdministracionConcursos from '../pages/AdministracionConcursos'
import AdministracionHistorial from '../pages/AdministracionHistorial'
function AppRouter() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Inicio />} />
        <Route path="/cafes" element={<Cafes />} />
        <Route path="/cafes/:id" element={<DetalleCafe />} />
        <Route path="/productores" element={<Productores />} />
        <Route path="/productores/:id" element={<DetalleProductor />} />
        <Route path="/concursos" element={<Concursos />} />
        <Route path="/subastas" element={<Subastas />} />
        <Route path="/subastas/:id" element={<DetalleSubasta />} />
        <Route path="/sobre-ares" element={<SobreAres />} />
        <Route path="/suscripcion" element={<Suscripcion />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/verificacion" element={<Verificacion />} />
        <Route path="/subastas/:id/sala/:cafeId" element={<SalaSubasta />} />
      </Route>

      <Route element={<RutaProtegida rolPermitido="comprador" />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard/comprador" element={<DashboardComprador />} />
        </Route>
      </Route>

      <Route element={<RutaProtegida rolPermitido="productor" />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard/productor" element={<DashboardProductor />} />
        </Route>
      </Route>


      <Route element={<RutaProtegida rolPermitido="administrador" />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<DashboardAdmin />} />
          <Route path="/admin/suscripciones" element={<Proximamente titulo="Suscripciones" />} />
          <Route path="/admin/pagos" element={<Proximamente titulo="Pagos" />} />
          <Route path="/admin/reportes" element={<Proximamente titulo="Reportes" />} />
          <Route path="/admin/configuracion" element={<Proximamente titulo="Configuración" />} />
          <Route path="/admin/productores" element={<AdministracionProductores />} />
          <Route path="/admin/cafes" element={<AdministracionCafes />} />
          <Route path="/admin/subastas" element={<AdministracionSubastas />} />
          <Route path="/admin/muestras" element={<AdministracionMuestras />} />
          <Route path="/admin/compradores" element={<AdministracionCompradores />} />
          <Route path="/admin/concursos" element={<AdministracionConcursos />} />
          <Route path="/admin/historial" element={<AdministracionHistorial />} />
        </Route>
      </Route>



    </Routes>
  )
}

export default AppRouter