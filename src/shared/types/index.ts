import { Control, FieldPath, FieldValue, FieldValues } from 'react-hook-form'

export type Entries<T> = {
  [K in keyof T]: [K, T[K]]
}[keyof T][]

export type ValueOf<T> = T[keyof T]