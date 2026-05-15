import { describe, it, expect } from 'vitest'

function exportCSV(data, filename) {
  if (!data.length) return null
  const keys = Object.keys(data[0])
  const csv = [keys.join(','), ...data.map(r => keys.map(k => JSON.stringify(r[k] ?? '')).join(','))].join('\n')
  return csv
}

function filtrarProductos(rows, search) {
  const q = search.toLowerCase()
  return rows.filter(p =>
    p.nombre.toLowerCase().includes(q) ||
    p.categoria.toLowerCase().includes(q)
  )
}

describe('exportCSV', () => {
  it('genera CSV con cabeceras y filas correctas', () => {
    const data = [{ nombre: 'Laptop', precio: 5000 }]
    const csv = exportCSV(data, 'test.csv')
    expect(csv).toContain('nombre,precio')
    expect(csv).toContain('"Laptop"')
  })

  it('retorna null si no hay datos', () => {
    const result = exportCSV([], 'test.csv')
    expect(result).toBeNull()
  })
})

describe('filtrarProductos', () => {
  const productos = [
    { nombre: 'Laptop Dell', categoria: 'Computadoras' },
    { nombre: 'Mouse Logitech', categoria: 'Periféricos' },
    { nombre: 'Teclado Mecánico', categoria: 'Periféricos' },
  ]

  it('filtra por nombre de producto', () => {
    const resultado = filtrarProductos(productos, 'laptop')
    expect(resultado).toHaveLength(1)
    expect(resultado[0].nombre).toBe('Laptop Dell')
  })

  it('filtra por categoría', () => {
    const resultado = filtrarProductos(productos, 'periféricos')
    expect(resultado).toHaveLength(2)
  })

  it('retorna todos los productos con búsqueda vacía', () => {
    const resultado = filtrarProductos(productos, '')
    expect(resultado).toHaveLength(3)
  })
})
