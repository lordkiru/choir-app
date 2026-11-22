import { useState, useRef, useEffect } from 'react'
import { Mic, Square, Upload, X, Headphones } from 'lucide-react'

export default function AudioRecorder({ song, onSubmit, onClose }) {
  const [phase, setPhase] = useState('idle')
  const [error, setError] = useState('')
  const [refVolume, setRefVolume] = useState(0.7)
  const [micVolume, setMicVolume] = useState(1.0)
  const [elapsed, setElapsed] = useState(0)
  const [blob, setBlob] = useState(null)
  const [micLevel, setMicLevel] = useState(0)
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
      for (let i = 0; i < data.length; i++) { const v = (data[i] - 128) / 128; sum += v * v }
      setMicLevel(Math.min(100, Math.round(Math.sqrt(sum / data.length) * 400)))
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
  }
  function stopMeterLoop() { if (rafRef.current) cancelAnimationFrame(rafRef.current); setMicLevel(0) }
  function stopEverything() {
    clearInterval(timerRef.current); stopMeterLoop()
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
      micGain.gain.value = micVolume; micGainRef.current = micGain
      const analyser = ctx.createAnalyser()
      analyser.fftSize = 256; analyserRef.current = analyser
      micSource.connect(micGain); micGain.connect(analyser); micGain.connect(destination)
      if (song.referenceAudioUrl) {
        const refEl = new Audio()
        refEl.crossOrigin = 'anonymous'; refEl.src = song.referenceAudioUrl; refAudioElRef.current = refEl
        const gain = ctx.createGain()
        gain.gain.value = refVolume; gainNodeRef.current = gain
        ctx.createMediaElementSource(refEl).connect(gain)
        gain.connect(destination); gain.connect(ctx.destination)
        refEl.play().catch(() => {})
      }
      const recorder = new MediaRecorder(destination.stream, { mimeType: 'audio/webm' })
      mediaRecorderRef.current = recorder
      recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data) }
      recorder.onstop = () => { stopMeterLoop(); setBlob(new Blob(chunksRef.current, { type: 'audio/webm' })); setPhase('preview') }
      recorder.start(250)
      timerRef.current = setInterval(() => setElapsed((s) => s + 1), 1000)
      startMeterLoop(analyser); setPhase('recording')
    } catch (err) { setError('Microphone access denied: ' + err.message) }
  }
  function stopRecording() {
    clearInterval(timerRef.current); stopMeterLoop()
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
  const fmt = (s) => String(Math.floor(s / 60)).padStart(2,'0') + ':' + String(s % 60).padStart(2,'0')
  const BAR_COUNT = 10
  const activeBars = Math.round((micLevel / 100) * BAR_COUNT)
  const barColor = (i) => i >= 8 ? '#dc2626' : i >= 6 ? '#f59e0b' : '#16a34a'
  const levelLabel = micLevel < 5 ? 'Silent' : micLevel < 30 ? 'Low' : micLevel < 70 ? 'Good' : micLevel < 90 ? 'Strong' : 'Too loud!'

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" style={{ background: 'rgba(26,0,5,0.6)', backdropFilter: 'blur(8px)' }}>
      <div className="glass w-full max-w-md p-6 flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-bold text-lg" style={{ color: 'var(--text-heading)' }}>{song.title}</h2>
            {song.composer && <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{song.composer}</p>}
          </div>
          <button onClick={onClose} style={{ color: 'var(--text-muted)' }}><X size={20} /></button>
        </div>
        <div className="flex items-start gap-2 rounded-xl p-3 text-sm" style={{ background: 'var(--bg-soft)', border: '1px solid var(--border-soft)', color: 'var(--text-heading)' }}>
          <Headphones size={17} className="shrink-0 mt-0.5" />
          <span>Use headphones so the backing track does not bleed into your mic.</span>
        </div>
        {song.referenceAudioUrl && (
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold" style={{ color: 'var(--text-heading)' }}>
              Backing track: <span style={{ color: 'var(--text-accent)' }}>{Math.round(refVolume * 100)}%</span>
            </label>
            <input type="range" min={0} max={1} step={0.05} value={refVolume} onChange={(e) => setRefVolume(Number(e.target.value))} className="w-full accent-red-600" />
            {phase === 'idle' && <audio controls src={song.referenceAudioUrl} className="w-full h-9 mt-1" />}
          </div>
        )}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold" style={{ color: 'var(--text-heading)' }}>
            Mic volume: <span style={{ color: 'var(--text-accent)' }}>{Math.round(micVolume * 100)}%</span>
          </label>
          <input type="range" min={0} max={2} step={0.05} value={micVolume} onChange={(e) => setMicVolume(Number(e.target.value))} className="w-full accent-red-700" />
        </div>
        <div className="flex flex-col items-center gap-3">
          {phase === 'idle' && (
            <button onClick={startRecording} className="btn-glass flex items-center gap-2 text-sm py-3 px-8"><Mic size={17}/> Start Recording</button>
          )}
          {phase === 'recording' && (
            <>
              <div className="flex items-center gap-2 font-mono text-2xl font-bold" style={{ color: 'var(--text-accent)' }}>
                <span className="w-3 h-3 rounded-full inline-block animate-pulse" style={{ background: '#c0152c' }} />{fmt(elapsed)}
              </div>
              <div className="w-full rounded-xl p-3 flex flex-col gap-2" style={{ background: 'rgba(220,30,60,0.05)', border: '1px solid var(--border-soft)' }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5"><Mic size={13} style={{ color: 'var(--text-muted)' }}/><span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>Mic level</span></div>
                  <span className="text-xs font-bold" style={{ color: micLevel >= 90 ? '#dc2626' : micLevel >= 60 ? '#d97706' : '#16a34a' }}>{levelLabel}</span>
                </div>
                <div className="flex items-end gap-0.5 h-8">
                  {Array.from({ length: BAR_COUNT }).map((_, i) => (
                    <div key={i} style={{ height: (40 + i * 6) + '%', background: i < activeBars ? barColor(i) : 'rgba(220,30,60,0.12)', flex: 1, borderRadius: '3px', transition: 'all 75ms' }} />
                  ))}
                </div>
              </div>
              <button onClick={stopRecording} className="btn-glass-outline flex items-center gap-2 text-sm py-2.5 px-8"><Square size={15}/> Stop Recording</button>
            </>
          )}
          {phase === 'preview' && (
            <>
              <p className="text-sm font-medium" style={{ color: 'rgba(160,30,50,0.7)' }}>Preview your take before submitting.</p>
              <audio ref={previewRef} controls src={blob ? URL.createObjectURL(blob) : ''} className="w-full h-9" />
              <div className="flex gap-3 w-full">
                <button onClick={handleDiscard} className="btn-glass-outline flex-1 text-sm py-2">Discard</button>
                <button onClick={handleSubmit} className="btn-glass flex-1 flex items-center justify-center gap-2 text-sm py-2"><Upload size={14}/> Submit</button>
              </div>
            </>
          )}
          {phase === 'uploading' && <p className="text-sm animate-pulse" style={{ color: 'var(--text-accent)' }}>Uploading your recording...</p>}
        </div>
        {error && <div className="rounded-xl px-4 py-3 text-sm" style={{ background: 'var(--bg-soft)', border: '1px solid rgba(220,30,60,0.2)', color: 'var(--text-heading)' }}>{error}</div>}
      </div>
    </div>
  )
}