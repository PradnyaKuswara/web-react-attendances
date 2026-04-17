import { useEffect, useMemo, useRef, useState } from 'react'
import {
  IconCalendar,
  IconCamera,
  IconClock,
  IconMapPin,
  IconPhoto,
  IconRefresh,
  IconUpload,
  IconX,
} from '@tabler/icons-react'

type CaptureMode = 'camera' | 'upload'

const AttendancePage = () => {
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('Rumah')
  const [photo, setPhoto] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [currentTime, setCurrentTime] = useState(new Date())
  const [captureMode, setCaptureMode] = useState<CaptureMode>('camera')

  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null)
  const [cameraError, setCameraError] = useState('')
  const [isCameraStarting, setIsCameraStarting] = useState(false)

  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([])
  const [selectedDeviceId, setSelectedDeviceId] = useState('')

  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => window.clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!cameraStream || !videoRef.current) return

    videoRef.current.srcObject = cameraStream
    videoRef.current.play().catch((error) => {
      console.error('Gagal play video:', error)
      setCameraError('Video kamera gagal diputar.')
    })
  }, [cameraStream])

  useEffect(() => {
    if (captureMode !== 'camera') {
      stopCamera()
    }
  }, [captureMode])

  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [])

  useEffect(() => {
    return () => {
      if (preview?.startsWith('blob:')) {
        URL.revokeObjectURL(preview)
      }
    }
  }, [preview])

  const formattedDate = useMemo(
    () =>
      currentTime.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }),
    [currentTime]
  )

  const formattedTime = useMemo(
    () =>
      currentTime.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
    [currentTime]
  )

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop())
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null
    }

    setCameraStream(null)
  }

  const pickPreferredCamera = (devices: MediaDeviceInfo[]) => {
    if (devices.length === 0) return ''

    const preferred =
      devices.find((device) => {
        const label = device.label.toLowerCase()
        return (
          label.includes('integrated') ||
          label.includes('internal') ||
          label.includes('built-in') ||
          label.includes('builtin') ||
          label.includes('hd webcam') ||
          label.includes('facetime') ||
          label.includes('user facing')
        )
      }) || devices[0]

    return preferred.deviceId
  }

  const refreshDevices = async () => {
    try {
      const allDevices = await navigator.mediaDevices.enumerateDevices()
      const cameras = allDevices.filter((device) => device.kind === 'videoinput')
      setVideoDevices(cameras)

      if (!selectedDeviceId && cameras.length > 0) {
        setSelectedDeviceId(pickPreferredCamera(cameras))
      }
    } catch (error) {
      console.error('Gagal mengambil daftar kamera:', error)
    }
  }

  const startCamera = async (deviceId?: string) => {
    try {
      setCameraError('')
      setIsCameraStarting(true)

      stopCamera()

      const stream = await navigator.mediaDevices.getUserMedia({
        video: deviceId
          ? {
            deviceId: { exact: deviceId },
          }
          : {
            facingMode: { ideal: 'user' },
          },
        audio: false,
      })

      setCameraStream(stream)

      const allDevices = await navigator.mediaDevices.enumerateDevices()
      const cameras = allDevices.filter((device) => device.kind === 'videoinput')
      setVideoDevices(cameras)

      const activeTrack = stream.getVideoTracks()[0]
      const activeSettings = activeTrack?.getSettings()

      if (activeSettings?.deviceId) {
        setSelectedDeviceId(activeSettings.deviceId)
      } else if (!selectedDeviceId && cameras.length > 0) {
        setSelectedDeviceId(pickPreferredCamera(cameras))
      }
    } catch (error) {
      console.error(error)
      setCameraError('Kamera tidak bisa diakses. Pastikan izin kamera sudah diberikan.')
    } finally {
      setIsCameraStarting(false)
    }
  }

  const handleStartCamera = async () => {
    await startCamera(selectedDeviceId || undefined)
  }

  const handleRefreshCamera = async () => {
    await startCamera(selectedDeviceId || undefined)
  }

  const handleDeviceChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const deviceId = e.target.value
    setSelectedDeviceId(deviceId)

    if (captureMode === 'camera') {
      await startCamera(deviceId)
    }
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    if (!file) return

    if (preview?.startsWith('blob:')) {
      URL.revokeObjectURL(preview)
    }

    setPhoto(file)
    setPreview(URL.createObjectURL(file))
  }

  const dataURLToFile = (dataUrl: string, fileName: string) => {
    const arr = dataUrl.split(',')
    const mimeMatch = arr[0].match(/:(.*?);/)
    const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg'
    const bstr = atob(arr[1])
    let n = bstr.length
    const u8arr = new Uint8Array(n)

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }

    return new File([u8arr], fileName, { type: mime })
  }

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) {
      alert('Kamera belum siap.')
      return
    }

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    if (!context) {
      alert('Canvas tidak tersedia.')
      return
    }

    if (!video.videoWidth || !video.videoHeight) {
      alert('Video kamera belum siap sepenuhnya.')
      return
    }

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    const dataUrl = canvas.toDataURL('image/jpeg', 0.92)
    const fileName = `attendance-${Date.now()}.jpg`
    const file = dataURLToFile(dataUrl, fileName)

    if (preview?.startsWith('blob:')) {
      URL.revokeObjectURL(preview)
    }

    setPhoto(file)
    setPreview(dataUrl)
  }

  const removePhoto = () => {
    if (preview?.startsWith('blob:')) {
      URL.revokeObjectURL(preview)
    }

    setPhoto(null)
    setPreview(null)

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!description.trim()) {
      alert('Deskripsi aktivitas wajib diisi.')
      return
    }

    if (!photo) {
      alert('Foto bukti wajib diisi.')
      return
    }

    const attendanceDate = new Date()

    try {
      setIsSubmitting(true)

      const formData = new FormData()
      formData.append('description', description)
      formData.append('location', location)
      formData.append('attendanceDate', attendanceDate.toISOString())
      formData.append('photo', photo)

      // Ganti endpoint sesuai backend kamu
      // await fetch('/api/attendance', {
      //   method: 'POST',
      //   body: formData,
      // })

      console.log('Attendance payload:')
      console.log({
        description,
        location,
        attendanceDate: attendanceDate.toISOString(),
        photoName: photo.name,
        selectedDeviceId,
      })

      alert('Absen berhasil dikirim.')

      setDescription('')
      setLocation('Rumah')
      removePhoto()
    } catch (error) {
      console.error(error)
      alert('Terjadi kesalahan saat mengirim absen.')
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    refreshDevices()
  }, [])

  return (
    <section className="min-h-screen bg-base-200 px-4 py-6 md:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold md:text-3xl">Absensi Karyawan</h1>
          <p className="mt-2 text-sm text-base-content/70 md:text-base">
            Lakukan absensi harian dengan waktu real-time dan unggah bukti kerja dari rumah
            melalui kamera atau file foto.
          </p>
        </div>

        <div className="card border border-base-300 bg-base-100 shadow-sm">
          <div className="card-body">
            <div className="mb-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-base-300 bg-base-100 p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-base-content/70">
                  <IconCalendar size={18} />
                  <span>Tanggal Hari Ini</span>
                </div>
                <p className="text-base font-bold md:text-lg">{formattedDate}</p>
              </div>

              <div className="rounded-xl border border-base-300 bg-base-100 p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-base-content/70">
                  <IconClock size={18} />
                  <span>Jam Real-time</span>
                </div>
                <p className="text-base font-bold md:text-lg">{formattedTime}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold">Lokasi Bekerja</label>
                <label className="input input-bordered flex items-center gap-2">
                  <IconMapPin size={18} className="opacity-70" />
                  <input
                    type="text"
                    className="grow"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Contoh: Rumah"
                  />
                </label>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">Deskripsi Aktivitas</label>
                <textarea
                  className="textarea textarea-bordered min-h-32 w-full"
                  placeholder="Contoh: Mengerjakan revisi dashboard admin, meeting harian, dan testing fitur absensi."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div>
                <label className="mb-3 block text-sm font-semibold">Bukti Foto Absensi</label>

                <div className="mb-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    className={`btn btn-sm ${captureMode === 'camera' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setCaptureMode('camera')}
                  >
                    <IconCamera size={16} />
                    Ambil dari Kamera
                  </button>

                  <button
                    type="button"
                    className={`btn btn-sm ${captureMode === 'upload' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setCaptureMode('upload')}
                  >
                    <IconUpload size={16} />
                    Upload File
                  </button>
                </div>

                {captureMode === 'camera' && (
                  <div className="rounded-2xl border border-base-300 p-4">
                    <div className="mb-4">
                      <label className="mb-2 block text-sm font-semibold">Pilih Kamera</label>
                      <select
                        className="select select-bordered w-full"
                        value={selectedDeviceId}
                        onChange={handleDeviceChange}
                      >
                        {videoDevices.length === 0 ? (
                          <option value="">Belum ada kamera terdeteksi</option>
                        ) : (
                          videoDevices.map((device, index) => (
                            <option key={device.deviceId} value={device.deviceId}>
                              {device.label || `Kamera ${index + 1}`}
                            </option>
                          ))
                        )}
                      </select>
                    </div>

                    {!cameraStream ? (
                      <div className="space-y-3">
                        <div className="rounded-xl border border-dashed border-base-300 bg-base-200/40 px-4 py-10 text-center">
                          <IconCamera size={32} className="mx-auto mb-3 opacity-70" />
                          <p className="font-medium">Aktifkan kamera untuk mengambil foto</p>
                          <p className="mt-1 text-sm text-base-content/60">
                            Kalau kamera HP muncul, pilih kamera laptop dari dropdown di atas.
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={handleStartCamera}
                            disabled={isCameraStarting || videoDevices.length === 0}
                          >
                            {isCameraStarting ? 'Mengaktifkan Kamera...' : 'Nyalakan Kamera'}
                          </button>

                          <button
                            type="button"
                            className="btn btn-outline"
                            onClick={refreshDevices}
                          >
                            <IconRefresh size={16} />
                            Refresh Daftar Kamera
                          </button>
                        </div>

                        {cameraError && (
                          <div className="alert alert-error">
                            <span>{cameraError}</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="overflow-hidden rounded-xl bg-black">
                          <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className="h-[260px] w-full object-cover md:h-[380px]"
                          />
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <button type="button" className="btn btn-primary" onClick={capturePhoto}>
                            <IconCamera size={16} />
                            Capture Foto
                          </button>

                          <button
                            type="button"
                            className="btn btn-outline"
                            onClick={handleRefreshCamera}
                          >
                            <IconRefresh size={16} />
                            Refresh Kamera
                          </button>

                          <button type="button" className="btn btn-ghost" onClick={stopCamera}>
                            Matikan Kamera
                          </button>
                        </div>

                        {cameraError && (
                          <div className="alert alert-error">
                            <span>{cameraError}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {captureMode === 'upload' && (
                  <div className="rounded-2xl border border-base-300 p-4">
                    <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-base-300 bg-base-100 px-6 py-10 text-center transition hover:border-primary hover:bg-base-200/60">
                      <IconPhoto size={30} className="mb-3 opacity-70" />
                      <span className="font-medium">Klik untuk upload foto</span>
                      <span className="mt-1 text-sm text-base-content/60">
                        Format yang disarankan: JPG, JPEG, PNG
                      </span>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handlePhotoChange}
                      />
                    </label>
                  </div>
                )}

                <canvas ref={canvasRef} className="hidden" />

                {preview && (
                  <div className="mt-4 rounded-2xl border border-base-300 p-3">
                    <div className="relative overflow-hidden rounded-xl">
                      <img
                        src={preview}
                        alt="Preview bukti absen"
                        className="h-72 w-full object-cover"
                      />
                      <button
                        type="button"
                        className="btn btn-circle btn-sm absolute right-3 top-3"
                        onClick={removePhoto}
                        aria-label="Hapus foto"
                      >
                        <IconX size={16} />
                      </button>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold">
                          {photo?.name || 'Foto bukti absensi'}
                        </p>
                        <p className="text-xs text-base-content/60">
                          {photo ? `${(photo.size / 1024 / 1024).toFixed(2)} MB` : ''}
                        </p>
                      </div>

                      {captureMode === 'upload' && (
                        <label className="btn btn-outline btn-sm">
                          Ganti Foto
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handlePhotoChange}
                          />
                        </label>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="alert alert-info">
                <span>
                  Waktu yang akan tersimpan adalah waktu saat tombol kirim ditekan. Kamu juga bisa
                  memilih kamera laptop secara manual jika kamera HP ikut terdeteksi.
                </span>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className={`btn btn-primary min-w-40 ${isSubmitting ? 'btn-disabled' : ''}`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Mengirim...' : 'Kirim Absen'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AttendancePage