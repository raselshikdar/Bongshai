import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse IPN data (can be POST form data or query params)
    let ipnData: Record<string, string> = {};
    
    if (req.method === 'POST') {
      const contentType = req.headers.get('content-type') || '';
      if (contentType.includes('application/x-www-form-urlencoded')) {
        const formData = await req.formData();
        formData.forEach((value, key) => {
          ipnData[key] = value.toString();
        });
      } else {
        ipnData = await req.json();
      }
    } else {
      const url = new URL(req.url);
      url.searchParams.forEach((value, key) => {
        ipnData[key] = value;
      });
    }

    console.log('SSLCommerz IPN received:', JSON.stringify(ipnData));

    const transactionId = ipnData.tran_id;
    const status = ipnData.status;
    const valId = ipnData.val_id;
    const amount = ipnData.amount;
    const bankTranId = ipnData.bank_tran_id;

    if (!transactionId) {
      console.error('No transaction ID in IPN');
      return new Response('No transaction ID', { status: 400, headers: corsHeaders });
    }

    // Initialize Supabase with service role for admin operations
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Check if order exists
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('id, status, total_price')
      .eq('id', transactionId)
      .maybeSingle();

    if (orderError || !order) {
      console.error('Order not found:', transactionId, orderError);
      return new Response('Order not found', { status: 404, headers: corsHeaders });
    }

    // Verify the payment with SSLCommerz if VALID status
    if (status === 'VALID' && valId) {
      const storeId = Deno.env.get('SSLCOMMERZ_STORE_ID');
      const storePassword = Deno.env.get('SSLCOMMERZ_STORE_PASSWORD');

      // Validate transaction
      const validateUrl = `https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php?val_id=${valId}&store_id=${storeId}&store_passwd=${storePassword}&format=json`;
      
      const validateResponse = await fetch(validateUrl);
      const validateResult = await validateResponse.json();

      console.log('SSLCommerz validation result:', JSON.stringify(validateResult));

      if (validateResult.status === 'VALID' || validateResult.status === 'VALIDATED') {
        // Update order status to processing (paid)
        const { error: updateError } = await supabase
          .from('orders')
          .update({ 
            status: 'processing',
            admin_notes: `Online payment successful. Bank Tran ID: ${bankTranId || 'N/A'}, Val ID: ${valId}`
          })
          .eq('id', transactionId);

        if (updateError) {
          console.error('Failed to update order:', updateError);
        } else {
          console.log('Order updated successfully:', transactionId);
        }
      }
    } else if (status === 'FAILED' || status === 'CANCELLED') {
      // Update order notes
      const { error: updateError } = await supabase
        .from('orders')
        .update({ 
          admin_notes: `Payment ${status.toLowerCase()}. Reason: ${ipnData.error || 'N/A'}`
        })
        .eq('id', transactionId);

      if (updateError) {
        console.error('Failed to update order notes:', updateError);
      }
    }

    return new Response('IPN Received', { status: 200, headers: corsHeaders });

  } catch (error) {
    console.error('Error in sslcommerz-ipn:', error);
    return new Response('Internal server error', { status: 500, headers: corsHeaders });
  }
});
