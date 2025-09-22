// Database types (generated from Supabase schema)
export type Database = {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          name: string
          description: string | null
          category: string
          image_url: any | null
          variants: any | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          category: string
          image_url?: any | null
          variants?: any | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          category?: string
          image_url?: any | null
          variants?: any | null
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: number
          name: string
          slug: string
          image: string | null
          description: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: number
          name: string
          slug: string
          image?: string | null
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name?: string
          slug?: string
          image?: string | null
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          user_id: string
          name: string | null
          phone: string | null
          address: string | null
          city: string | null
          pincode: string | null
          role: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name?: string | null
          phone?: string | null
          address?: string | null
          city?: string | null
          pincode?: string | null
          role: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string | null
          phone?: string | null
          address?: string | null
          city?: string | null
          pincode?: string | null
          role?: string
          created_at?: string
          updated_at?: string
        }
      }
      cart: {
        Row: {
          id: string
          user_id: string
          product_id: string
          name: string
          price: number
          qty: number
          img: string | null
          variant: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          name: string
          price: number
          qty?: number
          img?: string | null
          variant?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          name?: string
          price?: number
          qty?: number
          img?: string | null
          variant?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          items: any
          total_price: number
          status: string
          delivery_address: any
          upi_ref: string
          payee_name: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          items: any
          total_price: number
          status?: string
          delivery_address: any
          upi_ref: string
          payee_name: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          items?: any
          total_price?: number
          status?: string
          delivery_address?: any
          upi_ref?: string
          payee_name?: string
          created_at?: string
          updated_at?: string
        }
      }
      delivery_address: {
        Row: {
          id: string
          pincode: string
          delivery_charge: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          pincode: string
          delivery_charge: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          pincode?: string
          delivery_charge?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
