export async function uploadImage(file) {
  if (!file) throw new Error('No file selected')
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

  if (!cloudName) throw new Error('Missing VITE_CLOUDINARY_CLOUD_NAME')
  if (!uploadPreset) throw new Error('Missing VITE_CLOUDINARY_UPLOAD_PRESET')

  const formData = new FormData()

  formData.append('file', file)

  formData.append('upload_preset', uploadPreset)

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
    method: 'POST',
    body: formData,
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    const message = data?.error?.message || 'Cloudinary upload failed'
    throw new Error(message)
  }

  if (!data?.secure_url) {
    throw new Error('Cloudinary did not return secure_url')
  }

  return data.secure_url
}