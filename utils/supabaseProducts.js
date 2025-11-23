import supabase from './supabaseClient';

export async function fetchProductsFromDB() {
  const { data, error } = await supabase.from('products').select('*').order('updated_at', { ascending: false });
  if (error) throw error;
  return data;
}

function dataUrlToBlob(dataUrl) {
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) u8arr[n] = bstr.charCodeAt(n);
  return new Blob([u8arr], { type: mime });
}

async function uploadMaybeDataUrl(imageFile) {
  if (!imageFile) return null;
  let fileToUpload = imageFile;
  // If imageFile is a data URL (base64), convert to Blob
  if (typeof imageFile === 'string' && imageFile.startsWith('data:')) {
    fileToUpload = dataUrlToBlob(imageFile);
  }
  // If it's a File/Blob, proceed
  const fileName = (imageFile && imageFile.name) ? imageFile.name : `img_${Date.now()}.jpg`;
  const path = `product-images/${Date.now()}_${fileName.replace(/\s+/g, '_')}`;
  const { data: up, error: upErr } = await supabase.storage.from('product-images').upload(path, fileToUpload, { cacheControl: '3600', upsert: false });
  if (upErr) throw upErr;
  const { data: pub } = supabase.storage.from('product-images').getPublicUrl(up.path);
  return pub.publicUrl;
}

export async function createProductDB(product, imageFile) {
  let image_url = product.image_url || null;
  if (imageFile) {
    image_url = await uploadMaybeDataUrl(imageFile);
  }
  const { data, error } = await supabase.from('products').insert([{ ...product, image_url }]).select();
  if (error) throw error;
  return data[0];
}

export async function updateProductDB(id, updates, imageFile) {
  let image_url = updates.image_url;
  if (imageFile) {
    image_url = await uploadMaybeDataUrl(imageFile);
  }
  const { data, error } = await supabase.from('products').update({ ...updates, image_url }).eq('id', id).select();
  if (error) throw error;
  return data[0];
}

export async function deleteProductDB(id) {
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
  return true;
}
