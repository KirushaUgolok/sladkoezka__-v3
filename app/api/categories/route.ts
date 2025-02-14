import { NextResponse } from 'next/server'
import { getCategories, addCategory, updateCategory, deleteCategory } from '../../../lib/db'

export async function GET() {
  const categories = await getCategories()
  return NextResponse.json(categories)
}

export async function POST(request: Request) {
  const category = await request.json()
  try {
    const newCategory = await addCategory(category)
    return NextResponse.json(newCategory)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add category' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  const { id, name } = await request.json()
  try {
    await updateCategory(id, name)
    return NextResponse.json({ message: 'Category updated successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const { id } = await request.json()
  try {
    await deleteCategory(id)
    return NextResponse.json({ message: 'Category deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 })
  }
}

