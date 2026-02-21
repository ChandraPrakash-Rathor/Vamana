import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faEnvelope, faMapMarkerAlt, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

export default function InvoiceTemplate({ orderData }) {
  // Sample order data structure
  const defaultOrderData = {
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

  const data = orderData || defaultOrderData;

  return (
    <div id="invoice-template" style={{
      maxWidth: '800px',
      margin: '0 auto',
      backgroundColor: 'white',
      padding: '40px',
      fontFamily: "'Roboto', sans-serif",
      color: '#333'
    }}>
      {/* Header */}
      <div style={{
        borderBottom: '3px solid var(--sand-600)',
        paddingBottom: '20px',
        marginBottom: '30px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'start'
      }}>
        <div>
          <img 
            src="/logo1.png" 
            alt="Vamana" 
            style={{ height: '50px', marginBottom: '10px' }}
          />
          <div style={{ fontSize: '28px', fontWeight: '700', color: 'var(--sand-900)', fontFamily: "'Playfair Display', serif" }}>
            TAX INVOICE
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>Invoice Number</div>
          <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--sand-900)', marginBottom: '15px' }}>
            {data.invoiceNumber}
          </div>
          <div style={{ fontSize: '13px', color: '#666' }}>
            Date: {data.orderDate}<br />
            Time: {data.orderTime}
          </div>
        </div>
      </div>

      {/* Company & Customer Info */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '30px',
        marginBottom: '30px'
      }}>
        {/* From */}
        <div>
          <div style={{
            fontSize: '12px',
            fontWeight: '700',
            color: 'var(--sand-600)',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginBottom: '10px'
          }}>
            From
          </div>
          <div style={{ fontSize: '16px', fontWeight: '700', marginBottom: '8px' }}>
            Vamana Fragrances Pvt. Ltd.
          </div>
          <div style={{ fontSize: '13px', lineHeight: '1.6', color: '#666' }}>
            <div><FontAwesomeIcon icon={faMapMarkerAlt} style={{ marginRight: '8px', color: 'var(--sand-600)' }} />
              123 Vamana Plaza, Fragrance Street</div>
            <div style={{ marginLeft: '20px' }}>Mumbai, Maharashtra 400001</div>
            <div style={{ marginLeft: '20px' }}>India</div>
            <div style={{ marginTop: '8px' }}>
              <FontAwesomeIcon icon={faPhone} style={{ marginRight: '8px', color: 'var(--sand-600)' }} />
              +91 123 456 7890
            </div>
            <div>
              <FontAwesomeIcon icon={faEnvelope} style={{ marginRight: '8px', color: 'var(--sand-600)' }} />
              info@vamana.com
            </div>
          </div>
          <div style={{ fontSize: '12px', marginTop: '10px', color: '#666' }}>
            <strong>GSTIN:</strong> 27AABCU9603R1ZX
          </div>
        </div>

        {/* To */}
        <div>
          <div style={{
            fontSize: '12px',
            fontWeight: '700',
            color: 'var(--sand-600)',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginBottom: '10px'
          }}>
            Bill To
          </div>
          <div style={{ fontSize: '16px', fontWeight: '700', marginBottom: '8px' }}>
            {data.customer.name}
          </div>
          <div style={{ fontSize: '13px', lineHeight: '1.6', color: '#666' }}>
            <div><FontAwesomeIcon icon={faMapMarkerAlt} style={{ marginRight: '8px', color: 'var(--sand-600)' }} />
              {data.customer.address}</div>
            <div style={{ marginLeft: '20px' }}>
              {data.customer.city}, {data.customer.state} {data.customer.pincode}
            </div>
            <div style={{ marginTop: '8px' }}>
              <FontAwesomeIcon icon={faPhone} style={{ marginRight: '8px', color: 'var(--sand-600)' }} />
              {data.customer.phone}
            </div>
            <div>
              <FontAwesomeIcon icon={faEnvelope} style={{ marginRight: '8px', color: 'var(--sand-600)' }} />
              {data.customer.email}
            </div>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div style={{ marginBottom: '30px' }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '13px'
        }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--sand-200)' }}>
              <th style={{
                padding: '12px',
                textAlign: 'left',
                fontWeight: '700',
                color: 'var(--sand-900)',
                borderBottom: '2px solid var(--sand-400)'
              }}>
                #
              </th>
              <th style={{
                padding: '12px',
                textAlign: 'left',
                fontWeight: '700',
                color: 'var(--sand-900)',
                borderBottom: '2px solid var(--sand-400)'
              }}>
                Product Description
              </th>
              <th style={{
                padding: '12px',
                textAlign: 'center',
                fontWeight: '700',
                color: 'var(--sand-900)',
                borderBottom: '2px solid var(--sand-400)'
              }}>
                Qty
              </th>
              <th style={{
                padding: '12px',
                textAlign: 'right',
                fontWeight: '700',
                color: 'var(--sand-900)',
                borderBottom: '2px solid var(--sand-400)'
              }}>
                Unit Price
              </th>
              <th style={{
                padding: '12px',
                textAlign: 'right',
                fontWeight: '700',
                color: 'var(--sand-900)',
                borderBottom: '2px solid var(--sand-400)'
              }}>
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item, index) => (
              <tr key={item.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '15px 12px', color: '#666' }}>
                  {index + 1}
                </td>
                <td style={{ padding: '15px 12px' }}>
                  <div style={{ fontWeight: '600', color: '#333', marginBottom: '3px' }}>
                    {item.name}
                  </div>
                  <div style={{ fontSize: '12px', color: '#999' }}>
                    Size: {item.size}
                  </div>
                </td>
                <td style={{ padding: '15px 12px', textAlign: 'center', color: '#666' }}>
                  {item.quantity}
                </td>
                <td style={{ padding: '15px 12px', textAlign: 'right', color: '#666' }}>
                  ₹{item.price.toLocaleString()}
                </td>
                <td style={{ padding: '15px 12px', textAlign: 'right', fontWeight: '600', color: '#333' }}>
                  ₹{item.total.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        marginBottom: '30px'
      }}>
        <div style={{ width: '300px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '10px 0',
            fontSize: '14px',
            color: '#666'
          }}>
            <span>Subtotal:</span>
            <span>₹{data.subtotal.toLocaleString()}</span>
          </div>
          
          {data.discount > 0 && (
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '10px 0',
              fontSize: '14px',
              color: '#28a745'
            }}>
              <span>Discount:</span>
              <span>- ₹{data.discount.toLocaleString()}</span>
            </div>
          )}

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '10px 0',
            fontSize: '14px',
            color: '#666'
          }}>
            <span>Shipping:</span>
            <span style={{ color: data.shipping === 0 ? '#28a745' : '#666' }}>
              {data.shipping === 0 ? 'FREE' : `₹${data.shipping}`}
            </span>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '10px 0',
            fontSize: '14px',
            color: '#666',
            borderBottom: '1px solid #ddd'
          }}>
            <span>Tax (GST 18%):</span>
            <span>₹{data.tax.toLocaleString()}</span>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '15px 0',
            fontSize: '18px',
            fontWeight: '700',
            color: 'var(--sand-900)'
          }}>
            <span>Total Amount:</span>
            <span>₹{data.total.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Payment Info */}
      <div style={{
        backgroundColor: '#f8f9fa',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '30px',
        border: '1px solid #e0e0e0'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '15px',
          fontSize: '13px'
        }}>
          <div>
            <div style={{ color: '#666', marginBottom: '5px' }}>Payment Method</div>
            <div style={{ fontWeight: '600', color: '#333' }}>{data.paymentMethod}</div>
          </div>
          <div>
            <div style={{ color: '#666', marginBottom: '5px' }}>Transaction ID</div>
            <div style={{ fontWeight: '600', color: '#333' }}>{data.transactionId}</div>
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 15px',
              backgroundColor: '#d4edda',
              color: '#155724',
              borderRadius: '5px',
              fontSize: '13px',
              fontWeight: '600'
            }}>
              <FontAwesomeIcon icon={faCheckCircle} />
              Payment Successful
            </div>
          </div>
        </div>
      </div>

      {/* Terms & Conditions */}
      <div style={{
        borderTop: '2px solid #e0e0e0',
        paddingTop: '20px',
        marginBottom: '20px'
      }}>
        <div style={{
          fontSize: '14px',
          fontWeight: '700',
          color: 'var(--sand-900)',
          marginBottom: '10px'
        }}>
          Terms & Conditions
        </div>
        <ul style={{
          fontSize: '12px',
          color: '#666',
          lineHeight: '1.8',
          paddingLeft: '20px',
          margin: 0
        }}>
          <li>All products are 100% authentic and original</li>
          <li>Returns accepted within 7 days for unopened products</li>
          <li>Please inspect the package upon delivery</li>
          <li>For any queries, contact us at info@vamana.com or +91 123 456 7890</li>
        </ul>
      </div>

      {/* Footer */}
      <div style={{
        textAlign: 'center',
        paddingTop: '20px',
        borderTop: '1px solid #e0e0e0'
      }}>
        <div style={{
          fontSize: '12px',
          color: '#999',
          marginBottom: '5px'
        }}>
          Thank you for shopping with Vamana!
        </div>
        <div style={{
          fontSize: '11px',
          color: '#bbb'
        }}>
          This is a computer-generated invoice and does not require a signature.
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body {
            margin: 0;
            padding: 0;
          }
          #invoice-template {
            max-width: 100%;
            padding: 20px;
          }
          button {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
