import { createClient } from '@supabase/supabase-js';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Supabase config - utiliser les variables d'environnement Next.js ou Vite (pour compatibilité)
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://jlizwheftlnhoifbqeex.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpsaXp3aGVmdGxuaG9pZmJxZWV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA0ODY4NjIsImV4cCI6MjA0NjA2Mjg2Mn0.5Q9ND0aFIhAz4yHdEbJ95OQ-qkFSGKPLHWPH7SuLxdQ';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const DATA_DIR = join(__dirname, '..', 'public', 'data');

// Créer le dossier data s'il n'existe pas
if (!existsSync(DATA_DIR)) {
  mkdirSync(DATA_DIR, { recursive: true });
}

function writeJSON(filename, data) {
  const filepath = join(DATA_DIR, filename);
  writeFileSync(filepath, JSON.stringify(data, null, 2));
  console.log(`✅ ${filename} written (${data.length || Object.keys(data).length} items)`);
}

async function fetchServices() {
  console.log('📦 Fetching services from Supabase...');
  
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: true });
  
  if (error) {
    console.error('❌ Error fetching services:', error.message);
    return [];
  }
  
  return data || [];
}

async function fetchFAQs() {
  console.log('📦 Fetching FAQs from Supabase...');
  
  const { data, error } = await supabase
    .from('faqs')
    .select('*')
    .order('order', { ascending: true });
  
  if (error) {
    console.error('❌ Error fetching FAQs:', error.message);
    return [];
  }
  
  return data || [];
}

async function fetchTestimonials() {
  console.log('📦 Fetching testimonials from Supabase...');
  
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('❌ Error fetching testimonials:', error.message);
    return [];
  }
  
  return data || [];
}

async function fetchBlogPosts() {
  console.log('📦 Fetching blog posts from Supabase...');
  
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false });
  
  if (error) {
    console.error('❌ Error fetching blog posts:', error.message);
    return [];
  }
  
  return data || [];
}

async function main() {
  console.log('🚀 Starting prebuild - fetching data from Supabase...\n');
  
  try {
    // Fetch all data in parallel
    const [services, faqs, testimonials, blogPosts] = await Promise.all([
      fetchServices(),
      fetchFAQs(),
      fetchTestimonials(),
      fetchBlogPosts()
    ]);
    
    // Ne pas écraser les fichiers existants si Supabase a échoué
    if (services.length === 0) {
      console.log('⚠️  No services fetched - keeping existing files');
      console.log('   Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set');
      return;
    }
    
    // Write services.json
    writeJSON('services.json', services);
    
    // Write individual service files
    for (const service of services) {
      writeJSON(`service-${service.service_id}.json`, service);
    }
    
    // Create services-index.json (simplified version for listing)
    const servicesIndex = services.map(s => ({
      id: s.id,
      service_id: s.service_id,
      name: s.name,
      name_fr: s.name_fr,
      name_es: s.name_es,
      name_de: s.name_de,
      name_it: s.name_it,
      name_pt: s.name_pt,
      short_description: s.short_description,
      short_description_fr: s.short_description_fr,
      short_description_es: s.short_description_es,
      short_description_de: s.short_description_de,
      short_description_it: s.short_description_it,
      short_description_pt: s.short_description_pt,
      icon: s.icon,
      color: s.color,
      base_price: s.base_price,
      list_title: s.list_title,
      list_title_fr: s.list_title_fr,
      list_title_es: s.list_title_es,
      list_title_de: s.list_title_de,
      list_title_it: s.list_title_it,
      list_title_pt: s.list_title_pt,
      show_in_list: s.show_in_list
    }));
    writeJSON('services-index.json', servicesIndex);
    
    // Write FAQs (only if we got data)
    if (faqs.length > 0) {
      writeJSON('faqs.json', faqs);
    }
    
    // Write testimonials (only if we got data)
    if (testimonials.length > 0) {
      writeJSON('testimonials.json', testimonials);
    }
    
    // Write blog posts (only if we got data)
    if (blogPosts.length > 0) {
      writeJSON('blog-posts.json', blogPosts);
      
      // Create blog-index.json (simplified version for listing)
      const blogIndex = blogPosts.map(p => ({
        id: p.id,
        slug: p.slug,
        title: p.title,
        title_fr: p.title_fr,
        excerpt: p.excerpt,
        excerpt_fr: p.excerpt_fr,
        image: p.image,
        published_at: p.published_at,
        reading_time: p.reading_time,
        category: p.category
      }));
      writeJSON('blog-index.json', blogIndex);
    }
    
    console.log('\n✅ Prebuild complete! All data fetched from Supabase.\n');
    
  } catch (error) {
    console.error('❌ Prebuild failed:', error.message);
    console.log('⚠️  Keeping existing data files');
  }
}

main();
