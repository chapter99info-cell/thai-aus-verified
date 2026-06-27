-- Thai-Aus Verified Community — Supabase Schema

-- Enable UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  line_id TEXT,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('member', 'verified_business', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Service providers table
CREATE TABLE service_providers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  business_name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('accommodation','jobs','visa','restaurant','massage','transport','tradesperson','photography','other')),
  description TEXT,
  address TEXT,
  suburb TEXT,
  state TEXT CHECK (state IN ('NSW','VIC','QLD','WA','SA','TAS','ACT','NT')),
  phone TEXT,
  line_id TEXT,
  website TEXT,
  facebook_url TEXT,
  abn_number TEXT NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  verified_at TIMESTAMPTZ,
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending','approved','rejected')),
  rating DECIMAL(3,2) DEFAULT 0,
  review_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- KYC documents table
CREATE TABLE kyc_documents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  provider_id UUID REFERENCES service_providers(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL CHECK (document_type IN ('abn_certificate','id_document','business_license','insurance')),
  file_url TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reviews table
CREATE TABLE reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  provider_id UUID REFERENCES service_providers(id) ON DELETE CASCADE,
  reviewer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(provider_id, reviewer_id)
);

-- Scam alerts table
CREATE TABLE scam_alerts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT,
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE kyc_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE scam_alerts ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read all, update own
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Service providers: public can read verified, owners can manage own
CREATE POLICY "Verified providers viewable by all" ON service_providers FOR SELECT USING (true);
CREATE POLICY "Owners can insert own business" ON service_providers FOR INSERT WITH CHECK (auth.uid() = profile_id);
CREATE POLICY "Owners can update own business" ON service_providers FOR UPDATE USING (auth.uid() = profile_id);

-- Reviews: members can write, all can read
CREATE POLICY "Reviews viewable by all" ON reviews FOR SELECT USING (true);
CREATE POLICY "Members can write reviews" ON reviews FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

-- Scam alerts: all can read published
CREATE POLICY "Published alerts viewable by all" ON scam_alerts FOR SELECT USING (is_published = true);

-- KYC: only owner and admin can view
CREATE POLICY "Owner can view own KYC" ON kyc_documents FOR SELECT USING (
  provider_id IN (SELECT id FROM service_providers WHERE profile_id = auth.uid())
);
CREATE POLICY "Owner can upload KYC" ON kyc_documents FOR INSERT WITH CHECK (
  provider_id IN (SELECT id FROM service_providers WHERE profile_id = auth.uid())
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', 'ผู้ใช้ใหม่'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
