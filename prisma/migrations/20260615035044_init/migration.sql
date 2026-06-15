-- CreateTable
CREATE TABLE "Propiedad" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "operacion" TEXT NOT NULL,
    "precio" DOUBLE PRECISION NOT NULL,
    "moneda" TEXT NOT NULL DEFAULT 'UF',
    "comuna" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "habitaciones" INTEGER NOT NULL DEFAULT 0,
    "banos" INTEGER NOT NULL DEFAULT 0,
    "superficie" DOUBLE PRECISION NOT NULL,
    "imagenes" TEXT[],
    "destacado" BOOLEAN NOT NULL DEFAULT false,
    "disponible" BOOLEAN NOT NULL DEFAULT true,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Propiedad_pkey" PRIMARY KEY ("id")
);
