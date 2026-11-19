import { useState, useRef, useEffect } from 'react'
import { Mic, Square, Upload, X, Headphones } from 'lucide-react'

export default function AudioRecorder({ song, onSubmit, onClose }) {
  const [phase, setPhase] = useState('idle')
  const [error, setError] = useState('')
  const [refVolume, setRefVolume] = useState(0.7)
  const [elapsed, setElapsed] = useState(0)
  const [blob, setBlob] = useState(null)
  const [micLevel, setMicLevel] = useState(0)
  const [micVolume, setMicVolume] = useState(1.0)
  const audioCtxRef = useRef(null)
  const gainNodeRef = useRef(null)
  const micGainRef = useRef(null)
  const analyserRef = useRef(null)
  const rafRef = useRef(null)
  const mediaRecorderRef = useRef(null)
  const chunksRef = useRef([])
  const refAudioElRef = useRef(null)
  const timerRef = useRef(null)
  const previewRef = useRef(null)

  useEffect(() => { if (gainNodeRef.current) gainNodeRef.current.gain.value = refVolume }, [refVolume])
  useEffect(() => { if (micGainRef.current) micGainRef.current.gain.value = micVolume }, [micVolume])
  useEffect(() => () => stopEverything(), [])

  function startMeterLoop(analyser) {
    const data = new Uint8Array(analyser.frequencyBinCount)
    function tick() {
      analyser.getByteTimeDomainData(data)
      let sum = 0
      for (let i = 0; i < data.length; i++) {
        const val = (data[i] - 128) / 128
        sum += val * val
      }
      const rms = Math.sqrt(sum / data.length)
      setMicLevel(Math.min(100, Math.round(rms * 400)))
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
  }

  function stopMeterLoop() {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    setMicLevel(0)
  }

  function stopEverything() {
    clearInterval(timerRef.current)
    stopMeterLoop()
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') mediaRecorderRef.current.stop()
    if (refAudioElRef.current) { refAudioElRef.current.pause(); refAudioElRef.current.src = '' }
    if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') audioCtxRef.current.close()
  }

  async function startRecording() {
    setError(''); setElapsed(0); chunksRef.current = []
    try {
      const micStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false })
      const ctx = new AudioContext()
      audioCtxRef.current = ctx
      const destination = ctx.createMediaStreamDestination()
      const micSource = ctx.createMediaStreamSource(micStream)
      const micGain = ctx.createGain()
      micGain.gain.value = micVolume
      micGainRef.current = micGain
      const analyser = ctx.createAnalyser()
      analyser.fftSize = 256
      analyserRef.current = analyser
      micSource.connect(micGain)
      micGain.connect(analyser)
      micGain.connect(destination)
      if (song.referenceAudioUrl) {
        const refEl = new Audio()
        refEl.crossOrigin = 'anonymous'
        refEl.src = song.referenceAudioUrl
        refAudioElRef.current = refEl
        const gain = ctx.createGain()
        gain.gain.value = refVolume
        gainNodeRef.current = gain
        ctx.createMediaElementSource(refEl).connect(gain)
        gain.connect(destination)
        gain.connect(ctx.destination)
        refEl.play().catch(() => {})
      }
      const recorder = new MediaRecorder(destination.stream, { mimeType: 'audio/webm' })
      mediaRecorderRef.current = recorder
      recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data) }
      recorder.onstop = () => {
        stopMeterLoop()
        setBlob(new Blob(chunksRef.current, { type: 'audio/webm' }))
        setPhase('preview')
      }
      recorder.start(250)
      timerRef.current = setInterval(() => setElapsed((s) => s + 1), 1000)
      startMeterLoop(analyser)
      setPhase('recording')
    } catch (err) { setError('Microphone access denied: ' + err.message) }
  }

  function stopRecording() {
    clearInterval(timerRef.current)
    stopMeterLoop()
    if (refAudioElRef.current) refAudioElRef.current.pause()
    if (mediaRecorderRef.current?.state !== 'inactive') mediaRecorderRef.current.stop()
  }

  function handleDiscard() { stopEverything(); setBlob(null); setPhase('idle') }

  async function handleSubmit() {
    if (!blob) return
    setPhase('uploading'); setError('')
    try { await onSubmit(blob, song._id) }
    catch (err) { setError(err.response?.data?.error || err.message); setPhase('preview') }
  }

  const fmt = (s) => String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0')
  const BAR_COUNT = 10
  const activeBars = Math.round((micLevel / 100) * BAR_COUNT)
  const barColor = (i) => i >= 8 ? 'bg-red-500' : i >= 6 ? 'bg-yellow-400' : 'bg-green-500'
  const levelLabel = micLevel < 5 ? 'Silent' : micLevel < 30 ? 'Low' : micLevel < 70 ? 'Good' : micLevel < 90 ? 'Strong' : 'Too loud!'

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 flex flex-col gap-5">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-bold text-lg text-gray-900">{song.title}</h2>
            {song.composer && <p className="text-sm text-gray-500">{song.composer}</p>}
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>
        <div className="flex items-start gap-2 bg-indigo-50 border border-indigo-200 rounded-xl p-3 text-sm text-indigo-700">
          <Headphones size={18} className="shrink-0 mt-0.5" />
          <span>Use headphones so the backing track does not bleed into your mic.</span>
        </div>
        {song.referenceAudioUrl && (
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              Backing track volume: <span className="font-bold text-indigo-600">{Math.round(refVolume * 100)}%</span>
            </label>
            <input type="range" min={0} max={1} step={0.05} value={refVolume}
              onChange={(e) => setRefVolume(Number(e.target.value))} className="w-full accent-indigo-600" />
            {phase === 'idle' && <audio controls src={song.referenceAudioUrl} className="w-full h-9 mt-1" />}
          </div>
        )}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">
            Mic volume: <span className="font-bold text-indigo-600">{Math.round(micVolume * 100)}%</span>
          </label>
          <input type="range" min={0} max={2} step={0.05} value={micVolume}
            onChange={(e) => setMicVolume(Number(e.target.value))} className="w-full accent-red-500" />
        </div>
        <div className="flex flex-col items-center gap-3">
          {phase === 'idle' && (
            <button onClick={startRecording} className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-8 rounded-full text-sm transition">
              <Mic size={18} /> Start Recording
            </button>
          )}
          {phase === 'recording' && (
            <>
              <div className="flex items-center gap-2 text-red-500 font-mono text-2xl font-bold">
                <span className="w-3 h-3 rounded-full bg-red-500 inline-block animate-pulse" />{fmt(elapsed)}
              </div>
              <div className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5"><Mic size={14} className="text-gray-400" /><span className="text-xs font-semibold text-gray-500">Mic level</span></div>
                  <span className={'text-xs font-bold ' + (micLevel >= 90 ? 'text-red-500' : micLevel >= 60 ? 'text-yellow-500' : 'text-green-600')}>{levelLabel}</span>
                </div>
                <div className="flex items-end gap-0.5 h-8">
                  {Array.from({ length: BAR_COUNT }).map((_, i) => (<div key={i} style={{ height: (40 + i * 6) + '%' }} className={'flex-1 rounded-sm transition-all duration-75 ' + (i < activeBars ? barColor(i) : 'bg-gray-200')} />))}
                </div>
              </div>
              <button onClick={stopRecording} className="flex items-center gap-2 bg-gray-800 hover:bg-gray-900 text-white font-semibold py-3 px-8 rounded-full text-sm transition"><Square size={16} /> Stop Recording</button>
            </>
          )}
          {phase === 'preview' && (
            <>
              <p className="text-sm text-gray-600 font-medium">Preview your take before submitting.</p>
              <audio ref={previewRef} controls src={blob ? URL.createObjectURL(blob) : ''} className="w-full h-9" />
              <div className="flex gap-3 w-full">
                <button onClick={handleDiscard} className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold py-2 rounded-xl text-sm transition">Discard</button>
                <button onClick={handleSubmit} className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-xl text-sm transition"><Upload size={15} /> Submit</button>
              </div>
            </>
          )}
          {phase === 'uploading' && (<p className="text-sm text-indigo-600 font-medium animate-pulse">Uploading your recording...</p>)}
        </div>
        {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg p-3">{error}</p>}
      </div>
    </div>
  )
}