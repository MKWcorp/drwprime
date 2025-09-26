export default function TestPage() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#0a0a0a', 
      color: '#d4af37',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Inter, sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>DRW Prime</h1>
        <p style={{ fontSize: '1.2rem' }}>Website is loading...</p>
        <p>The Art of Timeless Beauty</p>
      </div>
    </div>
  );
}