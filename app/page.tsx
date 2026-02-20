import Link from 'next/link';
import { connectDB } from '@/lib/mongodb';
import { Product } from '@/models/Product';

export default async function Home() {
  await connectDB();
  const products = await Product.find({}); 

  return (
    <main className="min-h-screen bg-slate-50 py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-black text-slate-900 mb-4 tracking-tighter">Premium Smartphones</h1>
          <p className="text-slate-500 text-xl font-medium">Select a device to view exclusive EMI plans.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {products.map((p) => (
            <Link key={p.slug} href={`/products/${p.slug}`}>
              <div className="group bg-white rounded-[40px] p-8 hover:shadow-2xl transition-all duration-500 border border-slate-100 cursor-pointer h-full flex flex-col items-center">
                <div className="h-64 w-full flex items-center justify-center mb-8 bg-slate-50 rounded-[30px] overflow-hidden">
                  <img 
                    src={p.variants[0].image} 
                    alt={p.name} 
                    referrerPolicy="no-referrer"
                    crossOrigin="anonymous"
                    className="h-48 object-contain transition-transform duration-500 group-hover:scale-110"  
                  />
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">{p.name}</h3>
                  <p className="text-indigo-600 font-bold text-lg">Starts at ₹{p.variants[0].price.toLocaleString('en-IN')}</p>
                </div>
                <div className="mt-8 bg-indigo-600 text-white w-full py-4 rounded-2xl text-center font-bold tracking-wide group-hover:bg-indigo-700 transition-colors">
                  VIEW EMI PLANS
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}