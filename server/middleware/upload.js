const multer = require('multer')
const streamifier = require('streamifier')
const cloudinary = require('../config/cloudinary')

// Use memory storage — we stream the buffer directly to Cloudinary
const storage = multer.memoryStorage()

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB max
  fileFilter(req, file, cb) {
    // Accept audio and common video mime types (browsers emit audio/webm)
    if (file.mimetype.startsWith('audio/') || file.mimetype.startsWith('video/')) {
      cb(null, true)
    } else {
      cb(new Error('Only audio files are accepted.'))
    }
  },
})

// Upload a buffer to Cloudinary and return { url, publicId }
function uploadToCloudinary(buffer, folder = 'choir-app', resourceType = 'video') {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: resourceType },
      (error, result) => {
        if (error) return reject(error)
        resolve({ url: result.secure_url, publicId: result.public_id })
      }
    )
    streamifier.createReadStream(buffer).pipe(stream)
  })
}

// Delete a Cloudinary asset by public ID
function deleteFromCloudinary(publicId, resourceType = 'video') {
  return cloudinary.uploader.destroy(publicId, { resource_type: resourceType })
}

module.exports = { upload, uploadToCloudinary, deleteFromCloudinary }
