"use client";
import React, { useState, useEffect, use } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [product, setProduct] = useState<any>(null);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const handleProceed = () => {
    alert(`Proceeding with ${product.name} - ${selectedVariant.storage}. EMI: ${formatCurrency(Math.round((selectedVariant.price + (selectedVariant.price * (product.defaultEMIPlans[selectedPlan].interestRate/100))) / product.defaultEMIPlans[selectedPlan].tenure))} for ${product.defaultEMIPlans[selectedPlan].tenure} months.`);
  };

  useEffect(() => {
    fetch(`/api/products/${slug}`).then(res => res.json()).then(data => {
      setProduct(data);
      setSelectedVariant(data.variants[0]);
    });
  }, [slug]);

  if (!product || !selectedVariant) return <div className="p-20 text-center font-bold text-gray-400">Loading Product...</div>;

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <Link href="/" className="mb-4 self-start max-w-5xl w-full flex items-center text-gray-400 hover:text-indigo-600 font-bold transition-colors">
        <ChevronLeft size={20}/> BACK TO CATALOG
      </Link>
      
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 max-w-5xl w-full flex flex-col md:flex-row overflow-hidden">
        
        {/* Left Section */}
        <div className="w-full md:w-5/12 p-10 border-r border-gray-50 flex flex-col items-center">
          <div className="self-start">
            <span className="text-red-500 font-black text-[10px] uppercase tracking-widest bg-red-50 px-2 py-1 rounded">New</span>
            <h1 className="text-3xl font-bold text-gray-900 mt-2">{product.name}</h1>
            <div className="flex gap-2 mt-1">
                {product.variants.map((v: any) => (
                    <button 
                        key={v.id}
                        onClick={() => {setSelectedVariant(v); setSelectedPlan(null);}}
                        className={`text-[10px] font-bold px-2 py-1 rounded border transition-all ${selectedVariant.id === v.id ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-400 border-gray-100 hover:border-gray-300'}`}
                    >
                        {v.storage}
                    </button>
                ))}
            </div>
          </div>

          <div className="my-12 h-64 flex items-center justify-center">
            <AnimatePresence mode="wait">
                <motion.img 
                  key={selectedVariant.image}
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: -10 }}
                  src={selectedVariant.image} 
                  referrerPolicy="no-referrer"
                  crossOrigin="anonymous"
                  className="max-h-full object-contain drop-shadow-2xl"
                />
            </AnimatePresence>
          </div>

          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-3">Color: {selectedVariant.color}</p>
          <div className="flex gap-3">
             {product.variants.map((v: any) => (
                 <div 
                    key={v.id} 
                    onClick={() => {setSelectedVariant(v); setSelectedPlan(null);}}
                    className={`w-6 h-6 rounded-full border-2 cursor-pointer transition-transform hover:scale-110 ${selectedVariant.id === v.id ? 'border-indigo-600 ring-2 ring-indigo-100' : 'border-gray-100'}`}
                    style={{ backgroundColor: v.colorCode }}
                 />
             ))}
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full md:w-7/12 p-10 bg-[#fafbfc]">
           <div className="mb-8">
              <span className="text-4xl font-black text-gray-900 tracking-tighter">{formatCurrency(selectedVariant.price)}</span>
              <p className="text-gray-400 text-sm font-bold line-through ml-1">{formatCurrency(selectedVariant.mrp)}</p>
              <p className="text-indigo-600 text-xs font-black mt-6 tracking-widest uppercase">EMI plans backed by mutual funds</p>
           </div>

           <div className="space-y-3 h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {product.defaultEMIPlans.map((plan: any, idx: number) => {
                const emi = Math.round((selectedVariant.price + (selectedVariant.price * (plan.interestRate/100))) / plan.tenure);
                const isSelected = selectedPlan === idx;
                return (
                  <motion.div 
                    key={idx} whileHover={{ x: 4 }}
                    onClick={() => setSelectedPlan(idx)}
                    className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${isSelected ? 'border-indigo-600 bg-white shadow-md' : 'border-gray-100 bg-white/50 hover:bg-white'}`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="font-extrabold text-gray-900 text-lg">{formatCurrency(emi)} <span className="text-[10px] text-gray-400 font-normal">/mo</span></span>
                        <span className="text-gray-400 font-bold text-xs">x {plan.tenure} months</span>
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded ${plan.interestRate === 0 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                            {plan.interestRate === 0 ? '0% INTEREST' : `${plan.interestRate}% INTEREST`}
                        </span>
                      </div>
                      <p className="text-green-600 text-[11px] font-bold mt-1">Additional cashback of {formatCurrency(plan.cashback)}</p>
                    </div>
                    {isSelected && <CheckCircle2 className="text-indigo-600" size={20} />}
                  </motion.div>
                );
              })}
           </div>

           <button
              onClick={handleProceed} 
             disabled={selectedPlan === null}
             className={`w-full mt-8 py-5 rounded-xl font-black text-sm tracking-widest uppercase transition-all shadow-lg ${selectedPlan !== null ? 'bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-[1.01]' : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'}`}
           >
             {selectedPlan !== null ? 'Proceed with Selected Plan' : 'Select a Plan to Continue'}
           </button>
        </div>
      </div>
    </div>
  );
}