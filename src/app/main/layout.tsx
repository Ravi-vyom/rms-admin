"use client"
import MainLayout from '@/common/MainLayout';
import React from 'react'
import {
  QueryClient,
  QueryClientProvider
} from '@tanstack/react-query'
const queryClient = new QueryClient()

export default function layout({ children }: { children: React.ReactNode; }) {
  return (
    <QueryClientProvider client={queryClient}>
      <MainLayout>
        {children}
      </MainLayout>
    </QueryClientProvider>
  )
}
