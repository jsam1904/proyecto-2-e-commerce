import { describe, it, expect } from 'vitest'

const cartInitialState = { items: [] }

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, qty } = action.payload
      const existing = state.items.find(i => i.id_producto === product.id_producto)
      if (existing) {
        const newQty = existing.cantidad + qty
        return {
          items: state.items.map(i =>
            i.id_producto === product.id_producto
              ? { ...i, cantidad: newQty, subtotal: newQty * parseFloat(product.precio_venta) }
              : i
          ),
        }
      }
      return {
        items: [...state.items, {
          id_producto: product.id_producto,
          nombre: product.nombre,
          precio_unitario: parseFloat(product.precio_venta),
          cantidad: qty,
          subtotal: qty * parseFloat(product.precio_venta),
          stock: product.stock,
        }],
      }
    }
    case 'REMOVE_ITEM':
      return { items: state.items.filter(i => i.id_producto !== action.payload) }
    case 'CLEAR':
      return cartInitialState
    default:
      return state
  }
}

const mockProduct = { id_producto: 1, nombre: 'Laptop', precio_venta: '5000.00', stock: 10 }

describe('cartReducer', () => {
  it('agrega un producto nuevo al carrito', () => {
    const state = cartReducer(cartInitialState, {
      type: 'ADD_ITEM',
      payload: { product: mockProduct, qty: 2 },
    })
    expect(state.items).toHaveLength(1)
    expect(state.items[0].cantidad).toBe(2)
    expect(state.items[0].subtotal).toBe(10000)
  })

  it('acumula cantidad si el producto ya existe', () => {
    const stateWithItem = cartReducer(cartInitialState, {
      type: 'ADD_ITEM',
      payload: { product: mockProduct, qty: 1 },
    })
    const stateUpdated = cartReducer(stateWithItem, {
      type: 'ADD_ITEM',
      payload: { product: mockProduct, qty: 3 },
    })
    expect(stateUpdated.items[0].cantidad).toBe(4)
    expect(stateUpdated.items[0].subtotal).toBe(20000)
  })

  it('elimina un producto del carrito', () => {
    const stateWithItem = cartReducer(cartInitialState, {
      type: 'ADD_ITEM',
      payload: { product: mockProduct, qty: 1 },
    })
    const stateAfterRemove = cartReducer(stateWithItem, {
      type: 'REMOVE_ITEM',
      payload: 1,
    })
    expect(stateAfterRemove.items).toHaveLength(0)
  })

  it('limpia el carrito con CLEAR', () => {
    const stateWithItem = cartReducer(cartInitialState, {
      type: 'ADD_ITEM',
      payload: { product: mockProduct, qty: 2 },
    })
    const stateCleared = cartReducer(stateWithItem, { type: 'CLEAR' })
    expect(stateCleared.items).toHaveLength(0)
  })
})
