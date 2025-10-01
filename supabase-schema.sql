-- Create custom types
CREATE TYPE vehicle_type AS ENUM ('motocicleta', 'patineta', 'bicicleta', 'carro', 'camion');
CREATE TYPE user_role AS ENUM ('customer', 'vendor', 'admin');

-- Create users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role user_role DEFAULT 'customer',
  phone TEXT,
  company_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create vendors table
CREATE TABLE public.vendors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  business_type TEXT, -- 'tienda', 'distribuidor', 'concesionario', 'fabricante'
  nit TEXT UNIQUE,
  address TEXT,
  city TEXT,
  department TEXT,
  state TEXT,
  country TEXT DEFAULT 'Colombia',
  phone TEXT,
  email TEXT,
  website TEXT,
  description TEXT,
  locations JSONB, -- Array of {address, department, city, isMain}
  is_verified BOOLEAN DEFAULT FALSE,
  rating DECIMAL(3,2) DEFAULT 0.00,
  total_reviews INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create vehicles table
CREATE TABLE public.vehicles (
  id TEXT PRIMARY KEY,
  vendor_id UUID REFERENCES public.vendors(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  type vehicle_type NOT NULL,
  price INTEGER NOT NULL,
  images JSONB, -- Array of {url, alt} objects
  specifications JSONB, -- {range, chargeTime, warranty: {type: 'years'|'km', value: number} OR string, battery, performance: {maxSpeed, power}}
  delivery_time TEXT,
  availability TEXT DEFAULT 'in-stock', -- 'in-stock', 'pre-order', 'coming-soon'
  passenger_capacity INTEGER,
  charging_time TEXT,
  max_speed TEXT,
  power TEXT,
  location TEXT,
  description TEXT,
  features TEXT[],
  dealer JSONB, -- {name, location, rating}
  reviews JSONB, -- {average, count}
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create test_drive_bookings table
CREATE TABLE public.test_drive_bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_id TEXT REFERENCES public.vehicles(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  vendor_id UUID REFERENCES public.vendors(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  preferred_date DATE,
  preferred_time TIME,
  message TEXT,
  status TEXT DEFAULT 'pending', -- 'pending', 'confirmed', 'completed', 'cancelled'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create contact_inquiries table
CREATE TABLE public.contact_inquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_id TEXT REFERENCES public.vehicles(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  vendor_id UUID REFERENCES public.vendors(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  message TEXT,
  status TEXT DEFAULT 'new', -- 'new', 'contacted', 'closed'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reviews table
CREATE TABLE public.reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_id TEXT REFERENCES public.vehicles(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  vendor_id UUID REFERENCES public.vendors(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create customer favorites table
CREATE TABLE public.customer_favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  vehicle_id TEXT REFERENCES public.vehicles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(customer_id, vehicle_id)
);

-- Create customer inquiries table
CREATE TABLE public.customer_inquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  vehicle_id TEXT REFERENCES public.vehicles(id) ON DELETE CASCADE,
  vendor_id UUID REFERENCES public.vendors(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'pending', -- 'pending', 'replied', 'closed'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create price alerts table
CREATE TABLE public.price_alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  vehicle_id TEXT REFERENCES public.vehicles(id) ON DELETE CASCADE,
  target_price INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_vehicles_vendor_id ON public.vehicles(vendor_id);
CREATE INDEX idx_vehicles_type ON public.vehicles(type);
CREATE INDEX idx_vehicles_price ON public.vehicles(price);
CREATE INDEX idx_vehicles_location ON public.vehicles(location);
CREATE INDEX idx_test_drive_bookings_vehicle_id ON public.test_drive_bookings(vehicle_id);
CREATE INDEX idx_test_drive_bookings_customer_id ON public.test_drive_bookings(customer_id);
CREATE INDEX idx_contact_inquiries_vehicle_id ON public.contact_inquiries(vehicle_id);
CREATE INDEX idx_customer_favorites_customer_id ON public.customer_favorites(customer_id);
CREATE INDEX idx_customer_favorites_vehicle_id ON public.customer_favorites(vehicle_id);
CREATE INDEX idx_customer_inquiries_customer_id ON public.customer_inquiries(customer_id);
CREATE INDEX idx_customer_inquiries_vehicle_id ON public.customer_inquiries(vehicle_id);
CREATE INDEX idx_price_alerts_customer_id ON public.price_alerts(customer_id);
CREATE INDEX idx_price_alerts_vehicle_id ON public.price_alerts(vehicle_id);

-- Row Level Security Policies

-- Profiles policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Vendors policies
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view vendors" ON public.vendors
  FOR SELECT USING (true);

CREATE POLICY "Vendors can update own vendor profile" ON public.vendors
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can create vendor profile" ON public.vendors
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Vehicles policies
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view vehicles" ON public.vehicles
  FOR SELECT USING (true);

CREATE POLICY "Vendors can manage own vehicles" ON public.vehicles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.vendors 
      WHERE vendors.id = vehicles.vendor_id 
      AND vendors.user_id = auth.uid()
    )
  );

-- Test drive bookings policies
ALTER TABLE public.test_drive_bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own bookings" ON public.test_drive_bookings
  FOR SELECT USING (auth.uid() = customer_id);

CREATE POLICY "Vendors can view bookings for their vehicles" ON public.test_drive_bookings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.vendors 
      WHERE vendors.id = test_drive_bookings.vendor_id 
      AND vendors.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create bookings" ON public.test_drive_bookings
  FOR INSERT WITH CHECK (auth.uid() = customer_id);

-- Contact inquiries policies
ALTER TABLE public.contact_inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own inquiries" ON public.contact_inquiries
  FOR SELECT USING (auth.uid() = customer_id);

CREATE POLICY "Vendors can view inquiries for their vehicles" ON public.contact_inquiries
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.vendors 
      WHERE vendors.id = contact_inquiries.vendor_id 
      AND vendors.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create inquiries" ON public.contact_inquiries
  FOR INSERT WITH CHECK (auth.uid() = customer_id);

-- Reviews policies
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view reviews" ON public.reviews
  FOR SELECT USING (true);

CREATE POLICY "Users can create reviews" ON public.reviews
  FOR INSERT WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Users can update own reviews" ON public.reviews
  FOR UPDATE USING (auth.uid() = customer_id);

-- Customer favorites policies
ALTER TABLE public.customer_favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers can view own favorites" ON public.customer_favorites
  FOR SELECT USING (auth.uid() = customer_id);

CREATE POLICY "Customers can add favorites" ON public.customer_favorites
  FOR INSERT WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Customers can remove own favorites" ON public.customer_favorites
  FOR DELETE USING (auth.uid() = customer_id);

-- Customer inquiries policies
ALTER TABLE public.customer_inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers can view own inquiries" ON public.customer_inquiries
  FOR SELECT USING (auth.uid() = customer_id);

CREATE POLICY "Vendors can view inquiries for their vehicles" ON public.customer_inquiries
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.vendors 
      WHERE vendors.id = customer_inquiries.vendor_id 
      AND vendors.user_id = auth.uid()
    )
  );

CREATE POLICY "Customers can create inquiries" ON public.customer_inquiries
  FOR INSERT WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Customers can update own inquiries" ON public.customer_inquiries
  FOR UPDATE USING (auth.uid() = customer_id);

-- Price alerts policies
ALTER TABLE public.price_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers can view own price alerts" ON public.price_alerts
  FOR SELECT USING (auth.uid() = customer_id);

CREATE POLICY "Customers can create price alerts" ON public.price_alerts
  FOR INSERT WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Customers can update own price alerts" ON public.price_alerts
  FOR UPDATE USING (auth.uid() = customer_id);

CREATE POLICY "Customers can delete own price alerts" ON public.price_alerts
  FOR DELETE USING (auth.uid() = customer_id);

-- Functions for automatic profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, avatar_url)
  VALUES (
    NEW.id, 
    NEW.email, 
    NEW.raw_user_meta_data->>'full_name',
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'customer'),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers to all tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_vendors_updated_at BEFORE UPDATE ON public.vendors
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON public.vehicles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_test_drive_bookings_updated_at BEFORE UPDATE ON public.test_drive_bookings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_contact_inquiries_updated_at BEFORE UPDATE ON public.contact_inquiries
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_customer_inquiries_updated_at BEFORE UPDATE ON public.customer_inquiries
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_price_alerts_updated_at BEFORE UPDATE ON public.price_alerts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
