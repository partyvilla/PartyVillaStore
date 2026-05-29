import Link from "next/link"
import { getCategoriesForFooter } from "@/lib/database/services/supabase-categories"

export async function Footer() {
  const currentYear = new Date().getFullYear()
  const categories = await getCategoriesForFooter(4)
  
  return (
    <footer className="w-full bg-white border-t border-border">
      {/* Main Footer */}
      <div className="py-6 border-t border-border/50">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-6 md:grid-cols-4">
            {/* About */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-foreground">About PartyVilla</h3>
              <p className="text-xs text-foreground/60">
                Your one-stop shop for all party supplies and festive decorations in India.
              </p>
              <div className="flex items-center gap-3 mt-3">
                <a href="https://www.facebook.com/share/1Ghcdcide2" className="text-primary hover:text-primary/80">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96A10 10 0 0 0 22 12.06C22 6.53 17.5 2.04 12 2.04Z"></path></svg>
                </a>
                <a href="https://youtube.com/@partyvilla-n1f?si=yccgBo8uk02oXjRC" className="text-primary hover:text-primary/80">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19.6 3.2H4.4C3 3.2 2 4.2 2 5.6v12.8c0 1.4 1 2.4 2.4 2.4h15.2c1.4 0 2.4-1 2.4-2.4V5.6c0-1.4-1-2.4-2.4-2.4zM10 15.5V8.5l6 3.5-6 3.5z"></path></svg>
                </a>
                <a href="https://www.instagram.com/party_.villa" className="text-primary hover:text-primary/80">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z"></path></svg>
                </a>
              </div>
            </div>
            
            {/* Links */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-foreground">Quick Links</h3>
              <ul className="space-y-1 text-xs">
                <li>
                  <Link href="/" className="text-foreground/60 hover:text-primary">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/shop" className="text-foreground/60 hover:text-primary">
                    Shop
                  </Link>
                </li>
                <li>
                  <Link href="/categories" className="text-foreground/60 hover:text-primary">
                    Categories
                  </Link>
                </li>
                <li>
                  <Link href="/cart" className="text-foreground/60 hover:text-primary">
                    Cart
                  </Link>
                </li>
              </ul>
            </div>
            
            {/* Categories */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-foreground">Categories</h3>
              <ul className="space-y-1 text-xs">
                {categories.map((category) => (
                  <li key={category.id}>
                    <Link href={`/category/${category.slug}`} className="text-foreground/60 hover:text-primary">
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Contact */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-foreground">Contact Us</h3>
              <address className="text-xs text-foreground/60 not-italic space-y-1">
                <p>Shop no. 15, Party Villa</p>
                <p>Hong kong Arcade, Near Shiva Complex</p>
                <p>Maharashtra - 410206</p>
              </address>
              <p className="text-xs text-foreground/60 pt-1">
                <a href="mailto:contact@partyvilla.in" className="text-primary">
                  partyvilla.store@gmail.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Copyright */}
      <div className="py-3 border-t border-border/50 bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 flex flex-col sm:flex-row justify-center items-center gap-2">
          <p className="text-xs text-foreground/50">
            © {currentYear} PartyVilla. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
