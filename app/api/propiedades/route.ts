import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';
export const dynamic = 'force-dynamic';

// Esta función LEE las propiedades que están guardadas en la base de datos
export async function GET() {
  try {
    const propiedades = await prisma.propiedad.findMany({
      orderBy: { id: 'desc' } // Muestra las publicaciones más recientes primero
    });
    return NextResponse.json(propiedades);
  } catch (error) {
    return NextResponse.json({ error: 'Error al cargar el catálogo' }, { status: 500 });
  }
}

// Esta función CREA una nueva propiedad en la base de datos
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Le pedimos a Prisma que guarde los datos reales en la tabla
    const nuevaPropiedad = await prisma.propiedad.create({
      data: {
        titulo: body.titulo,
        descripcion: body.descripcion,
        tipo: body.tipo,
        operacion: body.operacion,
        precio: Number(body.precio),
        moneda: body.moneda,
        comuna: body.comuna,
        region: body.region || 'Región Metropolitana',
        habitaciones: Number(body.habitaciones),
        banos: Number(body.banos),
        superficie: Number(body.superficie),
        imagenes: body.imagenes,
      }
    });
    
    return NextResponse.json(nuevaPropiedad);
  } catch (error) {
    return NextResponse.json({ error: 'Error al publicar la propiedad' }, { status: 500 });
  }
}