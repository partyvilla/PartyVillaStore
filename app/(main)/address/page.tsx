"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useSupabase } from "@/hooks/use-supabase"
import { useAuth } from "@/lib/auth/auth-provider"
import { ProtectedRoute } from "@/components/auth/protected-route"

interface UserProfile {
  user_id: string
  name: string | null
  phone: string | null
  address: string | null
  city: string | null
  state: string | null
  pincode: string | null
  role: string
}

function AddressPageContent() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const { user } = useAuth()
  const supabase = useSupabase()

  useEffect(() => {
    if (user) {
      fetchProfile(user.id)
    }
  }, [user])

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
        alert(`Error loading profile: ${error.message}`)
      } else if (data) {
        setProfile(data)
      } else {
        // Create empty profile if none exists
        setProfile({
          user_id: userId,
          name: null,
          phone: null,
          address: null,
          city: null,
          state: null,
          pincode: null,
          role: 'user'
        })
        setIsEditing(true) // Start in edit mode if no profile exists
      }
    } catch (error) {
      alert(`Error loading profile: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  // Helper function to check if address data exists
  const hasAddressData = () => {
    return profile && (profile.name || profile.address || profile.phone || profile.city || profile.state || profile.pincode)
  }

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!profile || !user) return

    setSaving(true)
    
    const formData = new FormData(e.currentTarget)
    const updatedProfile = {
      user_id: user.id,
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
      address: formData.get('address') as string,
      city: formData.get('city') as string,
      state: formData.get('state') as string,
      pincode: formData.get('pincode') as string,
      role: 'user' // Set default role as per schema
    }

    try {      
      // TODO: Fix database types - using any for now
      const { data, error } = await (supabase as any)
        .from('profiles')
        .upsert(updatedProfile, {
          onConflict: 'user_id' // Use user_id for conflict resolution since it has unique constraint
        })
        .select()
        .single()

      if (error) {
        alert(`Failed to save address: ${error.message || JSON.stringify(error)}. Please try again.`)
      } else {
        setProfile(data)
        setIsEditing(false)
        alert('Address saved successfully!')
      }
    } catch (error) {
      alert(`Failed to save address: ${error instanceof Error ? error.message : JSON.stringify(error)}. Please try again.`)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8 max-w-3xl">
        <div className="animate-pulse h-64 bg-gray-200 rounded-md"></div>
    </div>
  )
}

  if (loading) {
    return (
      <div className="container mx-auto py-8 max-w-3xl">
        <div className="animate-pulse h-64 bg-gray-200 rounded-md"></div>
      </div>
    )
  }

  return (
    <main className="mx-auto max-w-3xl space-y-6 px-4 py-6 md:space-y-8 md:py-8">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
        <ol className="flex items-center gap-2">
          <li>
            <Link href="/" className="hover:underline">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/account" className="hover:underline">
              Account
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-foreground">
            My Address
          </li>
        </ol>
      </nav>

      <div className="space-y-6">
        <div>
          <h1 className="text-pretty text-2xl font-semibold md:text-3xl">My Address</h1>
          <p className="text-sm text-muted-foreground">Manage your delivery address and contact information</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Delivery Address</CardTitle>
              {!isEditing && hasAddressData() && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex flex-col gap-1">
                    <label htmlFor="name" className="text-sm font-medium">
                      Full Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      defaultValue={profile?.name || ''}
                      placeholder="Enter your full name"
                      className="rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label htmlFor="phone" className="text-sm font-medium">
                      Phone Number
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      defaultValue={profile?.phone || ''}
                      placeholder="98765 43210"
                      className="rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label htmlFor="address" className="text-sm font-medium">
                    Address
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    rows={3}
                    defaultValue={profile?.address || ''}
                    placeholder="House number, Street, Area, Landmark"
                    className="rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring resize-none"
                    required
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex flex-col gap-1">
                    <label htmlFor="city" className="text-sm font-medium">
                      City
                    </label>
                    <input
                      id="city"
                      name="city"
                      type="text"
                      defaultValue={profile?.city || ''}
                      placeholder="Enter your city"
                      className="rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label htmlFor="state" className="text-sm font-medium">
                      State
                    </label>
                    <input
                      id="state"
                      name="state"
                      type="text"
                      defaultValue={profile?.state || ''}
                      placeholder="Enter your state"
                      className="rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-1">
                  <div className="flex flex-col gap-1">
                    <label htmlFor="pincode" className="text-sm font-medium">
                      PIN Code
                    </label>
                    <input
                      id="pincode"
                      name="pincode"
                      type="text"
                      pattern="[0-9]{6}"
                      defaultValue={profile?.pincode || ''}
                      placeholder="400001"
                      className="rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="submit" disabled={saving}>
                    {saving ? 'Saving...' : 'Save Address'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsEditing(false)}
                    disabled={saving}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                {profile?.name || profile?.address ? (
                  <>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <p className="text-sm text-gray-500">Name</p>
                        <p className="font-medium">{profile?.name || 'Not provided'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-medium">{profile?.phone || 'Not provided'}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="font-medium">{profile?.address || 'Not provided'}</p>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <p className="text-sm text-gray-500">City</p>
                        <p className="font-medium">{profile?.city || 'Not provided'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">State</p>
                        <p className="font-medium">{profile?.state || 'Not provided'}</p>
                      </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-1">
                      <div>
                        <p className="text-sm text-gray-500">PIN Code</p>
                        <p className="font-medium">{profile?.pincode || 'Not provided'}</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">No address information saved yet.</p>
                    <Button onClick={() => setIsEditing(true)}>
                      Add Address
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

export default function AddressPage() {
  return (
    <ProtectedRoute>
      <AddressPageContent />
    </ProtectedRoute>
  )
}