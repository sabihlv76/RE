export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          email: string | null
          role: 'tourist' | 'partner' | 'admin'
          created_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          email?: string | null
          role?: 'tourist' | 'partner' | 'admin'
          created_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          email?: string | null
          role?: 'tourist' | 'partner' | 'admin'
          created_at?: string
        }
      }
      services: {
        Row: {
          id: string
          partner_id: string
          title: string
          description: string
          type: 'tour' | 'hotel' | 'package' | 'transport'
          location: string
          price: number
          images: string[]
          itinerary: Json
          availability: Json
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          partner_id: string
          title: string
          description: string
          type: 'tour' | 'hotel' | 'package' | 'transport'
          location: string
          price: number
          images?: string[]
          itinerary?: Json
          availability?: Json
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          partner_id?: string
          title?: string
          description?: string
          type?: 'tour' | 'hotel' | 'package' | 'transport'
          location?: string
          price?: number
          images?: string[]
          itinerary?: Json
          availability?: Json
          is_active?: boolean
          created_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          service_id: string
          tourist_id: string
          status: 'pending' | 'confirmed' | 'paid_to_partner' | 'completed' | 'cancelled'
          total_price: number
          commission_amount: number
          booking_details: Json
          payment_reference: string | null
          created_at: string
        }
        Insert: {
          id?: string
          service_id: string
          tourist_id: string
          status?: 'pending' | 'confirmed' | 'paid_to_partner' | 'completed' | 'cancelled'
          total_price: number
          commission_amount: number
          booking_details: Json
          payment_reference?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          service_id?: string
          tourist_id?: string
          status?: 'pending' | 'confirmed' | 'paid_to_partner' | 'completed' | 'cancelled'
          total_price?: number
          commission_amount?: number
          booking_details?: Json
          payment_reference?: string | null
          created_at?: string
        }
      }
    }
  }
}
