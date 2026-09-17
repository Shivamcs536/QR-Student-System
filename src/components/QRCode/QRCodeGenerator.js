import React from 'react';
import QRCode from 'qrcode.react';

const QRCodeGenerator = ({ studentId }) => (
  <div>
    <QRCode value={studentId} />
    <button onClick={() => window.print()}>Print</button>
  </div>
);

export default QRCodeGenerator;