import { ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

import { Entries } from 'shared/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function keysFromObject<T extends object>(object: T): (keyof T)[] {
  return Object.keys(object) as (keyof T)[]
}

export function entriesFromObject<T extends object>(object: T): Entries<T> {
  return Object.entries(object) as Entries<T>
}

export function valuesFromObject<T extends object>(object: T): T[keyof T][] {
  return Object.values(object) as T[keyof T][]
}
export const generateArray = (length: number) =>
  Array.from({ length }, (_, i) => i)

export const getSearchValue = (key: string) =>
  new URLSearchParams(window.location.search).get(key) || undefined

export const numberFormat = (number: string | number | undefined | null) => {
  if (!number) return 0
  return new Intl.NumberFormat('en-US').format(Number(number))
}

export const extractLetters = (
  str: string | undefined | null,
  length: number | undefined = 2
) => {
  if (!str) return ''
  return str
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, length)
}
