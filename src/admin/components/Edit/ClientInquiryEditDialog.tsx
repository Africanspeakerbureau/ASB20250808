import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { getRecord, readSingleSelect } from '../../api/airtable';
import './editDialog.css';

type ClientFields = {
  'First Name'?: string;
  'Last Name'?: string;
  'Email'?: string;
  'Phone'?: string;
  'Company Name'?: string;
  'Job Title'?: string;
  'Industry'?: any;
  'Company Website'?: string;
  'Event Name'?: string;
  'Event Date'?: string;
  'Event Location'?: string;
  'Audience Size'?: any;
  'Speaking Topic'?: string;
  'Budget Range'?: any;
  'Presentation Format'?: any;
  'Additional Requirements'?: string;
  'Status'?: any;
  'Created Date'?: string;
  'Notes'?: string;
};

export default function ClientInquiryEditDialog({ recordId, onClose }: { recordId: string; onClose: () => void }) {
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<any>({});

  useEffect(() => {
    (async () => {
      setLoading(true);
      const r = await getRecord<ClientFields>('Client Inquiries', recordId);
      const f = r.fields || {};
      setForm({
        firstName: f['First Name'] ?? '',
        lastName: f['Last Name'] ?? '',
        email: f['Email'] ?? '',
        phone: f['Phone'] ?? '',
        company: f['Company Name'] ?? '',
        jobTitle: f['Job Title'] ?? '',
        industry: readSingleSelect(f['Industry']),
        website: f['Company Website'] ?? '',
        eventName: f['Event Name'] ?? '',
        eventDate: f['Event Date'] ?? '',
        eventLocation: f['Event Location'] ?? '',
        audienceSize: readSingleSelect(f['Audience Size']),
        speakingTopic: f['Speaking Topic'] ?? '',
        budgetRange: readSingleSelect(f['Budget Range']),
        format: readSingleSelect(f['Presentation Format']),
        requirements: f['Additional Requirements'] ?? '',
        status: readSingleSelect(f['Status']),
        createdDate: f['Created Date'] ?? '',
        notes: f['Notes'] ?? ''
      });
      setLoading(false);
    })();
  }, [recordId]);

  return ReactDOM.createPortal(
    <div className="modal">
      <div className="modal__panel" role="dialog" aria-modal="true">
        <div className="modal__header">
          <h2>Client Inquiry</h2>
          <button className="icon-btn" aria-label="Close" onClick={onClose}>✕</button>
        </div>
        {loading && <div className="loading-bar">Loading record…</div>}
        <div className="modal__body">
          <div className="grid">
            <div className="field">
              <label className="field__label">First Name</label>
              <input className="input" value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} />
            </div>
            <div className="field">
              <label className="field__label">Last Name</label>
              <input className="input" value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} />
            </div>
            <div className="field">
              <label className="field__label">Email</label>
              <input className="input" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="field">
              <label className="field__label">Phone</label>
              <input className="input" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div className="field">
              <label className="field__label">Company Name</label>
              <input className="input" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} />
            </div>
            <div className="field">
              <label className="field__label">Job Title</label>
              <input className="input" value={form.jobTitle} onChange={e => setForm({ ...form, jobTitle: e.target.value })} />
            </div>
            <div className="field">
              <label className="field__label">Industry</label>
              <input className="input" value={form.industry} onChange={e => setForm({ ...form, industry: e.target.value })} />
            </div>
            <div className="field" style={{gridColumn:'1 / -1'}}>
              <label className="field__label">Company Website</label>
              <input className="input" value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} />
            </div>
            <div className="field">
              <label className="field__label">Event Name</label>
              <input className="input" value={form.eventName} onChange={e => setForm({ ...form, eventName: e.target.value })} />
            </div>
            <div className="field">
              <label className="field__label">Event Date</label>
              <input className="input" value={form.eventDate} onChange={e => setForm({ ...form, eventDate: e.target.value })} />
            </div>
            <div className="field">
              <label className="field__label">Event Location</label>
              <input className="input" value={form.eventLocation} onChange={e => setForm({ ...form, eventLocation: e.target.value })} />
            </div>
            <div className="field">
              <label className="field__label">Audience Size</label>
              <input className="input" value={form.audienceSize} onChange={e => setForm({ ...form, audienceSize: e.target.value })} />
            </div>
            <div className="field" style={{gridColumn:'1 / -1'}}>
              <label className="field__label">Speaking Topic</label>
              <input className="input" value={form.speakingTopic} onChange={e => setForm({ ...form, speakingTopic: e.target.value })} />
            </div>
            <div className="field">
              <label className="field__label">Budget Range</label>
              <input className="input" value={form.budgetRange} onChange={e => setForm({ ...form, budgetRange: e.target.value })} />
            </div>
            <div className="field">
              <label className="field__label">Presentation Format</label>
              <input className="input" value={form.format} onChange={e => setForm({ ...form, format: e.target.value })} />
            </div>
            <div className="field" style={{gridColumn:'1 / -1'}}>
              <label className="field__label">Additional Requirements</label>
              <textarea className="textarea" value={form.requirements} onChange={e => setForm({ ...form, requirements: e.target.value })} />
            </div>
            <div className="field">
              <label className="field__label">Status</label>
              <input className="input" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} />
            </div>
            <div className="field">
              <label className="field__label">Created Date</label>
              <input className="input" value={form.createdDate} onChange={e => setForm({ ...form, createdDate: e.target.value })} />
            </div>
            <div className="field" style={{gridColumn:'1 / -1'}}>
              <label className="field__label">Notes</label>
              <textarea className="textarea" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
            </div>
          </div>
        </div>
        <div className="modal__footer">
          <button className="btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>,
    document.body
  );
}
