import { connectDB } from "@/lib/mongodb";
import { Product } from "@/models/Product";
import { NextResponse } from "next/server";

const sampleData = [
  {
    name: "iPhone 17 Pro",
    slug: "iphone-17-pro",
    brand: "Apple",
    description: "The next generation of iPhone.",
    variants: [
      { id: "v1", storage: "128GB", color: "Titanium", colorCode: "#71706e", price: 119900, mrp: 129900, image: "https://vzvjiofuzvkmvubv.public.blob.vercel-storage.com/iphone-gold.png" },
      { id: "v2", storage: "256GB", color: "Desert Titanium", colorCode: "#c4a484", price: 127400, mrp: 134900, image: "https://vzvjiofuzvkmvubv.public.blob.vercel-storage.com/iphone-gold.png" }
    ],
    defaultEMIPlans: [
      { tenure: 3, interestRate: 0, cashback: 7500 },
      { tenure: 6, interestRate: 0, cashback: 7500 },
      { tenure: 12, interestRate: 0, cashback: 7500 },
      { tenure: 24, interestRate: 0, cashback: 7500 },
      { tenure: 36, interestRate: 10.5, cashback: 7500 },
    ]
  },
  {
    name: "Samsung S24 Ultra",
    slug: "samsung-s24-ultra",
    brand: "Samsung",
    description: "The flagship Samsung smartphone.",
    variants: [
      { id: "v1", storage: "256GB", color: "Phantom Black", colorCode: "#000000", price: 139900, mrp: 149900, image: "https://vzvjiofuzvkmvubv.public.blob.vercel-storage.com/samsung-s24-ultra.png" },
      { id: "v2", storage: "512GB", color: "Phantom White", colorCode: "#ffffff", price: 154900, mrp: 164900, image: "https://vzvjiofuzvkmvubv.public.blob.vercel-storage.com/samsung-s24-ultra.png" }
    ],
    defaultEMIPlans: [
      { tenure: 3, interestRate: 0, cashback: 7500 },
      { tenure: 6, interestRate: 0, cashback: 7500 },
      { tenure: 12, interestRate: 0, cashback: 7500 },
      { tenure: 24, interestRate: 0, cashback: 7500 },
      { tenure: 36, interestRate: 12.5, cashback: 7500 },
    ]
  },
  {
    name: "Google Pixel 9",
    slug:"google-pixel-9",
    brand:"Google",
    description:"The latest Google smartphone.",
    variants:[
      { id:"v1", storage:"128GB", color:"Black", colorCode:"#ffffff", price :89999,mrp :94999,image:"https://vzvjiofuzvkmvubv.public.blob.vercel-storage.com/google-pixel-9.png"},
      { id:"v2", storage:"256GB", color:"White", colorCode:"#ffffff", price :114999,mrp :118888,image:"https://vzvjiofuzvkmvubv.public.blob.vercel-storage.com/google-pixel-9.png"}
    ],
    defaultEMIPlans:[
      {tenure :3 ,interestRate :0,cashback :750},
      {tenure :6 ,interestRate :0,cashback :750},
      {tenure :12 ,interestRate :0,cashback :750},
      {tenure :24 ,interestRate :3.5,cashback :75},
      {tenure :36 ,interestRate :6.5,cashback :75}
    ]
  }
];

export async function GET() {
  await connectDB();
  await Product.deleteMany({}); // Clears old data
  await Product.insertMany(sampleData);
  return NextResponse.json({ message: "Database Seeded Successfully" });
}