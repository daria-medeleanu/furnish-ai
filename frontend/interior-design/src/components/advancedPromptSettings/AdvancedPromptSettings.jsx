import './advancedPromptSettings.css'

const AdvancedPromptSettings = ({
  showAdvanced,
  setShowAdvanced,
  negativePrompt,
  setNegativePrompt,
  numInferenceSteps,
  setNumInferenceSteps,
  guidanceScale,
  setGuidanceScale,
  seed,
  setSeed
}) => (
  <div className="customization-section">
    <h3>5. Advanced Generation Settings</h3>
    <button
      type="button"
      className="advanced-toggle"
      onClick={() => setShowAdvanced((v) => !v)}
      style={{
        marginBottom: 12,
        background: '#ecf6dd',
        border: '1px solid #485c11',
        borderRadius: 6,
        padding: '6px 14px',
        cursor: 'pointer',
        fontWeight: 600,
        color: '#485c11'
      }}
    >
      {showAdvanced ? 'Hide Advanced Settings' : 'Show Advanced Settings'}
    </button>
    {showAdvanced && (
      <div className="advanced-settings" style={{ background: '#f8fafc', padding: 16, borderRadius: 8, marginBottom: 16 }}>
        <div style={{ marginBottom: 12 }}>
          <label style={{ fontWeight: 500 }}>Negative Prompt</label>
          <input
            type="text"
            value={negativePrompt}
            onChange={e => setNegativePrompt(e.target.value)}
            style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc', marginTop: 4 }}
          />
          <div style={{ fontSize: 13, color: '#666', marginTop: 2 }}>
            <strong>What is this?</strong> Words or phrases you <b>don't</b> want in the result (e.g. "blurry, low quality"). The AI will try to avoid these.
          </div>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ fontWeight: 500 }}>Inference Steps (10-50)</label>
          <input
            type="number"
            min={10}
            max={50}
            value={numInferenceSteps}
            onChange={e => setNumInferenceSteps(Math.max(10, Math.min(50, Number(e.target.value))))}
            style={{ width: 80, padding: 6, borderRadius: 4, border: '1px solid #ccc', marginLeft: 8 }}
          />
          <div style={{ fontSize: 13, color: '#666', marginTop: 2 }}>
            <strong>What is this?</strong> How many steps the AI takes to generate the image. Higher values can improve quality but take longer (default: 25).
          </div>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ fontWeight: 500 }}>Guidance Scale (1-20)</label>
          <input
            type="number"
            min={1}
            max={20}
            step={0.1}
            value={guidanceScale}
            onChange={e => setGuidanceScale(Math.max(1, Math.min(20, Number(e.target.value))))}
            style={{ width: 80, padding: 6, borderRadius: 4, border: '1px solid #ccc', marginLeft: 8 }}
          />
          <div style={{ fontSize: 13, color: '#666', marginTop: 2 }}>
            <strong>What is this?</strong> How strongly the AI follows your prompt. Higher = more literal, lower = more creative (default: 7.5).
          </div>
        </div>
        <div>
          <label style={{ fontWeight: 500 }}>Seed (-1 for random)</label>
          <input
            type="number"
            value={seed}
            onChange={e => setSeed(Number(e.target.value))}
            style={{ width: 100, padding: 6, borderRadius: 4, border: '1px solid #ccc', marginLeft: 8 }}
          />
          <div style={{ fontSize: 13, color: '#666', marginTop: 2 }}>
            <strong>What is this?</strong> Controls randomness. Use -1 for a random result each time, or set a number for repeatable results.
          </div>
        </div>
      </div>
    )}
  </div>
);

export default AdvancedPromptSettings;