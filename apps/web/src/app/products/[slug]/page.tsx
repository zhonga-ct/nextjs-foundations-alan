import type { Metadata } from 'next'
 
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}): Promise<Metadata> {
  const { slug } = await params
//   const product = await fetchProduct(slug)
  
  return {
    title: slug,
    // title: product.name,
    // description: product.description,
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  return (
    <main className="flex flex-col gap-4">
      <h1 className="font-bold text-4xl">{slug}</h1>
    </main>
  )
}