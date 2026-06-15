"use client";

import React, { useState, useEffect } from 'react';
import { SignInButton, UserButton, useUser  } from '@clerk/nextjs';

interface Propiedad {
  id: string;
  titulo: string;
  descripcion: string;
  tipo: string;
  operacion: string;
  precio: number;
  moneda: string;
  comuna: string;
  habitaciones: number;
  banos: number;
  superficie: number;
  imagenes: string[];
}

export default function Home() {
  const [propiedades, setPropiedades] = useState<Propiedad[]>([]);
  
  // Usamos el hook oficial de Clerk para saber si el usuario está logueado
  const { isSignedIn } = useUser();
  const esAdmin = !!isSignedIn;

  const [busqueda, setBusqueda] = useState('');
  const [filtroOperacion, setFiltroOperacion] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroDormitorios, setFiltroDormitorios] = useState('');
  
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [propiedadSeleccionada, setPropiedadSeleccionada] = useState<Propiedad | null>(null);
  const [idPropiedadAEditar, setIdPropiedadAEditar] = useState<string | null>(null);

  const [nuevaPropiedad, setNuevaPropiedad] = useState({
    titulo: '', descripcion: '', tipo: 'Casa', operacion: 'Venta', precio: '', moneda: 'UF', comuna: '', habitaciones: '0', banos: '0', superficie: '', imagenes: [] as string[]
  });

  const [indiceFotoActual, setIndiceFotoActual] = useState(0);

  useEffect(() => {
    const cargarPropiedades = async () => {
      try {
        const respuesta = await fetch('/api/propiedades');
        if (respuesta.ok) {
          const datos = await respuesta.json();
          setPropiedades(datos);
        }
      } catch (error) {
        console.error("Error al cargar la base de datos:", error);
      }
    };
    cargarPropiedades();
  }, []);

  const manejarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const respuesta = await fetch('/api/propiedades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo: nuevaPropiedad.titulo,
          descripcion: nuevaPropiedad.descripcion,
          tipo: nuevaPropiedad.tipo,
          operacion: nuevaPropiedad.operacion,
          precio: Number(nuevaPropiedad.precio),
          moneda: nuevaPropiedad.moneda,
          comuna: nuevaPropiedad.comuna,
          habitaciones: Number(nuevaPropiedad.habitaciones),
          banos: Number(nuevaPropiedad.banos),
          superficie: Number(nuevaPropiedad.superficie),
          imagenes: nuevaPropiedad.imagenes.length > 0 ? nuevaPropiedad.imagenes : ['https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800']
        })
      });

      if (respuesta.ok) {
        const propiedadGuardada = await respuesta.json();
        setPropiedades([propiedadGuardada, ...propiedades]);
      }
    } catch (error) {
      alert("Error al guardar.");
    }
    setMostrarFormulario(false);
    setNuevaPropiedad({ titulo: '', descripcion: '', tipo: 'Casa', operacion: 'Venta', precio: '', moneda: 'UF', comuna: '', habitaciones: '0', banos: '0', superficie: '', imagenes: [] });
  };

  return (
    <main className="min-h-screen bg-[#f4f6f9] text-gray-800 font-sans">
      <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="/logo.png" alt="Logo" className="w-20 h-20 rounded-full object-cover shadow-md" />
            <div>
              <h1 className="text-2xl font-black text-[#0f112b]">Pam Arriendos</h1>
              <span className="text-xs text-gray-500 font-bold uppercase tracking-widest">Corredora de Propiedades</span>
            </div>
          </div>

          <div className="flex items-center">
            {!isSignedIn ? (
              <div className="bg-[#0f112b] text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-[#1a1c3d]">
                <SignInButton mode="modal">Iniciar Sesión</SignInButton>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <span className="text-xs text-[#f04f53] font-bold bg-red-50 px-2 py-1 rounded-md">ADMIN</span>
                <UserButton  />
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-10 flex flex-col lg:flex-row gap-8">
        <aside className="w-full lg:w-1/4">
          {esAdmin && (
            <button 
              onClick={() => setMostrarFormulario(true)}
              className="w-full bg-[#0f112b] text-white py-3 rounded-xl font-bold mb-6 hover:bg-[#1a1c3d]"
            >
              + Agregar Propiedad
            </button>
          )}
          
          <input 
            type="text" 
            placeholder="Buscar comuna..." 
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full p-3 border rounded-xl bg-gray-50"
          />
        </aside>

        <section className="w-full lg:w-3/4">
          <div className="grid gap-6">
            {propiedades.filter(p => p.titulo.toLowerCase().includes(busqueda.toLowerCase())).map((p) => (
              <div key={p.id} className="bg-white p-6 rounded-3xl shadow-sm border flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3 h-48 bg-cover bg-center rounded-2xl" style={{ backgroundImage: `url(${p.imagenes[0]})` }} />
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-[#0f112b]">{p.titulo}</h3>
                  <p className="text-2xl font-black mt-2 text-[#0f112b]">{p.moneda === 'UF' ? 'UF ' : '$ '}{p.precio.toLocaleString('es-CL')}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {mostrarFormulario && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-8 rounded-3xl w-full max-w-lg">
            <h2 className="text-2xl font-bold mb-4">Nueva Propiedad</h2>
            <form onSubmit={manejarSubmit} className="flex flex-col gap-4">
              <input required type="text" placeholder="Título" className="p-3 border rounded-xl" onChange={e => setNuevaPropiedad({...nuevaPropiedad, titulo: e.target.value})} />
              <input required type="number" placeholder="Precio" className="p-3 border rounded-xl" onChange={e => setNuevaPropiedad({...nuevaPropiedad, precio: e.target.value})} />
              <button type="submit" className="bg-[#0f112b] text-white py-3 rounded-xl font-bold">Publicar</button>
              <button type="button" onClick={() => setMostrarFormulario(false)} className="text-gray-500 text-sm">Cancelar</button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}