export interface Database {
  public: {
    Tables: {
      businesses: {
        Row: {
          id: string;
          name: string;
          type: 'salon' | 'clinic' | 'tuition' | 'consultant' | 'spa' | 'other';
          phone: string;
          email: string;
          address: string;
          whatsapp_number: string;
          timezone: string;
          is_active: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['businesses']['Row'], 'created_at'>;
        Update: Partial<Database['public']['Tables']['businesses']['Row']>;
      };
      services: {
        Row: {
          id: string;
          business_id: string;
          name: string;
          description: string;
          duration_minutes: number;
          price: number;
          deposit_amount: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['services']['Row'], 'created_at'>;
        Update: Partial<Database['public']['Tables']['services']['Row']>;
      };
      appointments: {
        Row: {
          id: string;
          business_id: string;
          service_id: string;
          service_name: string | null;
          staff_id: string | null;
          staff_name: string | null;
          patient_name: string;
          patient_phone: string;
          appointment_date: string;
          start_time: string;
          end_time: string;
          status: 'confirmed' | 'cancelled' | 'completed' | 'no_show';
          notes: string;
          deposit_paid: boolean;
          deposit_amount: number;
          source: 'whatsapp' | 'manual' | 'web';
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['appointments']['Row'], 'created_at'>;
        Update: Partial<Database['public']['Tables']['appointments']['Row']>;
      };
      patients: {
        Row: {
          id: string;
          business_id: string;
          name: string;
          phone: string;
          email: string;
          notes: string;
          visit_count: number;
          last_visit: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['patients']['Row'], 'created_at'>;
        Update: Partial<Database['public']['Tables']['patients']['Row']>;
      };
      staff: {
        Row: {
          id: string;
          business_id: string;
          name: string;
          phone: string;
          email: string;
          is_active: boolean;
        };
        Insert: Database['public']['Tables']['staff']['Row'];
        Update: Partial<Database['public']['Tables']['staff']['Row']>;
      };
      reminder_logs: {
        Row: {
          id: string;
          appointment_id: string;
          type: '24hr' | '1hr' | 'confirmation' | 'followup';
          sent_at: string;
          status: 'sent' | 'failed' | 'delivered';
        };
        Insert: Database['public']['Tables']['reminder_logs']['Row'];
        Update: Partial<Database['public']['Tables']['reminder_logs']['Row']>;
      };
    };
  };
}
