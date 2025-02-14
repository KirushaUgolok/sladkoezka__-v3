'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Search } from 'lucide-react'
import { searchOrderByPhone, Order } from '../../lib/db'
import { usePhoneInput } from '../../hooks/usePhoneInput'

interface OrderSearchProps {
  className?: string
}

export default function OrderSearch({ className }: OrderSearchProps) {
  const phoneInput = usePhoneInput()
  const [order, setOrder] = useState<Order | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async () => {
    try {
      const cleanedPhone = phoneInput.value.replace(/\D/g, '')
      const result = await searchOrderByPhone(cleanedPhone)
      if (result) {
        setOrder(result)
        setError(null)
      } else {
        setOrder(null)
        setError('Заказ не найден')
      }
    } catch (err) {
      setOrder(null)
      setError('Произошла ошибка при поиске заказа')
    }
  }

  const getStatusInRussian = (status: string) => {
    switch (status) {
      case 'pending': return 'В ожидании'
      case 'ready': return 'Готов к выдаче'
      case 'completed': return 'Выполнен'
      case 'cancelled': return 'Отменен'
      default: return 'Неизвестный статус'
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className={className}>
          <Search className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Поиск заказа</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-amber-50 border-amber-200">
        <DialogHeader>
          <DialogTitle className="text-amber-800">Поиск заказа</DialogTitle>
          <DialogDescription className="text-amber-700">
            Введите номер телефона, указанный при оформлении заказа
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Input
              ref={phoneInput.ref}
              id="phone"
              placeholder="+7 (___) ___-__-__"
              className="col-span-3 border-amber-200 focus:ring-amber-500"
              value={phoneInput.value}
              onChange={phoneInput.onChange}
              minLength={18}
              maxLength={18}
            />
            <Button onClick={handleSearch} className="bg-amber-500 hover:bg-amber-600 text-white">Найти</Button>
          </div>
          {error && <p className="text-red-500">{error}</p>}
          {order && (
            <div className="bg-white p-4 rounded-md border border-amber-200">
              <h3 className="font-bold text-lg mb-2 text-amber-800">Информация о заказе</h3>
              <p><strong>Имя:</strong> {order.name}</p>
              <p><strong>Статус:</strong> {getStatusInRussian(order.status)}</p>
              <p><strong>Сумма заказа:</strong> {order.total_amount} ₽</p>
              <p><strong>Дата заказа:</strong> {new Date(order.created_at).toLocaleString('ru-RU')}</p>
              <p><strong>Адрес доставки:</strong> {order.address}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

