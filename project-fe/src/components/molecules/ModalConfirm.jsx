import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '../atoms/Button';

export function ModalConfirm({
  open,
  title = 'Konfirmasi Tindakan',
  message,
  confirmText = 'Konfirmasi',
  cancelText = 'Batal',
  confirmVariant = 'primary',
  loading = false,
  onConfirm,
  onClose,
  children,
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: '16px',
          padding: '8px',
          maxWidth: '480px',
          width: '100%',
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 700, fontSize: '1.125rem', color: '#0f172a' }}>
        {title}
      </DialogTitle>
      <DialogContent>
        {message && (
          <p className="text-sm text-slate-600 mb-3 leading-relaxed">
            {message}
          </p>
        )}
        {children}
      </DialogContent>
      <DialogActions sx={{ padding: '16px 24px' }}>
        <Button variant="secondary" size="md" onClick={onClose} disabled={loading}>
          {cancelText}
        </Button>
        <Button variant={confirmVariant} size="md" onClick={onConfirm} loading={loading}>
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ModalConfirm;
