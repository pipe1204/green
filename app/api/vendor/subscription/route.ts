import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Service role client for bypassing RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export async function POST(request: NextRequest) {
  try {
    const { plan, vendorId } = await request.json();

    // Validate input
    if (!plan || !vendorId) {
      return NextResponse.json(
        { error: "Plan y vendorId son requeridos" },
        { status: 400 }
      );
    }

    if (plan !== "starter" && plan !== "pro") {
      return NextResponse.json(
        { error: "Plan inválido. Debe ser 'starter' o 'pro'" },
        { status: 400 }
      );
    }

    // Get current user from session
    const authHeader = request.headers.get("cookie");
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            cookie: authHeader || "",
          },
        },
      }
    );

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    // Verify that the vendor belongs to the authenticated user
    const { data: vendor, error: vendorError } = await supabaseAdmin
      .from("vendors")
      .select("id, user_id")
      .eq("id", vendorId)
      .single();

    if (vendorError || !vendor) {
      return NextResponse.json(
        { error: "Vendedor no encontrado" },
        { status: 404 }
      );
    }

    if (vendor.user_id !== session.user.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    // Update subscription
    const { data, error } = await supabaseAdmin
      .from("vendors")
      .update({
        subscription_tier: plan,
        is_trial: false,
        trial_end_date: null,
        subscription_start_date: new Date().toISOString(),
      })
      .eq("id", vendorId)
      .select()
      .single();

    if (error) {
      console.error("Error updating subscription:", error);
      return NextResponse.json(
        { error: "Error al actualizar la suscripción" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      vendor: data,
    });
  } catch (error) {
    console.error("Error in subscription API:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
