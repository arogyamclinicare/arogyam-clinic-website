/**
 * ADMIN CONSULTATIONS API
 * 
 * This is a server-side API endpoint for admin consultation operations.
 * In production, this should be deployed as a separate backend service
 * with access to the Supabase service role key.
 */

import { createClient } from '@supabase/supabase-js';

// Server-side Supabase client with service role key
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // This should NEVER be exposed to client
);

export interface Consultation {
  id: string;
  name: string;
  email: string;
  phone: string;
  patient_id?: string;
  treatment_type: string;
  preferred_date: string;
  preferred_time: string;
  status: string;
  created_at: string;
  updated_at: string;
  // Add other fields as needed
}

/**
 * GET /api/admin/consultations
 * Get all consultations with admin privileges
 */
export async function GET(request: Request) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdminAuth(request);
    if (!authResult.success) {
      return new Response(JSON.stringify({ error: authResult.error }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { data, error } = await supabase
      .from('consultations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return new Response(JSON.stringify({ error: 'Failed to fetch consultations' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ data }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * PATCH /api/admin/consultations/[id]/status
 * Update consultation status
 */
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdminAuth(request);
    if (!authResult.success) {
      return new Response(JSON.stringify({ error: authResult.error }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { status } = await request.json();

    const { data, error } = await supabase
      .from('consultations')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      return new Response(JSON.stringify({ error: 'Failed to update consultation' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ data }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * DELETE /api/admin/consultations/[id]
 * Delete consultation
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdminAuth(request);
    if (!authResult.success) {
      return new Response(JSON.stringify({ error: authResult.error }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { error } = await supabase
      .from('consultations')
      .delete()
      .eq('id', params.id);

    if (error) {
      return new Response(JSON.stringify({ error: 'Failed to delete consultation' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * Verify admin authentication
 * In production, this should use proper JWT verification
 */
async function verifyAdminAuth(request: Request): Promise<{ success: boolean; error?: string }> {
  try {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { success: false, error: 'Missing or invalid authorization header' };
    }

    const sessionId = authHeader.substring(7);
    
    // In production, verify the session ID against your session store
    // For now, we'll do a basic validation
    if (!sessionId || sessionId.length < 32) {
      return { success: false, error: 'Invalid session ID' };
    }

    // TODO: Implement proper session verification
    // This should check against a secure session store (Redis, database, etc.)
    
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Authentication verification failed' };
  }
}
