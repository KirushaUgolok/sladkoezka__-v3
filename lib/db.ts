import { supabase } from './supabase'
import { v4 as uuidv4 } from 'uuid';

export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category_id?: string
}

export interface Category {
  id: string
  name: string
}

export interface CartItem {
  id: string
  user_id: string
  product_id: string
  quantity: number
  product: Product
}

export interface Order {
  id: string
  user_id: string
  total_amount: number
  status: 'pending' | 'ready' | 'completed' | 'cancelled'
  created_at: string
  name: string;
  phone: string;
  email: string;
  address: string;
  additional_info: string;
  admin_comment?: string; // Добавьте это новое поле
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  quantity: number
  price: number
}

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
  
  if (error) {
    console.error('Error fetching products:', error)
    return []
  }
  
  return data || []
}

export async function addProduct(product: Omit<Product, 'id'>): Promise<void> {
  const { error } = await supabase
    .from('products')
    .insert([product])
  
  if (error) {
    console.error('Error adding product:', error)
    throw error
  }
}

export async function updateProduct(id: string, updatedProduct: Partial<Product>): Promise<void> {
  const { category_id, ...otherFields } = updatedProduct;
  const updateData: Partial<Product> = { ...otherFields };
  
  if (category_id) {
    updateData.category_id = category_id;
  }

  const { error } = await supabase
    .from('products')
    .update(updateData)
    .eq('id', id)
  
  if (error) {
    console.error('Error updating product:', error)
    throw error
  }
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)
  
  if (error) {
    console.error('Error deleting product:', error)
    throw error
  }
}

export async function getCartItems(userId: string): Promise<CartItem[]> {
  const { data, error } = await supabase
    .from('cart_items')
    .select('*, product:products(*)')
    .eq('user_id', userId)
  
  if (error) {
    console.error('Error fetching cart items:', error)
    return []
  }
  
  return data || []
}

export async function addToCart(userId: string, productId: string, quantity: number): Promise<void> {
  const { error } = await supabase
    .from('cart_items')
    .insert([{ user_id: userId, product_id: productId, quantity }])
  
  if (error) {
    console.error('Error adding item to cart:', error)
    throw error
  }
}

export async function updateCartItem(id: string, quantity: number): Promise<void> {
  const { error } = await supabase
    .from('cart_items')
    .update({ quantity })
    .eq('id', id)
  
  if (error) {
    console.error('Error updating cart item:', error)
    throw error
  }
}

export async function removeFromCart(id: string): Promise<void> {
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('id', id)
  
  if (error) {
    console.error('Error removing item from cart:', error)
    throw error
  }
}

export async function createOrder(userId: string, totalAmount: number, items: CartItem[], formData: any): Promise<string> {
  // Clean the phone number by removing non-digit characters
  const cleanedPhone = formData.phone.replace(/\D/g, '').slice(0, 11)

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert([{ 
      user_id: userId, 
      total_amount: totalAmount, 
      status: 'pending',
      name: formData.name,
      phone: cleanedPhone, // Use the cleaned phone number
      email: formData.email,
      address: formData.address,
      additional_info: formData.additionalInfo
    }])
    .select()

  if (orderError) {
    console.error('Error creating order:', orderError)
    throw orderError
  }

  const orderId = order[0].id

  const orderItems = items.map(item => ({
    order_id: orderId,
    product_id: item.product_id,
    quantity: item.quantity,
    price: item.product.price
  }))

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems)

  if (itemsError) {
    console.error('Error adding order items:', itemsError)
    throw itemsError
  }

  // Удаление товаров из корзины после создания заказа
  const { error: clearCartError } = await supabase
    .from('cart_items')
    .delete()
    .eq('user_id', userId)

  if (clearCartError) {
    console.error('Error clearing cart:', clearCartError)
    throw clearCartError
  }

  return orderId
}

export async function getOrders(userId?: string): Promise<Order[]> {
  let query = supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })

  if (userId) {
    query = query.eq('user_id', userId)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching orders:', error)
    return []
  }

  return data || []
}

export async function getOrderItems(orderId: string): Promise<OrderItem[]> {
  const { data, error } = await supabase
    .from('order_items')
    .select('*, product:products(*)')
    .eq('order_id', orderId)
  
  if (error) {
    console.error('Error fetching order items:', error)
    return []
  }
  
  return data || []
}

export async function updateOrderStatus(orderId: string, status: Order['status'], adminComment?: string): Promise<void> {
  const updateData: { status: Order['status'], admin_comment?: string } = { status };
  if (adminComment !== undefined) {
    updateData.admin_comment = adminComment;
  }

  const { error } = await supabase
    .from('orders')
    .update(updateData)
    .eq('id', orderId)

  if (error) {
    console.error('Error updating order status:', error)
    throw error
  }
}

export async function addOrderComment(orderId: string, comment: string): Promise<void> {
  const { error } = await supabase
    .from('orders')
    .update({ admin_comment: comment })
    .eq('id', orderId)

  if (error) {
    console.error('Error adding order comment:', error)
    throw error
  }
}

export async function cancelOrder(orderId: string): Promise<void> {
  const { error } = await supabase
    .from('orders')
    .update({ status: 'cancelled' })
    .eq('id', orderId)
  
  if (error) {
    console.error('Error cancelling order:', error)
    throw error
  }
}

export async function deleteOrder(orderId: string): Promise<void> {
  // Сначала удаляем связанные элементы заказа
  const { error: itemsError } = await supabase
    .from('order_items')
    .delete()
    .eq('order_id', orderId)

  if (itemsError) {
    console.error('Error deleting order items:', itemsError)
    throw itemsError
  }

  // Затем удаляем сам заказ
  const { error: orderError } = await supabase
    .from('orders')
    .delete()
    .eq('id', orderId)

  if (orderError) {
    console.error('Error deleting order:', orderError)
    throw orderError
  }
}

export function generateDemoUserId(): string {
  return uuidv4();
}

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
  
  if (error) {
    console.error('Error fetching categories:', error)
    return []
  }
  
  return data || []
}

export async function addCategory(category: Omit<Category, 'id'>): Promise<Category | null> {
  const { data, error } = await supabase
    .from('categories')
    .insert([category])
    .select()
  
  if (error) {
    console.error('Error adding category:', error)
    return null
  }
  
  return data?.[0] || null
}

export async function updateCategory(id: string, name: string): Promise<void> {
  const { error } = await supabase
    .from('categories')
    .update({ name })
    .eq('id', id)
  
  if (error) {
    console.error('Error updating category:', error)
    throw error
  }
}

export async function deleteCategory(id: string): Promise<void> {
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id)
  
  if (error) {
    console.error('Error deleting category:', error)
    throw error
  }
}

export async function searchOrderByPhone(phone: string): Promise<Order | null> {
  // Clean the input phone number
  const cleanedPhone = phone.replace(/\D/g, '')

  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        id,
        quantity,
        price,
        product:products (
          id,
          name
        )
      )
    `)
    .eq('phone', cleanedPhone)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()
  
  if (error) {
    console.error('Error searching order by phone:', error)
    return null
  }
  
  return data
}

