// Helper function to generate Supabase Storage URLs for template examples
export function getSupabaseImageUrl(filename: string): string {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  
  if (!supabaseUrl) {
    console.warn('NEXT_PUBLIC_SUPABASE_URL not found, using placeholder')
    return `https://via.placeholder.com/400x500/f3f4f6/9ca3af?text=${encodeURIComponent(filename)}`
  }
  
  return `${supabaseUrl}/storage/v1/object/public/template-examples/${filename}`
}

// Template image mappings
export const TEMPLATE_IMAGE_URLS = {
  'birthday-cake': getSupabaseImageUrl('birthday-cake.jpg'),
  'birthday-cake-side': getSupabaseImageUrl('birthday-cake-side.jpg'), 
  'balloon-bright': getSupabaseImageUrl('balloon-bright.jpg'),
  'pet-figure': getSupabaseImageUrl('pet-figure.jpg'),
  'cartoon-style': getSupabaseImageUrl('cartoon-style.jpg'),
  'vintage-portrait': getSupabaseImageUrl('vintage-portrait.jpg'),
  'superhero': getSupabaseImageUrl('superhero.jpg'),
  'christmas-theme': getSupabaseImageUrl('christmas-theme.jpg'),
} as const