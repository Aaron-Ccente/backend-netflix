import { Link } from "react-router-dom"

function NavInLoginAndRegister() {
  return (
    <header className="fixed top-0 h-[90px] w-full bg-black/70 z-50 text-white">
        <nav className="h-full flex items-center justify-between px-28">
          <img width={250} height={60} className="max-h-[60px]" alt="PELISUNCP" src="/PELISUNCP.webp" />
          <div className="flex gap-4 font-bold">
            <Link to='/' className=" text-white border-2 border-white/60 px-6 py-1 rounded hover:text-red-600 hover:border-red-600 hover:bg-white">Iniciar Sesión</Link>
            <Link to='/signup' className="hover:bg-red-800 hover:text-white text-red-600 font-bold px-6 py-1 rounded border-2 hover:border-white border-red-600 ">Crear Cuenta</Link>
          </div>
        </nav>
      </header>
  )
}

export default NavInLoginAndRegister