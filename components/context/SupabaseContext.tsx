import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase, Consultation, ConsultationInsert, ConsultationUpdate } from '../../lib/supabase'

interface SupabaseContextType {
  consultations: Consultation[]
  loading: boolean
  error: string | null
  realtimeStatus: 'connecting' | 'connected' | 'error' | 'disconnected' | 'failed'
  addConsultation: (consultation: ConsultationInsert) => Promise<{ success: boolean; error?: string; data?: Consultation }>
  updateConsultationStatus: (id: string, status: string) => Promise<{ success: boolean; error?: string }>
  updateConsultation: (id: string, updates: Partial<ConsultationUpdate>) => Promise<{ success: boolean; error?: string }>
  deleteConsultation: (id: string) => Promise<{ success: boolean; error?: string }>
  refreshConsultations: () => Promise<void>
  reconnectRealtime: () => void
  checkRealtimeHealth: () => boolean
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined)

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [consultations, setConsultations] = useState<Consultation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [realtimeStatus, setRealtimeStatus] = useState<'connecting' | 'connected' | 'error' | 'disconnected' | 'failed'>('connecting')

  // Fetch all consultations on component mount
  const fetchConsultations = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .from('consultations')
        .select('*')
        .order('created_at', { ascending: false })

      if (fetchError) {
        console.error('Error fetching consultations:', fetchError)
        setError(fetchError.message)
        return
      }

      setConsultations(data || [])
    } catch (err) {
      console.error('Unexpected error:', err)
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  // Add new consultation
  const addConsultation = async (consultationData: ConsultationInsert) => {
    try {
      console.log('🚀 Attempting to add consultation:', consultationData)
      
      const { data, error: insertError } = await supabase
        .from('consultations')
        .insert([consultationData])
        .select()
        .single()

      console.log('📊 Supabase response:', { data, error: insertError })

      if (insertError) {
        console.error('❌ Error adding consultation:', insertError)
        return { success: false, error: insertError.message }
      }

      console.log('✅ Consultation added successfully:', data)
      
      // Update local state
      setConsultations(prev => [data, ...prev])
      
      return { success: true, data }
    } catch (err) {
      console.error('💥 Unexpected error adding consultation:', err)
      return { success: false, error: 'An unexpected error occurred' }
    }
  }

  // Update consultation status
  const updateConsultationStatus = async (id: string, status: string) => {
    try {
      const { error: updateError } = await supabase
        .from('consultations')
        .update({ status })
        .eq('id', id)

      if (updateError) {
        console.error('Error updating consultation status:', updateError)
        return { success: false, error: updateError.message }
      }

      // Update local state
      setConsultations(prev =>
        prev.map(consultation =>
          consultation.id === id ? { ...consultation, status } : consultation
        )
      )

      return { success: true }
    } catch (err) {
      console.error('Unexpected error updating consultation:', err)
      return { success: false, error: 'An unexpected error occurred' }
    }
  }

  // Update consultation with full data
  const updateConsultation = async (id: string, updates: Partial<ConsultationUpdate>) => {
    try {
      const { error: updateError } = await supabase
        .from('consultations')
        .update(updates)
        .eq('id', id)

      if (updateError) {
        console.error('Error updating consultation:', updateError)
        return { success: false, error: updateError.message }
      }

      // Update local state
      setConsultations(prev =>
        prev.map(consultation =>
          consultation.id === id ? { ...consultation, ...updates } : consultation
        )
      )

      return { success: true }
    } catch (err) {
      console.error('Unexpected error updating consultation:', err)
      return { success: false, error: 'An unexpected error occurred' }
    }
  }

  // Delete consultation
  const deleteConsultation = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('consultations')
        .delete()
        .eq('id', id)

      if (deleteError) {
        console.error('Error deleting consultation:', deleteError)
        return { success: false, error: deleteError.message }
      }

      // Remove from local state
      setConsultations(prev => prev.filter(consultation => consultation.id !== id))

      return { success: true }
    } catch (err) {
      console.error('Unexpected error deleting consultation:', err)
      return { success: false, error: 'An unexpected error occurred' }
    }
  }

  // Refresh consultations from database
  const refreshConsultations = async () => {
    await fetchConsultations()
  }

  // Manual reconnection function
  const reconnectRealtime = () => {
    console.log('🔄 Manual reconnection requested...')
    setRealtimeStatus('connecting')
    // Force a fresh fetch to ensure data is current
    fetchConsultations()
  }

  // Load consultations on mount
  useEffect(() => {
    console.log('🚀 Initial load of consultations...')
    fetchConsultations()
  }, [])

  // Set up real-time subscription for live updates
  useEffect(() => {
    console.log('🔌 Setting up real-time subscription...')
    
    let isSubscribed = true
    let retryCount = 0
    const maxRetries = 3
    let retryTimeout: NodeJS.Timeout | null = null
    
    const setupSubscription = async () => {
      try {
        console.log(`🔄 Attempt ${retryCount + 1} to setup real-time subscription...`)
        
        // Use the modern real-time subscription method
        const channel = supabase
          .channel(`consultations_changes_${Date.now()}`) // Unique channel name
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'consultations'
            },
            (payload) => {
              if (!isSubscribed) return
              
              console.log('🔄 Real-time update received:', payload)
              
              if (payload.eventType === 'INSERT') {
                console.log('➕ New consultation added via real-time:', payload.new)
                setConsultations(prev => {
                  const exists = prev.find(c => c.id === payload.new.id)
                  if (exists) {
                    console.log('⚠️ Consultation already exists, skipping duplicate')
                    return prev
                  }
                  return [payload.new as Consultation, ...prev]
                })
              } else if (payload.eventType === 'UPDATE') {
                console.log('✏️ Consultation updated via real-time:', payload.new)
                setConsultations(prev =>
                  prev.map(consultation =>
                    consultation.id === payload.new.id ? payload.new as Consultation : consultation
                  )
                )
              } else if (payload.eventType === 'DELETE') {
                console.log('🗑️ Consultation deleted via real-time:', payload.old)
                setConsultations(prev =>
                  prev.filter(consultation => consultation.id !== payload.old.id)
                )
              }
            }
          )
          .subscribe((status) => {
            if (!isSubscribed) return
            
            console.log('📡 Real-time subscription status:', status)
            if (status === 'SUBSCRIBED') {
              console.log('✅ Real-time subscription active!')
              setRealtimeStatus('connected')
              retryCount = 0 // Reset retry count on success
            } else if (status === 'CHANNEL_ERROR') {
              // Only log error on first occurrence to reduce noise
              if (retryCount === 0) {
                console.log('⚠️ Real-time connection issue - attempting to reconnect...')
              }
              setRealtimeStatus('error')
              handleReconnection()
            } else if (status === 'TIMED_OUT') {
              // Only log timeout on first occurrence
              if (retryCount === 0) {
                console.log('⏰ Real-time connection timeout - attempting to reconnect...')
              }
              setRealtimeStatus('error')
              handleReconnection()
            } else if (status === 'CLOSED') {
              console.log('🚪 Real-time connection closed')
              setRealtimeStatus('disconnected')
              handleReconnection()
            }
          })

        // Store channel reference for cleanup
        let channelRef = channel

        // Cleanup subscription on unmount
        return () => {
          console.log('🔌 Cleaning up real-time subscription...')
          isSubscribed = false
          if (retryTimeout) {
            clearTimeout(retryTimeout)
            retryTimeout = null
          }
          try {
            if (channelRef) {
              channelRef.unsubscribe()
            }
          } catch (error) {
            console.log('🔌 Channel cleanup error:', error)
          }
        }
        
      } catch (error) {
        console.error('❌ Error setting up real-time subscription:', error)
        setRealtimeStatus('error')
        handleReconnection()
        return () => {} // Return empty cleanup function
      }
    }
    
    const handleReconnection = () => {
      if (retryCount < maxRetries && isSubscribed) {
        retryCount++
        // Use exponential backoff: 5s, 10s, 20s, 40s...
        const delay = Math.min(5000 * Math.pow(2, retryCount - 1), 60000) // Max 60 seconds
        
        console.log(`🔄 Scheduling reconnection attempt ${retryCount}/${maxRetries} in ${delay/1000}s...`)
        
        retryTimeout = setTimeout(() => {
          if (isSubscribed) {
            console.log(`🔄 Attempting reconnection ${retryCount}/${maxRetries}...`)
            setupSubscription()
          }
        }, delay)
      } else if (retryCount >= maxRetries) {
        console.log('⚠️ Max retry attempts reached, falling back to periodic refresh')
        setRealtimeStatus('failed')
      }
    }
    
    // Initial setup
    setupSubscription()
    
    // Cleanup function
    return () => {
      isSubscribed = false
      if (retryTimeout) {
        clearTimeout(retryTimeout)
      }
    }
  }, [])

  // Fallback: periodic refresh every 30 seconds if real-time is not working
  useEffect(() => {
    if (realtimeStatus !== 'connected') {
      const interval = setInterval(() => {
        console.log('🔄 Periodic refresh due to real-time issues...')
        fetchConsultations()
      }, 30000) // 30 seconds

      return () => {
        console.log('🔄 Clearing periodic refresh interval...')
        clearInterval(interval)
      }
    }
  }, [realtimeStatus])

  // Auto-reconnect real-time if it fails
  useEffect(() => {
    if (realtimeStatus === 'error' || realtimeStatus === 'disconnected') {
      const timeout = setTimeout(() => {
        console.log('🔄 Attempting to reconnect real-time...')
        setRealtimeStatus('connecting')
        // The main useEffect will handle reconnection
      }, 5000) // Wait 5 seconds before attempting reconnection

      return () => clearTimeout(timeout)
    }
  }, [realtimeStatus])

  // Enhanced fallback: more frequent refresh when real-time is completely down
  useEffect(() => {
    if (realtimeStatus === 'failed') {
      console.log('🔄 Real-time failed, setting up aggressive fallback refresh...')
      const interval = setInterval(() => {
        console.log('🔄 Aggressive fallback refresh every 15 seconds...')
        fetchConsultations()
      }, 15000) // 15 seconds when real-time is completely down

      return () => {
        console.log('🔄 Clearing aggressive fallback interval...')
        clearInterval(interval)
      }
    }
  }, [realtimeStatus])

  // Add a function to manually check real-time health
  const checkRealtimeHealth = () => {
    if (realtimeStatus === 'connected') {
      console.log('✅ Real-time connection is healthy')
      return true
    } else {
      console.log(`⚠️ Real-time status: ${realtimeStatus}`)
      return false
    }
  }

  const value: SupabaseContextType = {
    consultations,
    loading,
    error,
    realtimeStatus,
    addConsultation,
    updateConsultationStatus,
    updateConsultation,
    deleteConsultation,
    refreshConsultations,
    reconnectRealtime,
    checkRealtimeHealth
  }

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  )
}

export function useSupabase() {
  const context = useContext(SupabaseContext)
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider')
  }
  return context
}
