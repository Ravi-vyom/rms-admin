import MainLayout from '@/common/MainLayout';
import React from 'react'

export default function layout({children}:{children: React.ReactNode;  }) {
  return (
    <MainLayout>
      {children}
    </MainLayout>
  )
}
