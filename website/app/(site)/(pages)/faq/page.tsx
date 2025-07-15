import FAQ from '@/components/faq'
import React from 'react'

const FAQPage = async ({ searchParams, }: { searchParams: Promise<{ q?: string }> }) => {
    const { q } = await searchParams;
    return (
        <main>
            <FAQ q={q} />
        </main>
    )
}

export default FAQPage