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

  // --- OUTSTANDING FEATURE: Professional Amortization Formula ---
  const calculateProfessionalEMI = (principal: number, annualRate: number, months: number) => {
    if (annualRate === 0) return Math.round(principal / months);
    const r = annualRate / 12 / 100; // Monthly interest rate
    const emi = (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
    return Math.round(emi);
  };

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  // --- HANDLER: Proceed Logic ---
  const handleProceed = () => {
    if (selectedPlan === null || !product) return;
    const plan = product.defaultEMIPlans[selectedPlan];
    const emi = calculateProfessionalEMI(selectedVariant.price, plan.interestRate, plan.tenure);

    alert(`
      Order Confirmed!
      Proceeding with ${product.name} - ${selectedVariant.storage}
      Monthly EMI: ${formatCurrency(emi)} 
      Tenure: ${plan.tenure} months
    `);
  };

  useEffect(() => {
    fetch(`/api/products/${slug}`).then(res => res.json()).then(data => {
      setProduct(data);
      setSelectedVariant(data.variants[0]);
    });
  }, [slug]);

  if (!product || !selectedVariant) return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="font-bold text-gray-400">Fetching Product Details...</p>
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <Link href="/" className="mb-4 self-start max-w-5xl w-full flex items-center text-gray-400 hover:text-indigo-600 font-bold transition-colors">
        <ChevronLeft size={20}/> BACK TO CATALOG
      </Link>
      
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 max-w-5xl w-full flex flex-col md:flex-row overflow-hidden">
        
        {/* Left Section: Product Display */}
        <div className="w-full md:w-5/12 p-10 border-r border-gray-50 flex flex-col items-center bg-white">
          <div className="self-start">
            <span className="text-red-500 font-black text-[10px] uppercase tracking-widest bg-red-50 px-2 py-1 rounded">New Arrival</span>
            <h1 className="text-3xl font-black text-gray-900 mt-2 tracking-tight">{product.name}</h1>
            
            {/* Variant Switcher (Storage) */}
            <div className="flex gap-2 mt-3">
                {product.variants.map((v: any) => (
                    <button 
                        key={v.id}
                        onClick={() => {setSelectedVariant(v); setSelectedPlan(null);}}
                        className={`text-[10px] font-black px-3 py-1.5 rounded-lg border transition-all ${selectedVariant.id === v.id ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-white text-gray-400 border-gray-100 hover:border-gray-200'}`}
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
                  initial={{ opacity: 0, scale: 0.9, y: 10 }} 
                  animate={{ opacity: 1, scale: 1, y: 0 }} 
                  exit={{ opacity: 0, scale: 0.9, y: -10 }}
                  src={selectedVariant.image} 
                  referrerPolicy="no-referrer"
                  crossOrigin="anonymous"
                  className="max-h-full object-contain drop-shadow-2xl"
                />
            </AnimatePresence>
          </div>

          <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-4">Color: {selectedVariant.color}</p>
          <div className="flex gap-4">
             {product.variants.map((v: any) => (
                 <motion.div 
                    key={v.id} 
                    whileHover={{ scale: 1.2 }}
                    onClick={() => {setSelectedVariant(v); setSelectedPlan(null);}}
                    className={`w-8 h-8 rounded-full border-4 cursor-pointer transition-all ${selectedVariant.id === v.id ? 'border-indigo-600 ring-4 ring-indigo-50' : 'border-white shadow-sm'}`}
                    style={{ backgroundColor: v.colorCode }}
                 />
             ))}
          </div>
        </div>

        {/* Right Section: EMI Selection */}
        <div className="w-full md:w-7/12 p-10 bg-[#fafbfc]">
           <div className="mb-8">
              <div className="flex items-baseline gap-3">
                <span className="text-5xl font-black text-gray-900 tracking-tighter">{formatCurrency(selectedVariant.price)}</span>
                <span className="text-lg text-gray-400 font-bold line-through">{formatCurrency(selectedVariant.mrp)}</span>
              </div>
              <p className="text-indigo-600 text-[10px] font-black mt-6 tracking-[0.2em] uppercase bg-indigo-50 inline-block px-3 py-1 rounded-md">
                EMI plans backed by mutual funds
              </p>
           </div>

           {/* --- OUTSTANDING FEATURE: Selection Slide List --- */}
           <div className="space-y-3 h-[400px] overflow-y-auto pr-2 custom-scrollbar scroll-smooth">
              {product.defaultEMIPlans.map((plan: any, idx: number) => {
                const emi = calculateProfessionalEMI(selectedVariant.price, plan.interestRate, plan.tenure);
                const isSelected = selectedPlan === idx;
                return (
                  <motion.div 
                    key={idx}
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ 
                        opacity: 1, 
                        x: isSelected ? 3 : 0, // Selection Slide Animation
                        scale: isSelected ? 1.01 : 1 
                    }}
                    onClick={() => setSelectedPlan(idx)}
                    className={`flex items-center justify-between p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${isSelected ? 'border-indigo-600 bg-white shadow-xl ring-1 ring-indigo-100' : 'border-gray-100 bg-white/60 hover:bg-white hover:border-gray-200'}`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className={`font-black text-xl transition-colors ${isSelected ? 'text-indigo-600' : 'text-gray-900'}`}>{formatCurrency(emi)}</span>
                        <span className="text-gray-400 font-bold text-xs uppercase">/ {plan.tenure} mo</span>
                        <span className={`text-[9px] font-black px-2 py-1 rounded-md ${plan.interestRate === 0 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                            {plan.interestRate === 0 ? 'NO COST EMI' : `${plan.interestRate}% INTEREST`}
                        </span>
                      </div>
                      <p className="text-green-600 text-[11px] font-bold mt-1.5 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                        Includes {formatCurrency(plan.cashback)} Cashback
                      </p>
                    </div>
                    {isSelected && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                            <CheckCircle2 className="text-indigo-600" size={24} />
                        </motion.div>
                    )}
                  </motion.div>
                );
              })}
           </div>

           <button
             onClick={handleProceed} 
             disabled={selectedPlan === null}
             className={`w-full mt-8 py-5 rounded-2xl font-black text-xs tracking-[0.2em] uppercase transition-all duration-300 shadow-xl ${selectedPlan !== null ? 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-200 -translate-y-1' : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'}`}
           >
             {selectedPlan !== null ? 'Proceed with Selected Plan' : 'Select an EMI Plan'}
           </button>
           <p className="text-center text-[9px] text-gray-400 font-bold mt-4 tracking-widest uppercase">Safe & Secure 256-bit SSL Payment</p>
        </div>
      </div>
    </div>
  );
}