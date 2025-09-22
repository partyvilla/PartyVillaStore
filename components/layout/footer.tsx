import Link from "next/link"
import { getCategoriesForFooter } from "@/lib/database/services/supabase-categories"

export async function Footer() {
  const currentYear = new Date().getFullYear()
  const categories = await getCategoriesForFooter(4)
  
  return (
    <footer className="w-full bg-white border-t border-gray-200">
      {/* Main Footer */}
      <div className="py-6 border-t border-gray-100">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-6 md:grid-cols-4">
            {/* About */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-800">About PartyVilla</h3>
              <p className="text-xs text-gray-600">
                Your one-stop shop for all party supplies and festive decorations in India.
              </p>
              <div className="flex items-center gap-3 mt-3">
                <a href="#" className="text-primary hover:text-primary/80">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96A10 10 0 0 0 22 12.06C22 6.53 17.5 2.04 12 2.04Z"></path></svg>
                </a>
                <a href="#" className="text-primary hover:text-primary/80">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"></path></svg>
                </a>
                <a href="#" className="text-primary hover:text-primary/80">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z"></path></svg>
                </a>
              </div>
            </div>
            
            {/* Links */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-800">Quick Links</h3>
              <ul className="space-y-1 text-xs">
                <li>
                  <Link href="/" className="text-gray-600 hover:text-primary">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/shop" className="text-gray-600 hover:text-primary">
                    Shop
                  </Link>
                </li>
                <li>
                  <Link href="/categories" className="text-gray-600 hover:text-primary">
                    Categories
                  </Link>
                </li>
                <li>
                  <Link href="/cart" className="text-gray-600 hover:text-primary">
                    Cart
                  </Link>
                </li>
              </ul>
            </div>
            
            {/* Categories */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-800">Categories</h3>
              <ul className="space-y-1 text-xs">
                {categories.map((category) => (
                  <li key={category.id}>
                    <Link href={`/category/${category.slug}`} className="text-gray-600 hover:text-primary">
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Contact */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-800">Contact Us</h3>
              <address className="text-xs text-gray-600 not-italic space-y-1">
                <p>123 Party Street</p>
                <p>Mumbai, Maharashtra 400001</p>
                <p>India</p>
              </address>
              <p className="text-xs text-gray-600 pt-1">
                <a href="mailto:contact@partyvilla.in" className="text-primary">
                  contact@partyvilla.in
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Copyright */}
      <div className="py-3 border-t border-gray-100 bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 flex flex-col sm:flex-row justify-center items-center gap-2">
          <p className="text-xs text-gray-500">
            © {currentYear} PartyVilla. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
