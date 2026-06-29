export interface FeeCategoryRecord {
  id: string
  value: string
  label: string
  description: string | null
  amount: number | null
  sortOrder: number
  isActive: boolean
}
