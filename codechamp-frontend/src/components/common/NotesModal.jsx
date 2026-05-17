import { useState } from 'react';
import { updateProgress } from '../../api/dsaAPI';
import { X, Save, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import './NotesModal.css';

const NotesModal = ({ question, existingNote, onClose, onSave }) => {
  const [note, setNote] = useState(existingNote || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await updateProgress(
        question.id, { notes: note }
      );
      onSave(question.id, updated);
      toast.success('Note saved!');
      onClose();
    } catch (err) {
      toast.error('Failed to save note');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card"
        onClick={e => e.stopPropagation()}>

        <div className="modal-header">
          <div className="modal-title">
            <FileText size={18} strokeWidth={1.75}
              color="var(--primary)" />
            <h3>Notes</h3>
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={18} strokeWidth={2} />
          </button>
        </div>

        <div className="modal-question">
          <span className={`badge-${question.difficulty?.toLowerCase()}`}>
            {question.difficulty}
          </span>
          <span className="modal-question-title">
            {question.title}
          </span>
        </div>

        <textarea
          className="modal-textarea"
          placeholder="Write your approach, solution notes, key insights..."
          value={note}
          onChange={e => setNote(e.target.value)}
          rows={8}
          autoFocus
        />

        <div className="modal-footer">
          <button
            className="btn-secondary"
            onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn-primary"
            onClick={handleSave}
            disabled={saving}>
            <Save size={15} strokeWidth={2} />
            {saving ? 'Saving...' : 'Save Note'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotesModal;