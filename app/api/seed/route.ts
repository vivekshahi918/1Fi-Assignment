import { connectDB } from "@/lib/mongodb";
import { Product } from "@/models/Product";
import { NextResponse } from "next/server";

const sampleData = [
  {
    name: "iPhone 17 Pro",
    slug: "iphone-17-pro",
    brand: "Apple",
    description: "The ultimate iPhone with Titanium design.",
    variants: [
      { 
        id: "v1", storage: "128GB", color: "Natural Titanium", colorCode: "#71706e", 
        price: 119900, mrp: 129900, 
        image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=800" 
      },
      { 
        id: "v2", storage: "256GB", color: "Desert Titanium", colorCode: "#c4a484", 
        price: 127400, mrp: 134900, 
        image: "https://images.unsplash.com/photo-1678652197831-2d180705cd2c?auto=format&fit=crop&q=80&w=800" 
      }
    ],
    defaultEMIPlans: [
      { tenure: 3, interestRate: 0, cashback: 7500 },
      { tenure: 6, interestRate: 0, cashback: 7500 },
      { tenure: 12, interestRate: 0, cashback: 7500 },
      { tenure: 24, interestRate: 0, cashback: 7500 },
      { tenure: 36, interestRate: 10.5, cashback: 7500 }
    ]
  },
  {
    name: "Samsung S24 Ultra",
    slug: "samsung-s24-ultra",
    brand: "Samsung",
    description: "Galaxy AI is here. Welcome to the era of mobile AI.",
    variants: [
      { 
        id: "s1", storage: "256GB", color: "Titanium Gray", colorCode: "#8e8e8e", 
        price: 129999, mrp: 134999, 
        image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&q=80&w=800" 
      },
      { 
        id: "s2", storage: "512GB", color: "Titanium Black", colorCode: "#212121", 
        price: 139999, mrp: 144999, 
        image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&q=80&w=800" 
      }
    ],
    defaultEMIPlans: [
      { tenure: 6, interestRate: 0, cashback: 10000 },
      { tenure: 12, interestRate: 0, cashback: 10000 },
      { tenure: 24, interestRate: 12.5, cashback: 0 }
    ]
  },
  {
    name: "Google Pixel 9 Pro",
    slug: "google-pixel-9-pro",
    brand: "Google",
    description: "The most powerful Pixel yet.",
    variants: [
      { 
        id: "p1", storage: "128GB", color: "Obsidian", colorCode: "#2e2e2e", 
        price: 109999, mrp: 115000, 
        image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&q=80&w=800" 
      },
      { 
        id: "p2", storage: "256GB", color: "Porcelain", colorCode: "#f5f5dc", 
        price: 119999, mrp: 125000, 
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=800" 
      }
    ],
    defaultEMIPlans: [
      { tenure: 3, interestRate: 0, cashback: 8000 },
      { tenure: 6, interestRate: 0, cashback: 8000 },
      { tenure: 12, interestRate: 11.5, cashback: 0 }
    ]
  }
];

export async function GET() {
  await connectDB();
  await Product.deleteMany({}); 
  await Product.insertMany(sampleData);
  return NextResponse.json({ message: "Database Seeded Successfully with Multi-Variants" });
}