'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { usePhoneInput } from '../../hooks/usePhoneInput'

interface OrderFormData {
  name: string
  phone: string
  email: string
  address: string
  additionalInfo: string
}

interface OrderFormProps {
  onSubmit: (formData: OrderFormData) => void
  onCancel: () => void
}

export default function OrderForm({ onSubmit, onCancel }: OrderFormProps) {
  const [formData, setFormData] = useState<OrderFormData>({
    name: '',
    phone: '',
    email: '',
    address: '',
    additionalInfo: '',
  })

  const phoneInput = usePhoneInput()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    if (name === 'phone') {
      setFormData(prevData => ({ ...prevData, [name]: phoneInput.formattedValue }))
    } else {
      setFormData(prevData => ({ ...prevData, [name]: value }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ ...formData, phone: phoneInput.value })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">ФИО</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="phone">Номер телефона</Label>
        <Input
          ref={phoneInput.ref}
          id="phone"
          name="phone"
          type="tel"
          value={phoneInput.value}
          onChange={(e) => {
            phoneInput.onChange(e);
            handleChange(e);
          }}
          placeholder="+7 (___) ___-__-__"
          required
          minLength={18}
          maxLength={18}
        />
      </div>
      <div>
        <Label htmlFor="email">Электронная почта</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="address">Адрес доставки</Label>
        <Textarea
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="additionalInfo">Дополнительная информация</Label>
        <Textarea
          id="additionalInfo"
          name="additionalInfo"
          value={formData.additionalInfo}
          onChange={handleChange}
        />
      </div>
      <div className="flex justify-between">
        <Button type="submit" className="bg-green-500 hover:bg-green-600">
          Подтвердить заказ
        </Button>
        <Button type="button" onClick={onCancel} variant="outline">
          Отмена
        </Button>
      </div>
    </form>
  )
}

