"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ChevronRight, Info } from 'lucide-react';

export default function ProductPage({ params }: { params: { slug: string } }) {
  const [product, setProduct] = useState<any>(null);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);

  useEffect(() => {
    fetch(`/api/products/${params.slug}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        setSelectedVariant(data.variants[0]);
      });
  }, [params.slug]);

  if (!product || !selectedVariant) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-12 font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Left: Product Image Section */}
        <div className="flex flex-col items-center">
          <AnimatePresence mode="wait">
            <motion.img 
              key={selectedVariant.image}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              src={selectedVariant.image} 
              alt={product.name}
              className="w-full max-w-md object-contain drop-shadow-2xl"
            />
          </AnimatePresence>
          <div className="mt-8 flex gap-4">
            {product.variants.map((v: any) => (
              <button 
                key={v.id}
                onClick={() => setSelectedVariant(v)}
                className={`w-8 h-8 rounded-full border-2 ${selectedVariant.id === v.id ? 'border-blue-600 scale-125' : 'border-gray-200'}`}
                style={{ backgroundColor: v.colorCode }}
              />
            ))}
          </div>
        </div>

        {/* Right: Content Section */}
        <div className="space-y-6">
          <div>
            <span className="text-red-500 font-bold text-xs tracking-widest uppercase">New</span>
            <h1 className="text-4xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-gray-500 text-lg">{selectedVariant.storage} • {selectedVariant.color}</p>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold">{formatCurrency(selectedVariant.price)}</span>
            <span className="text-xl text-gray-400 line-through">{formatCurrency(selectedVariant.mrp)}</span>
          </div>

          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-start gap-3">
            <Info className="text-blue-600 shrink-0 mt-1" size={20} />
            <p className="text-blue-800 text-sm font-medium">EMI plans backed by mutual funds. Select a plan below to see benefits.</p>
          </div>

          {/* EMI List */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-700">Available EMI Plans</h3>
            {product.defaultEMIPlans.map((plan: any, idx: number) => {
              const emiAmount = Math.round((selectedVariant.price + (selectedVariant.price * (plan.interestRate/100))) / plan.tenure);
              return (
                <motion.div 
                  whileHover={{ x: 5 }}
                  key={idx}
                  onClick={() => setSelectedPlan(idx)}
                  className={`relative p-4 rounded-xl border-2 transition-all cursor-pointer flex justify-between items-center ${selectedPlan === idx ? 'border-blue-600 bg-blue-50' : 'border-gray-100 hover:border-gray-300'}`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg">{formatCurrency(emiAmount)} x {plan.tenure} months</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${plan.interestRate === 0 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {plan.interestRate === 0 ? '0% Interest' : `${plan.interestRate}% Interest`}
                      </span>
                    </div>
                    {plan.cashback > 0 && <p className="text-green-600 text-sm font-semibold">Additional cashback of {formatCurrency(plan.cashback)}</p>}
                  </div>
                  {selectedPlan === idx && <CheckCircle2 className="text-blue-600" />}
                </motion.div>
              );
            })}
          </div>

          <button 
            disabled={selectedPlan === null}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${selectedPlan !== null ? 'bg-indigo-600 text-white shadow-lg hover:bg-indigo-700' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
          >
            Proceed with Selected Plan <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}