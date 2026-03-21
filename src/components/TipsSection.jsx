export default function TipsSection({ tips }) {
  if (!tips || tips.length === 0) return null

  return (
    <div>
      <h2
        className="anim-fade-up"
        style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px', color: 'var(--text-primary)' }}
      >
        💡 What you can do now
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {tips.map((tip, i) => (
          <div
            key={i}
            className={`glass-card anim-fade-up delay-${i + 1}`}
            style={{ padding: '18px 20px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}
          >
            {/* Icon */}
            <div style={{
              flexShrink: 0,
              width: '42px', height: '42px',
              borderRadius: '10px',
              background: 'rgba(134, 239, 172, 0.1)',
              border: '1px solid var(--border-accent)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '20px',
            }}>
              {tip.icon}
            </div>
            {/* Text */}
            <div>
              <div style={{
                fontSize: '14px', fontWeight: 700,
                color: 'var(--text-primary)',
                marginBottom: '4px',
              }}>
                {tip.title}
              </div>
              <div style={{
                fontSize: '13.5px',
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
              }}>
                {tip.body}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
