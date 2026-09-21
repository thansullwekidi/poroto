-- ============================================================
-- PORTFOLIO CMS — SUPABASE DATABASE SCHEMA
-- Muhammad Sulthan Fajri Rabbani
-- ============================================================
-- Jalankan script ini di Supabase SQL Editor
-- Dashboard Supabase → SQL Editor → New Query → Paste → Run
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABLE: settings
-- Website-wide settings & SEO
-- ============================================================
CREATE TABLE IF NOT EXISTS settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  website_name TEXT DEFAULT 'Sulthan Fajri',
  website_title TEXT DEFAULT 'Muhammad Sulthan Fajri Rabbani — Graphic Designer & Informatics Student',
  logo_url TEXT,
  favicon_url TEXT,
  primary_color TEXT DEFAULT '#06b6d4',
  secondary_color TEXT DEFAULT '#0891b2',
  font_family TEXT DEFAULT 'Inter',
  dark_mode BOOLEAN DEFAULT true,
  seo_title TEXT DEFAULT 'Muhammad Sulthan Fajri Rabbani — Portfolio',
  seo_description TEXT DEFAULT 'Portfolio Muhammad Sulthan Fajri Rabbani, Mahasiswa Informatika UIN Sultan Maulana Hasanuddin Banten sekaligus Graphic Designer.',
  seo_keywords TEXT DEFAULT 'graphic designer, informatika, portfolio, sulthan fajri, UIN Banten',
  og_image_url TEXT,
  social_github TEXT DEFAULT 'https://github.com/',
  social_instagram TEXT DEFAULT 'https://instagram.com/',
  social_linkedin TEXT DEFAULT 'https://linkedin.com/in/',
  social_twitter TEXT,
  social_youtube TEXT,
  social_behance TEXT,
  email TEXT DEFAULT 'sulthanfajri@email.com',
  whatsapp TEXT DEFAULT '+62',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: profile
-- Data profil utama admin
-- ============================================================
CREATE TABLE IF NOT EXISTS profile (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT DEFAULT 'Muhammad Sulthan Fajri Rabbani',
  nickname TEXT DEFAULT 'Sulthan Fajri',
  bio TEXT DEFAULT 'Mahasiswa Informatika & Graphic Designer',
  about_description TEXT DEFAULT 'Halo! Saya Muhammad Sulthan Fajri Rabbani, mahasiswa Program Studi Informatika di UIN Sultan Maulana Hasanuddin Banten sekaligus seorang Graphic Designer. Saya memiliki passion di bidang desain visual dan pengembangan web, dengan pengalaman dalam berbagai proyek desain grafis, branding, dan pengembangan aplikasi.',
  photo_url TEXT,
  location TEXT DEFAULT 'Banten, Indonesia',
  email TEXT DEFAULT 'sulthanfajri@email.com',
  whatsapp TEXT DEFAULT '+62',
  date_of_birth DATE,
  social_github TEXT DEFAULT 'https://github.com/',
  social_instagram TEXT DEFAULT 'https://instagram.com/',
  social_linkedin TEXT DEFAULT 'https://linkedin.com/in/',
  social_twitter TEXT,
  social_behance TEXT,
  social_youtube TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: hero
-- Konten hero section homepage
-- ============================================================
CREATE TABLE IF NOT EXISTS hero (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  greeting TEXT DEFAULT 'Halo, Saya',
  name TEXT DEFAULT 'Muhammad Sulthan Fajri Rabbani',
  headline TEXT DEFAULT 'Graphic Designer & Informatika Student',
  subtitle TEXT DEFAULT 'Mahasiswa Informatika · UIN Sultan Maulana Hasanuddin Banten',
  description TEXT DEFAULT 'Saya menciptakan solusi visual yang kreatif dan pengalaman digital yang berkesan. Mari berkolaborasi untuk mewujudkan ide Anda.',
  profile_image_url TEXT,
  background_image_url TEXT,
  primary_button_text TEXT DEFAULT 'Lihat Portfolio',
  primary_button_url TEXT DEFAULT '#projects',
  secondary_button_text TEXT DEFAULT 'Hubungi Saya',
  secondary_button_url TEXT DEFAULT '#contact',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: skills
-- Daftar skill dengan kategori
-- ============================================================
CREATE TABLE IF NOT EXISTS skills (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Design',
  icon_url TEXT,
  icon_name TEXT,
  description TEXT,
  display_order INT DEFAULT 0,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: projects
-- Portfolio projects
-- ============================================================
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT DEFAULT 'Design',
  short_description TEXT,
  full_description TEXT,
  thumbnail_url TEXT,
  project_date DATE,
  client TEXT,
  tools TEXT[], -- Array of tools
  technologies TEXT[], -- Array of technologies
  github_url TEXT,
  live_url TEXT,
  external_url TEXT,
  featured BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT false,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: project_images
-- Gallery gambar untuk setiap project
-- ============================================================
CREATE TABLE IF NOT EXISTS project_images (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: services
-- Layanan yang ditawarkan
-- ============================================================
CREATE TABLE IF NOT EXISTS services (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  icon TEXT DEFAULT 'Palette',
  title TEXT NOT NULL,
  description TEXT,
  featured BOOLEAN DEFAULT false,
  display_order INT DEFAULT 0,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: experiences
-- Riwayat pengalaman
-- ============================================================
CREATE TABLE IF NOT EXISTS experiences (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  position TEXT NOT NULL,
  organization TEXT NOT NULL,
  description TEXT,
  start_date DATE,
  end_date DATE,
  current BOOLEAN DEFAULT false,
  logo_url TEXT,
  display_order INT DEFAULT 0,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: education
-- Riwayat pendidikan
-- ============================================================
CREATE TABLE IF NOT EXISTS education (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  institution TEXT NOT NULL,
  program TEXT NOT NULL,
  description TEXT,
  start_year INT,
  end_year INT,
  current BOOLEAN DEFAULT false,
  logo_url TEXT,
  display_order INT DEFAULT 0,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: messages
-- Pesan dari contact form
-- ============================================================
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: navigation
-- Menu navigasi website
-- ============================================================
CREATE TABLE IF NOT EXISTS navigation (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  label TEXT NOT NULL,
  url TEXT NOT NULL,
  display_order INT DEFAULT 0,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: footer
-- Konten footer
-- ============================================================
CREATE TABLE IF NOT EXISTS footer (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  logo_url TEXT,
  description TEXT DEFAULT 'Graphic Designer & Informatics Student yang passionate dalam menciptakan solusi visual kreatif.',
  copyright TEXT DEFAULT '© 2024 Muhammad Sulthan Fajri Rabbani. All rights reserved.',
  show_social_links BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: resume
-- File CV yang dapat diupload
-- ============================================================
CREATE TABLE IF NOT EXISTS resume (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size BIGINT,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: admin_users
-- Daftar user yang memiliki akses admin
-- ============================================================
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  email TEXT NOT NULL,
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INDEXES untuk performa query
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_skills_published ON skills(published);
CREATE INDEX IF NOT EXISTS idx_skills_category ON skills(category);
CREATE INDEX IF NOT EXISTS idx_skills_display_order ON skills(display_order);

CREATE INDEX IF NOT EXISTS idx_projects_published ON projects(published);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);
CREATE INDEX IF NOT EXISTS idx_projects_display_order ON projects(display_order);

CREATE INDEX IF NOT EXISTS idx_project_images_project_id ON project_images(project_id);

CREATE INDEX IF NOT EXISTS idx_services_published ON services(published);
CREATE INDEX IF NOT EXISTS idx_services_display_order ON services(display_order);

CREATE INDEX IF NOT EXISTS idx_experiences_published ON experiences(published);
CREATE INDEX IF NOT EXISTS idx_experiences_display_order ON experiences(display_order);

CREATE INDEX IF NOT EXISTS idx_education_published ON education(published);
CREATE INDEX IF NOT EXISTS idx_education_display_order ON education(display_order);

CREATE INDEX IF NOT EXISTS idx_messages_read ON messages(read);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_navigation_published ON navigation(published);
CREATE INDEX IF NOT EXISTS idx_navigation_display_order ON navigation(display_order);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Aktifkan RLS pada semua tabel
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE navigation ENABLE ROW LEVEL SECURITY;
ALTER TABLE footer ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- HELPER FUNCTION: Check apakah user adalah admin
-- ============================================================
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users
    WHERE user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- RLS POLICIES: settings
-- ============================================================
DROP POLICY IF EXISTS "Public can read settings" ON settings;
CREATE POLICY "Public can read settings" ON settings
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin can manage settings" ON settings;
CREATE POLICY "Admin can manage settings" ON settings
  FOR ALL USING (is_admin());

-- ============================================================
-- RLS POLICIES: profile
-- ============================================================
DROP POLICY IF EXISTS "Public can read profile" ON profile;
CREATE POLICY "Public can read profile" ON profile
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin can manage profile" ON profile;
CREATE POLICY "Admin can manage profile" ON profile
  FOR ALL USING (is_admin());

-- ============================================================
-- RLS POLICIES: hero
-- ============================================================
DROP POLICY IF EXISTS "Public can read hero" ON hero;
CREATE POLICY "Public can read hero" ON hero
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin can manage hero" ON hero;
CREATE POLICY "Admin can manage hero" ON hero
  FOR ALL USING (is_admin());

-- ============================================================
-- RLS POLICIES: skills
-- ============================================================
DROP POLICY IF EXISTS "Public can read published skills" ON skills;
CREATE POLICY "Public can read published skills" ON skills
  FOR SELECT USING (published = true OR is_admin());

DROP POLICY IF EXISTS "Admin can manage skills" ON skills;
CREATE POLICY "Admin can manage skills" ON skills
  FOR ALL USING (is_admin());

-- ============================================================
-- RLS POLICIES: projects
-- ============================================================
DROP POLICY IF EXISTS "Public can read published projects" ON projects;
CREATE POLICY "Public can read published projects" ON projects
  FOR SELECT USING (published = true OR is_admin());

DROP POLICY IF EXISTS "Admin can manage projects" ON projects;
CREATE POLICY "Admin can manage projects" ON projects
  FOR ALL USING (is_admin());

-- ============================================================
-- RLS POLICIES: project_images
-- ============================================================
DROP POLICY IF EXISTS "Public can read project images" ON project_images;
CREATE POLICY "Public can read project images" ON project_images
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_images.project_id
      AND (projects.published = true OR is_admin())
    )
  );

DROP POLICY IF EXISTS "Admin can manage project images" ON project_images;
CREATE POLICY "Admin can manage project images" ON project_images
  FOR ALL USING (is_admin());

-- ============================================================
-- RLS POLICIES: services
-- ============================================================
DROP POLICY IF EXISTS "Public can read published services" ON services;
CREATE POLICY "Public can read published services" ON services
  FOR SELECT USING (published = true OR is_admin());

DROP POLICY IF EXISTS "Admin can manage services" ON services;
CREATE POLICY "Admin can manage services" ON services
  FOR ALL USING (is_admin());

-- ============================================================
-- RLS POLICIES: experiences
-- ============================================================
DROP POLICY IF EXISTS "Public can read published experiences" ON experiences;
CREATE POLICY "Public can read published experiences" ON experiences
  FOR SELECT USING (published = true OR is_admin());

DROP POLICY IF EXISTS "Admin can manage experiences" ON experiences;
CREATE POLICY "Admin can manage experiences" ON experiences
  FOR ALL USING (is_admin());

-- ============================================================
-- RLS POLICIES: education
-- ============================================================
DROP POLICY IF EXISTS "Public can read published education" ON education;
CREATE POLICY "Public can read published education" ON education
  FOR SELECT USING (published = true OR is_admin());

DROP POLICY IF EXISTS "Admin can manage education" ON education;
CREATE POLICY "Admin can manage education" ON education
  FOR ALL USING (is_admin());

-- ============================================================
-- RLS POLICIES: messages
-- Public dapat INSERT (kirim pesan), hanya admin yang bisa READ
-- ============================================================
DROP POLICY IF EXISTS "Public can send messages" ON messages;
CREATE POLICY "Public can send messages" ON messages
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admin can read messages" ON messages;
CREATE POLICY "Admin can read messages" ON messages
  FOR SELECT USING (is_admin());

DROP POLICY IF EXISTS "Admin can update messages" ON messages;
CREATE POLICY "Admin can update messages" ON messages
  FOR UPDATE USING (is_admin());

DROP POLICY IF EXISTS "Admin can delete messages" ON messages;
CREATE POLICY "Admin can delete messages" ON messages
  FOR DELETE USING (is_admin());

-- ============================================================
-- RLS POLICIES: navigation
-- ============================================================
DROP POLICY IF EXISTS "Public can read published navigation" ON navigation;
CREATE POLICY "Public can read published navigation" ON navigation
  FOR SELECT USING (published = true OR is_admin());

DROP POLICY IF EXISTS "Admin can manage navigation" ON navigation;
CREATE POLICY "Admin can manage navigation" ON navigation
  FOR ALL USING (is_admin());

-- ============================================================
-- RLS POLICIES: footer
-- ============================================================
DROP POLICY IF EXISTS "Public can read footer" ON footer;
CREATE POLICY "Public can read footer" ON footer
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin can manage footer" ON footer;
CREATE POLICY "Admin can manage footer" ON footer
  FOR ALL USING (is_admin());

-- ============================================================
-- RLS POLICIES: resume
-- ============================================================
DROP POLICY IF EXISTS "Public can read resume" ON resume;
CREATE POLICY "Public can read resume" ON resume
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin can manage resume" ON resume;
CREATE POLICY "Admin can manage resume" ON resume
  FOR ALL USING (is_admin());

-- ============================================================
-- RLS POLICIES: admin_users
-- ============================================================
DROP POLICY IF EXISTS "Admin can read admin users" ON admin_users;
CREATE POLICY "Admin can read admin users" ON admin_users
  FOR SELECT USING (is_admin() OR user_id = auth.uid());

DROP POLICY IF EXISTS "Admin can manage admin users" ON admin_users;
CREATE POLICY "Admin can manage admin users" ON admin_users
  FOR ALL USING (is_admin());

-- ============================================================
-- STORAGE BUCKETS CONFIGURATION
-- Buat bucket di: Storage → New Bucket
-- ============================================================
-- Catatan: Buat bucket berikut secara manual di Supabase Dashboard
-- atau jalankan SQL berikut jika menggunakan Supabase Storage API

INSERT INTO storage.buckets (id, name, public) VALUES
  ('profile-images', 'profile-images', true),
  ('project-images', 'project-images', true),
  ('skill-icons', 'skill-icons', true),
  ('service-icons', 'service-icons', true),
  ('logos', 'logos', true),
  ('resume', 'resume', true),
  ('general', 'general', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies: Public dapat melihat semua file
CREATE POLICY "Public read access" ON storage.objects
  FOR SELECT USING (bucket_id IN ('profile-images', 'project-images', 'skill-icons', 'service-icons', 'logos', 'resume', 'general'));

-- Storage Policies: Admin dapat upload, update, delete
CREATE POLICY "Admin upload access" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id IN ('profile-images', 'project-images', 'skill-icons', 'service-icons', 'logos', 'resume', 'general')
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Admin update access" ON storage.objects
  FOR UPDATE USING (
    bucket_id IN ('profile-images', 'project-images', 'skill-icons', 'service-icons', 'logos', 'resume', 'general')
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Admin delete access" ON storage.objects
  FOR DELETE USING (
    bucket_id IN ('profile-images', 'project-images', 'skill-icons', 'service-icons', 'logos', 'resume', 'general')
    AND auth.role() = 'authenticated'
  );

-- ============================================================
-- SEED DATA AWAL
-- ============================================================

-- Settings
INSERT INTO settings (website_name, website_title, seo_title, seo_description, seo_keywords, email, whatsapp)
VALUES (
  'Sulthan Fajri',
  'Muhammad Sulthan Fajri Rabbani — Portfolio',
  'Muhammad Sulthan Fajri Rabbani — Graphic Designer & Informatics Student',
  'Portfolio resmi Muhammad Sulthan Fajri Rabbani, Mahasiswa Informatika UIN Sultan Maulana Hasanuddin Banten sekaligus Graphic Designer.',
  'graphic designer, informatika, portfolio, sulthan fajri, UIN Banten, desain grafis',
  'sulthanfajri@email.com',
  '+62'
);

-- Profile
INSERT INTO profile (name, nickname, bio, about_description, location, email, whatsapp)
VALUES (
  'Muhammad Sulthan Fajri Rabbani',
  'Sulthan Fajri',
  'Mahasiswa Informatika & Graphic Designer',
  'Halo! Saya Muhammad Sulthan Fajri Rabbani, mahasiswa Program Studi Informatika di UIN Sultan Maulana Hasanuddin Banten sekaligus seorang Graphic Designer. Saya memiliki passion di bidang desain visual dan pengembangan web, dengan pengalaman dalam berbagai proyek desain grafis, branding, dan pengembangan aplikasi.\n\nSaya percaya bahwa desain yang baik bukan hanya tentang estetika, tetapi juga tentang bagaimana sebuah karya mampu menyampaikan pesan dengan jelas dan efektif. Mari berkolaborasi untuk mewujudkan ide-ide kreatif Anda!',
  'Banten, Indonesia',
  'sulthanfajri@email.com',
  '+62'
);

-- Hero
INSERT INTO hero (greeting, name, headline, subtitle, description, primary_button_text, primary_button_url, secondary_button_text, secondary_button_url)
VALUES (
  'Halo, Saya',
  'Muhammad Sulthan Fajri Rabbani',
  'Graphic Designer & Informatics Student',
  'Mahasiswa Informatika · UIN Sultan Maulana Hasanuddin Banten',
  'Saya menciptakan solusi visual yang kreatif dan pengalaman digital yang berkesan. Dari desain grafis hingga pengembangan web, mari berkolaborasi untuk mewujudkan ide Anda menjadi kenyataan.',
  'Lihat Portfolio',
  '#projects',
  'Hubungi Saya',
  '#contact'
);

-- Navigation
INSERT INTO navigation (label, url, display_order, published) VALUES
  ('Beranda', '/', 1, true),
  ('Tentang', '#about', 2, true),
  ('Keahlian', '#skills', 3, true),
  ('Portfolio', '#projects', 4, true),
  ('Pengalaman', '#experience', 5, true),
  ('Kontak', '#contact', 6, true);

-- Footer
INSERT INTO footer (description, copyright)
VALUES (
  'Graphic Designer & Informatics Student yang passionate dalam menciptakan solusi visual kreatif dan pengalaman digital yang berkesan.',
  '© 2024 Muhammad Sulthan Fajri Rabbani. All rights reserved.'
);

-- Skills — Design
INSERT INTO skills (name, category, icon_name, display_order, published) VALUES
  ('Adobe Illustrator', 'Design', 'Figma', 1, true),
  ('Adobe Photoshop', 'Design', 'Image', 2, true),
  ('Adobe Premiere Pro', 'Design', 'Video', 3, true),
  ('Adobe After Effects', 'Design', 'Layers', 4, true),
  ('Adobe Lightroom', 'Design', 'Camera', 5, true),
  ('Adobe InDesign', 'Design', 'FileText', 6, true),
  ('CorelDRAW', 'Design', 'PenTool', 7, true),
  ('Canva', 'Design', 'Palette', 8, true),
  ('CapCut', 'Design', 'Film', 9, true);

-- Skills — Programming
INSERT INTO skills (name, category, icon_name, display_order, published) VALUES
  ('HTML', 'Programming', 'Code', 10, true),
  ('CSS', 'Programming', 'Code2', 11, true),
  ('JavaScript', 'Programming', 'Terminal', 12, true),
  ('Python', 'Programming', 'Terminal', 13, true),
  ('Java', 'Programming', 'Coffee', 14, true),
  ('PHP', 'Programming', 'Server', 15, true),
  ('MySQL', 'Programming', 'Database', 16, true),
  ('Git/GitHub', 'Programming', 'GitBranch', 17, true);

-- Services
INSERT INTO services (icon, title, description, featured, display_order, published) VALUES
  ('Palette', 'Graphic Design', 'Desain grafis profesional untuk kebutuhan bisnis, media sosial, poster, brosur, dan materi promosi lainnya dengan estetika yang menarik.', true, 1, true),
  ('Layers', 'Branding & Identity', 'Pembangunan identitas brand yang kuat dan konsisten, termasuk logo, color palette, typography, dan brand guidelines.', true, 2, true),
  ('PenTool', 'Logo Design', 'Desain logo yang unik, memorable, dan merepresentasikan nilai serta visi bisnis Anda dengan tepat.', false, 3, true),
  ('Monitor', 'UI/UX Design', 'Perancangan antarmuka dan pengalaman pengguna yang intuitif, menarik, dan user-friendly untuk website maupun aplikasi.', true, 4, true),
  ('Code', 'Web Development', 'Pengembangan website modern yang responsive, cepat, dan fungsional menggunakan teknologi terkini.', false, 5, true),
  ('Layout', 'Front-End Development', 'Implementasi antarmuka website yang pixel-perfect dengan HTML, CSS, JavaScript, dan framework modern.', false, 6, true);

-- Education
INSERT INTO education (institution, program, description, start_year, current, display_order, published) VALUES
  ('UIN Sultan Maulana Hasanuddin Banten', 'Program Studi Informatika', 'Menempuh pendidikan di bidang Informatika, mempelajari pemrograman, sistem informasi, rekayasa perangkat lunak, dan teknologi informasi terkini.', 2022, true, 1, true);
