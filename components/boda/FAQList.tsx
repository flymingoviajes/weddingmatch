'use client'
import { Card, CardBody, CardHeader } from '@heroui/card'
import { Divider } from '@heroui/divider'
import { BodaData } from './types'

export default function FAQList({ data }: { data: BodaData }) {
  if (!data.faq?.length) return null
  return (
    <Card shadow="sm" className="border border-neutral-200">
      <CardHeader><h2 className="text-xl font-semibold">Preguntas frecuentes</h2></CardHeader>
      <Divider />
      <CardBody className="space-y-3">
        {data.faq.map((f, i) => (
          <div key={i} className="p-3 rounded-xl border border-neutral-200">
            <p className="font-medium">{f.q}</p>
            <p className="text-neutral-600">{f.a}</p>
          </div>
        ))}
      </CardBody>
    </Card>
  )
}