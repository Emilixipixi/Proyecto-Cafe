import { Link } from 'react-router'
import { Coffee, Award, Star, Briefcase, Leaf, Globe, Cpu, ShieldCheck, MapPin } from 'lucide-react'
import { productores } from '../data/producers'
import { cafes } from '../data/coffees'
import { concursos } from '../data/contests'
import { compradores } from '../data/buyers'
import Button from '../components/Button'

const valores = [
  { icono: Coffee, titulo: 'Café de especialidad' },
  { icono: Award, titulo: 'Calidad' },
  { icono: Star, titulo: 'Exclusividad' },
  { icono: Briefcase, titulo: 'Profesionalismo' },
  { icono: Leaf, titulo: 'Naturaleza' },
  { icono: Globe, titulo: 'Comercio internacional' },
  { icono: Cpu, titulo: 'Tecnología' },
  { icono: ShieldCheck, titulo: 'Confianza' },
  { icono: MapPin, titulo: 'Producto ecuatoriano premium' },
]

function SobreAres() {
  return (
    <div>
      <section className="relative h-96 flex items-center">
        <img
          src="https://picsum.photos/seed/ares-sobre-montanas-loja/1600/700"
          alt="Montañas cafetaleras de Loja"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-cafe-profundo/65" />
        <div className="relative max-w-3xl mx-auto text-center px-6">
          <h1 className="font-display text-4xl font-bold text-crema mb-4">Sobre ARES</h1>
          <p className="text-lg text-crema/85">
            Una plataforma tecnológica para el café de especialidad ecuatoriano, nacida en Loja.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-16 text-center">
        <h2 className="font-display text-2xl text-cafe-profundo mb-4">Quiénes somos</h2>
        <p className="text-gris-oscuro/80 leading-relaxed mb-4">
          ARES conecta productores de café de especialidad de la provincia de Loja con compradores
          nacionales e internacionales que buscan cafés extraordinarios. Nacimos junto a procesos de
          selección y concursos como la <strong>Taza Dorada</strong> y el concurso de la Prefectura de Loja,
          con el objetivo de dar visibilidad internacional a los mejores lotes de la región.
        </p>
        <p className="text-gris-oscuro/80 leading-relaxed">
          A través de nuestra plataforma, los cafés seleccionados en estos concursos pueden presentarse
          con su historia completa y, más adelante, ofrecerse en subastas virtuales en vivo — acercando
          directamente al productor con quien finalmente disfruta la taza.
        </p>
      </section>

      <section className="bg-beige-cafe/20 py-16">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="font-display text-2xl text-cafe-profundo text-center mb-10">Lo que nos define</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
            {valores.map((valor) => {
              const Icono = valor.icono
              return (
                <div key={valor.titulo} className="bg-white rounded-xl p-5 text-center border border-beige-cafe/40">
                  <Icono size={26} className="text-verde-bosque mx-auto mb-2" />
                  <p className="text-sm font-medium text-cafe-profundo">{valor.titulo}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          <div>
            <p className="font-display text-4xl font-bold text-dorado">{productores.length}</p>
            <p className="text-sm text-gris-oscuro/60 mt-1">Productores</p>
          </div>
          <div>
            <p className="font-display text-4xl font-bold text-dorado">{cafes.length}</p>
            <p className="text-sm text-gris-oscuro/60 mt-1">Cafés catalogados</p>
          </div>
          <div>
            <p className="font-display text-4xl font-bold text-dorado">{concursos.length}</p>
            <p className="text-sm text-gris-oscuro/60 mt-1">Concursos aliados</p>
          </div>
          <div>
            <p className="font-display text-4xl font-bold text-dorado">{compradores.length}+</p>
            <p className="text-sm text-gris-oscuro/60 mt-1">Compradores registrados</p>
          </div>
        </div>
      </section>

      <section className="bg-verde-bosque py-16">
        <div className="max-w-2xl mx-auto text-center px-6">
          <h2 className="font-display text-2xl text-crema mb-6">Conocé el catálogo de cafés de Loja</h2>
          <Link to="/cafes">
            <Button variant="secondary" className="px-8 py-3">Explorar cafés</Button>
          </Link>
        </div>
      </section>
    </div>
  )
}

export default SobreAres