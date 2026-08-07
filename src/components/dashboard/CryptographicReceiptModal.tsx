import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Download, CheckCircle2, Copy, FileText, ExternalLink, Key, Hash } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import jsPDF from 'jspdf';

export const CryptographicReceiptModal: React.FC = () => {
  const { isReceiptModalOpen, setIsReceiptModalOpen, cryptographicReceipt, selectedTenant, student } = useApp();

  if (!isReceiptModalOpen || !cryptographicReceipt) return null;

  const downloadPdfCertificate = () => {
    const doc = new jsPDF();
    doc.setFillColor(9, 9, 11);
    doc.rect(0, 0, 210, 297, 'F');

    doc.setDrawColor(39, 39, 42);
    doc.rect(10, 10, 190, 277);

    // Header
    doc.setTextColor(250, 250, 250);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('ZENO AUTONOMOUS GOVERNANCE PLATFORM', 20, 30);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(161, 161, 170);
    doc.text(`INSTITUTIONAL TENANT: ${selectedTenant.name} (${selectedTenant.code})`, 20, 38);
    doc.text(`CRYPTOGRAPHIC AUDIT PROOF CERTIFICATE`, 20, 44);

    doc.setDrawColor(60, 60, 65);
    doc.line(20, 50, 190, 50);

    // Details Grid
    doc.setFontSize(11);
    doc.setTextColor(250, 250, 250);
    doc.setFont('helvetica', 'bold');
    doc.text('TRANSACTION VERIFICATION SUMMARY', 20, 62);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(200, 200, 200);

    const fields = [
      ['Action Identifier:', cryptographicReceipt.actionId],
      ['Transaction Hash:', cryptographicReceipt.txHash],
      ['Block Height:', `#${cryptographicReceipt.blockHeight}`],
      ['Timestamp:', cryptographicReceipt.timestamp],
      ['Student Roll Number:', student.rollNumber],
      ['Target Recipient:', cryptographicReceipt.targetRecipient],
      ['Payload Summary:', cryptographicReceipt.payloadSummary],
      ['Cryptographic Signature:', cryptographicReceipt.verifiedBySignature],
    ];

    let y = 72;
    fields.forEach(([label, val]) => {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(161, 161, 170);
      doc.text(label, 20, y);

      doc.setFont('courier', 'bold');
      doc.setTextColor(59, 130, 246);
      doc.text(val, 75, y);
      y += 10;
    });

    doc.line(20, y, 190, y);
    y += 15;

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(9);
    doc.setTextColor(120, 120, 120);
    doc.text(
      'This certificate serves as cryptographically signed proof of Human-in-the-Loop approval for governance actions.',
      20,
      y
    );

    doc.save(`Zeno_Cryptographic_Audit_${cryptographicReceipt.actionId}.pdf`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl overflow-hidden text-foreground"
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-border bg-emerald-500/10 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-emerald-400 flex items-center gap-2">
                <span>Cryptographic Execution Proof</span>
              </h3>
              <p className="text-xs text-muted-foreground">Action Dispatched & Verified on Vault Ledger</p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-mono font-bold border border-emerald-500/30">
            VERIFIED ✅
          </span>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 text-xs font-mono">
          <div className="p-4 rounded-xl bg-background border border-border space-y-2">
            <div className="flex justify-between text-muted-foreground">
              <span>Action ID:</span>
              <span className="text-foreground font-bold">{cryptographicReceipt.actionId}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Block Height:</span>
              <span className="text-primary font-bold">#{cryptographicReceipt.blockHeight}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Tenant Code:</span>
              <span className="text-foreground">{cryptographicReceipt.tenantCode}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Timestamp:</span>
              <span className="text-foreground">{new Date(cryptographicReceipt.timestamp).toLocaleTimeString()}</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-background border border-border space-y-2">
            <div className="text-muted-foreground text-[11px]">Transaction Verification Hash:</div>
            <div className="p-2.5 rounded-lg bg-muted/60 text-emerald-400 font-mono text-[11px] break-all border border-border">
              {cryptographicReceipt.txHash}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-background border border-border space-y-2">
            <div className="text-muted-foreground text-[11px]">Digital Signature Key:</div>
            <div className="text-foreground font-mono text-[11px]">{cryptographicReceipt.verifiedBySignature}</div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-border bg-muted/20 flex items-center justify-between">
          <button
            onClick={() => setIsReceiptModalOpen(false)}
            className="px-4 py-2.5 text-xs font-medium border border-border rounded-xl hover:bg-muted transition-all"
          >
            Close Window
          </button>
          <button
            onClick={downloadPdfCertificate}
            className="px-4 py-2.5 bg-primary text-primary-foreground text-xs font-semibold rounded-xl hover:opacity-90 transition-all flex items-center space-x-2 shadow-lg shadow-primary/10"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF Audit Certificate</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
