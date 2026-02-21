import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faPrint, faArrowLeft, faHome } from '@fortawesome/free-solid-svg-icons';
import InvoiceTemplate from '../components/invoice/InvoiceTemplate';

export default function Invoice() {
  const navigate = useNavigate();
  const invoiceRef = useRef();

  // Sample order data - in real app, this would come from order state/API
  const orderData = {
    invoiceNumber: 'VN-2024-001234',
    orderDate: '15 Feb 2024',
    orderTime: '10:30 AM',
    paymentMethod: 'Credit Card',
    transactionId: 'TXN123456789',
    customer: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+91 98765 43210',
      address: '123 Main Street, Apartment 4B',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001'
    },
    items: [
      { id: 1, name: 'Eternal Rose', size: '50ml', quantity: 1, price: 2499, total: 2499 },
      { id: 2, name: 'Midnight Oud', size: '100ml', quantity: 2, price: 3999, total: 7998 }
    ],
    subtotal: 10497,
    discount: 0,
    shipping: 0,
    tax: 1889,
    total: 12386
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // For actual PDF generation, you would use a library like jsPDF or html2pdf
    // For now, we'll just trigger print which allows "Save as PDF"
    alert('To download as PDF:\n1. Click Print button\n2. Select "Save as PDF" as printer\n3. Click Save');
    window.print();
  };

  return (
    <div style={{ backgroundColor: 'var(--sand-100)', minHeight: '100vh', paddingTop: '90px' }}>
      <div className="container py-4">
        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px',
          flexWrap: 'wrap',
          gap: '15px'
        }} className="no-print">
          <button
            onClick={() => navigate('/')}
            style={{
              padding: '0.8rem 1.5rem',
              border: '2px solid var(--sand-400)',
              borderRadius: '10px',
              backgroundColor: 'white',
              color: 'var(--sand-800)',
              fontSize: '0.95rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'var(--sand-200)';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'white';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            <FontAwesomeIcon icon={faArrowLeft} /> Back to Home
          </button>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={handlePrint}
              style={{
                padding: '0.8rem 1.5rem',
                border: 'none',
                borderRadius: '10px',
                backgroundColor: 'var(--sand-600)',
                color: 'white',
                fontSize: '0.95rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'var(--sand-700)';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'var(--sand-600)';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              <FontAwesomeIcon icon={faPrint} /> Print
            </button>

            <button
              onClick={handleDownload}
              style={{
                padding: '0.8rem 1.5rem',
                border: 'none',
                borderRadius: '10px',
                backgroundColor: 'var(--sand-900)',
                color: 'white',
                fontSize: '0.95rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#000';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'var(--sand-900)';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              <FontAwesomeIcon icon={faDownload} /> Download PDF
            </button>
          </div>
        </div>

        {/* Invoice Template */}
        <div ref={invoiceRef} style={{
          boxShadow: '0 0 30px rgba(0,0,0,0.1)',
          borderRadius: '10px',
          overflow: 'hidden'
        }}>
          <InvoiceTemplate orderData={orderData} />
        </div>

        {/* Success Message */}
        <div className="no-print" style={{
          marginTop: '30px',
          padding: '20px',
          backgroundColor: '#d4edda',
          border: '1px solid #c3e6cb',
          borderRadius: '10px',
          textAlign: 'center',
          color: '#155724'
        }}>
          <div style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '10px' }}>
            🎉 Order Placed Successfully!
          </div>
          <div style={{ fontSize: '0.95rem' }}>
            Your order has been confirmed. We'll send you tracking details via email once your order is shipped.
          </div>
        </div>
      </div>

      {/* Print-specific styles */}
      <style>{`
        @media print {
          body {
            background: white !important;
          }
          .no-print {
            display: none !important;
          }
          .container {
            padding: 0 !important;
            max-width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
}
