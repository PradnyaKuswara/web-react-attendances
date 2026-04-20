import { useEffect, useMemo, useRef, useState } from 'react'
import {
  IconAlertCircle,
  IconCalendar,
  IconCamera,
  IconClock,
  IconLogin2,
  IconLogout2,
  IconMapPin,
  IconPhoto,
  IconRefresh,
  IconUpload,
  IconX,
} from '@tabler/icons-react'
import type { AttendanceInput } from '../../@types/attendance'
import useAttendanceViewModel from './useAttendanceViewModel'
import { formattedDateCurrent, formattedDateTimeCurrent, formattedTimeCurrent } from '@/helpers/helper'
import FileModel from '@/models/FileModel'
import { toast } from 'react-toastify'
import { useAuth } from '@/hooks/useAuth'
import { ROUTE } from '@/shared/constants/constantRoute'
import { useNavigate } from 'react-router-dom'

type CaptureMode = 'camera' | 'upload'

const AttendancePage = () => {
  const { form, onAttendance, onCheckoutAttendance } = useAttendanceViewModel()
  const { user, refetch, attendance } = useAuth()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = form

  const [currentTime, setCurrentTime] = useState(new Date())
  const [captureMode, setCaptureMode] = useState<CaptureMode>('camera')

  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null)
  const [cameraError, setCameraError] = useState('')
  const [isCameraStarting, setIsCameraStarting] = useState(false)

  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([])
  const [selectedDeviceId, setSelectedDeviceId] = useState('')

  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false)

  const [locationError, setLocationError] = useState('')
  const [deviceLocation, setDeviceLocation] = useState<{
    latitude: number
    longitude: number
  } | null>(null)

  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const photoUrl = watch('photo_url')

  const isCheckoutMode = useMemo(() => {
    return Boolean(attendance?.check_in_at) && !attendance?.check_out_at
  }, [attendance?.check_in_at, attendance?.check_out_at])

  const currentStepLabel = isCheckoutMode ? 'Checkout Absensi' : 'Check-in Absensi'
  const submitButtonLabel =
    isSubmitting || isUploadingPhoto
      ? 'Mengirim...'
      : isCheckoutMode
        ? 'Kirim Checkout'
        : 'Kirim Check-in'

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

  const setPhotoFile = (file: File | null, previewUrl: string | null) => {
    if (preview?.startsWith('blob:')) {
      URL.revokeObjectURL(preview)
    }

    setSelectedPhoto(file)
    setPreview(previewUrl)

    setValue('photo_url', '', {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    })
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    if (!file) return

    const objectUrl = URL.createObjectURL(file)
    setPhotoFile(file, objectUrl)
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

    setPhotoFile(file, dataUrl)
  }

  const removePhoto = () => {
    if (preview?.startsWith('blob:')) {
      URL.revokeObjectURL(preview)
    }

    setSelectedPhoto(null)
    setPreview(null)

    setValue('photo_url', '', {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    })

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const getCurrentLocation = async (): Promise<{ latitude: number; longitude: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Browser tidak mendukung geolocation'))
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
        },
        (error) => {
          let message = 'Gagal mengambil lokasi device'

          switch (error.code) {
            case 1:
              message = 'Izin lokasi ditolak user'
              break
            case 2:
              message = 'Lokasi tidak tersedia'
              break
            case 3:
              message = 'Permintaan lokasi timeout'
              break
          }

          reject(new Error(message))
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      )
    })
  }

  const handleRefreshLocation = async () => {
    try {
      setLocationError('')
      const coords = await getCurrentLocation()
      setDeviceLocation(coords)

      if (isCheckoutMode) {
        setValue('check_out_latitude', coords.latitude as never, {
          shouldValidate: true,
          shouldDirty: true,
        })
        setValue('check_out_longitude', coords.longitude as never, {
          shouldValidate: true,
          shouldDirty: true,
        })
      } else {
        setValue('check_in_latitude', coords.latitude, {
          shouldValidate: true,
          shouldDirty: true,
        })
        setValue('check_in_longitude', coords.longitude, {
          shouldValidate: true,
          shouldDirty: true,
        })
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Gagal mengambil lokasi'
      setLocationError(message)
    }
  }

  const uploadImageToS3 = async (file: File): Promise<string> => {
    const response = await FileModel.uploadFile(file)

    if (response.statusCode !== 200) {
      throw new Error('Gagal upload foto ke S3')
    }

    return response.data?.url || response.url
  }

  const onSubmit = async (values: AttendanceInput) => {
    try {
      setLocationError('')

      if (!selectedPhoto) {
        toast.error('Foto wajib diisi.')
        return
      }

      const coords = await getCurrentLocation()
      setDeviceLocation(coords)

      setIsUploadingPhoto(true)
      const uploadedPhotoUrl = await uploadImageToS3(selectedPhoto)

      if (isCheckoutMode) {
        const checkoutPayload: AttendanceInput = {
          ...values,
          user_id: user?.id ?? 0,
          check_out_latitude: coords.latitude as never,
          check_out_longitude: coords.longitude as never,
          photo_url: uploadedPhotoUrl,
        }

        const result = await onCheckoutAttendance(checkoutPayload)

        if (result instanceof Error) {
          toast.error(result.message)
          return
        }

        toast.success('Checkout berhasil dikirim.')
      } else {
        const checkinPayload: AttendanceInput = {
          ...values,
          user_id: user?.id ?? 0,
          check_in_latitude: coords.latitude,
          check_in_longitude: coords.longitude,
          photo_url: uploadedPhotoUrl,
        }

        const result = await onAttendance(checkinPayload)

        if (result instanceof Error) {
          toast.error(result.message)
          return
        }

        toast.success('Check-in berhasil dikirim.')
      }

      reset({
        check_in_latitude: undefined,
        check_in_longitude: undefined,
        check_out_latitude: undefined as never,
        check_out_longitude: undefined as never,
        notes: '',
        photo_url: '',
      })

      setDeviceLocation(null)
      removePhoto()
      refetch(true)
      navigate(ROUTE.home.path)
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Terjadi kesalahan saat mengirim absen.'
      alert(message)
    } finally {
      setIsUploadingPhoto(false)
    }
  }

  useEffect(() => {
    refreshDevices()
  }, [])

  return (
    <section className="min-h-screen bg-base-200 px-4 py-6 md:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <div className={`badge ${isCheckoutMode ? 'badge-warning' : 'badge-primary'} badge-outline`}>
              {currentStepLabel}
            </div>

            {attendance?.check_in_at && !attendance?.check_out_at && (
              <div className="badge badge-info badge-outline">
                Sudah check-in, lanjut checkout
              </div>
            )}
          </div>

          <h1 className="text-2xl font-bold md:text-3xl">Absensi Karyawan</h1>
          <p className="mt-2 text-sm text-base-content/70 md:text-base">
            {isCheckoutMode
              ? 'Anda sudah melakukan check-in. Saat ini Anda berada di tahap checkout absensi. Submit form ini akan memproses checkout.'
              : 'Lakukan check-in harian dengan waktu real-time, lokasi device, dan unggah bukti foto melalui kamera atau file.'}
          </p>
        </div>

        {isCheckoutMode && (
          <div className="alert alert-warning mb-6 rounded-2xl shadow-sm">
            <IconAlertCircle size={20} />
            <div>
              <div className="font-semibold">Mode Checkout Aktif</div>
              <div className="text-sm">
                Anda sudah memiliki data check-in pada{' '}
                {attendance?.check_in_at ? formattedDateTimeCurrent(attendance?.check_in_at) : '-'}.
                Saat tombol submit ditekan, sistem akan memanggil API checkout.
              </div>
            </div>
          </div>
        )}

        <div className="card border border-base-300 bg-base-100 shadow-sm">
          <div className="card-body">
            <div className="mb-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-base-300 bg-base-100 p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-base-content/70">
                  <IconCalendar size={18} />
                  <span>Tanggal Hari Ini</span>
                </div>
                <p className="text-base font-bold md:text-lg">{formattedDateCurrent(currentTime)}</p>
              </div>

              <div className="rounded-xl border border-base-300 bg-base-100 p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-base-content/70">
                  <IconClock size={18} />
                  <span>Jam Real-time</span>
                </div>
                <p className="text-base font-bold md:text-lg">{formattedTimeCurrent(currentTime)}</p>
              </div>
            </div>

            {(attendance?.check_in_at || attendance?.check_out_at) && (
              <div className="mb-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-xl bg-primary/10 p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-base-content/70">
                    <IconLogin2 size={18} />
                    <span>Check-in Tercatat</span>
                  </div>
                  <p className="text-base font-bold text-primary md:text-lg">
                    {attendance?.check_in_at ? formattedDateTimeCurrent(attendance.check_in_at) : '-'}
                  </p>
                </div>

                <div className="rounded-xl bg-secondary/10 p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-base-content/70">
                    <IconLogout2 size={18} />
                    <span>Check-out Tercatat</span>
                  </div>
                  <p className="text-base font-bold text-secondary md:text-lg">
                    {attendance?.check_out_at ? formattedDateTimeCurrent(attendance.check_out_at) : '-'}
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label className="block text-sm font-semibold">Lokasi Device</label>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={handleRefreshLocation}
                  >
                    <IconRefresh size={16} />
                    Ambil Lokasi
                  </button>
                </div>

                <div className="rounded-xl border border-base-300 bg-base-100 p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-base-content/70">
                    <IconMapPin size={18} />
                    <span>Koordinat Saat Ini</span>
                  </div>

                  {deviceLocation ? (
                    <div className="space-y-1 text-sm">
                      <p>
                        <span className="font-semibold">Latitude:</span> {deviceLocation.latitude}
                      </p>
                      <p>
                        <span className="font-semibold">Longitude:</span> {deviceLocation.longitude}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-base-content/60">
                      Lokasi belum diambil. Saat submit sistem akan mencoba mengambil lokasi
                      otomatis.
                    </p>
                  )}

                  {locationError && <p className="mt-2 text-sm text-error">{locationError}</p>}
                </div>
              </div>

              <input type="hidden" {...register('check_in_latitude')} />
              <input type="hidden" {...register('check_in_longitude')} />
              <input type="hidden" {...register('photo_url')} />

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  {isCheckoutMode ? 'Catatan Checkout / Aktivitas' : 'Catatan / Aktivitas'}
                </label>
                <textarea
                  className="textarea textarea-bordered min-h-32 w-full"
                  placeholder={
                    isCheckoutMode
                      ? 'Contoh: Menyelesaikan task harian, finalisasi revisi, closing pekerjaan hari ini.'
                      : 'Contoh: Meeting harian, revisi dashboard admin, testing fitur absensi.'
                  }
                  {...register('notes')}
                />
                {errors.notes && (
                  <p className="mt-1 text-sm text-error">{String(errors.notes.message)}</p>
                )}
              </div>

              <div>
                <label className="mb-3 block text-sm font-semibold">
                  Bukti Foto {isCheckoutMode ? 'Checkout' : 'Absensi'}
                </label>

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

                {errors.photo_url && (
                  <p className="mt-2 text-sm text-error">{String(errors.photo_url.message)}</p>
                )}

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
                          {selectedPhoto?.name || 'Foto bukti absensi'}
                        </p>
                        <p className="text-xs text-base-content/60">
                          {selectedPhoto ? `${(selectedPhoto.size / 1024 / 1024).toFixed(2)} MB` : ''}
                        </p>
                        {photoUrl && (
                          <p className="mt-1 text-xs text-success">Foto siap diupload saat submit</p>
                        )}
                      </div>

                      {captureMode === 'upload' && (
                        <label className="btn btn-outline btn-sm">
                          Ganti Foto
                          <input
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

              <div className="flex justify-end">
                <button
                  type="submit"
                  className={`btn min-w-40 ${isCheckoutMode ? 'btn-warning' : 'btn-primary'}`}
                  disabled={isSubmitting || isUploadingPhoto}
                >
                  {submitButtonLabel}
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