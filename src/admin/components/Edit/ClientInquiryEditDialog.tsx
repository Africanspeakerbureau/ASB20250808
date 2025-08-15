import { useEffect, useState, type ChangeEvent, type ReactNode } from 'react';
import ReactDOM from 'react-dom';
import { getRecord, readSingleSelect, airtablePatchRecord } from '../../api/airtable';
import { useToast } from '@/components/Toast';
import './editDialog.css';
import {
  INDUSTRIES,
  LARGEST_AUDIENCE,
  PRESENTATION_FORMAT,
  BUDGET_RANGE_USD
} from '../../edit/options';

const COMPANY_SIZE_OPTIONS = [
  '1 - 10 employees',
  '11 - 50 employees',
  '51 - 250 employees',
  '251 - 500 employees',
  '501 - 1000 employees',
  '1000 + employees'
];

const STATUS_OPTIONS = [
  'New',
  'Responded',
  'Closed',
  'Follow Up',
  'Assigned to Agent'
];

type ClientFields = {
  'First Name'?: string;
  'Last Name'?: string;
  'Email'?: string;
  'Phone'?: string;
  'Company Name'?: string;
  'Job Title'?: string;
  'Company Size'?: any;
  'Industry'?: any;
  'Company Website'?: string;
  'Event Name'?: string;
  'Event Date'?: string;
  'Event Location'?: string;
  'Audience Size'?: any;
  'Speaking Topic'?: string;
  'Budget Range (USD)'?: any;
  'Presentation Format'?: any;
  'Additional Requirements'?: string;
  'Status'?: any;
  'Created Date'?: string;
  'Internal notes'?: string;
  'Notes'?: string;
};

export default function ClientInquiryEditDialog({ recordId, onClose }: { recordId: string; onClose: () => void }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<any>({});
  const { push } = useToast();

  const bind = (name: string) => ({
    value: form?.[name] ?? '',
    onChange: (e: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f: any) => ({ ...f, [name]: e.target.value }))
  });

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
        companySize: readSingleSelect(f['Company Size']),
        industry: readSingleSelect(f['Industry']),
        website: f['Company Website'] ?? '',
        eventName: f['Event Name'] ?? '',
        eventDate: f['Event Date'] ?? '',
        eventLocation: f['Event Location'] ?? '',
        audienceSize: readSingleSelect(f['Audience Size']),
        speakingTopic: f['Speaking Topic'] ?? '',
        budgetRange: readSingleSelect(f['Budget Range (USD)']),
        format: readSingleSelect(f['Presentation Format']),
        requirements: f['Additional Requirements'] ?? '',
        status: readSingleSelect(f['Status']),
        createdDate: f['Created Date'] ?? '',
        notes: f['Internal notes'] ?? f['Notes'] ?? ''
      });
      setLoading(false);
    })();
  }, [recordId]);

  async function handleSave(closeAfter = true) {
    try {
      setSaving(true);
      const fields: Record<string, any> = {
        'First Name': form.firstName,
        'Last Name': form.lastName,
        'Email': form.email,
        'Phone': form.phone,
        'Company Name': form.company,
        'Job Title': form.jobTitle,
        'Company Size': form.companySize,
        'Industry': form.industry,
        'Company Website': form.website,
        'Event Name': form.eventName,
        'Event Date': form.eventDate ? new Date(form.eventDate).toISOString().slice(0,10) : '',
        'Event Location': form.eventLocation,
        'Audience Size': form.audienceSize,
        'Speaking Topic': form.speakingTopic,
        'Budget Range (USD)': form.budgetRange,
        'Presentation Format': form.format,
        'Additional Requirements': form.requirements,
        'Status': form.status,
        'Created Date': form.createdDate ? new Date(form.createdDate).toISOString().slice(0,10) : '',
        'Internal notes': form.notes,
      };
      if (Array.isArray(fields.Status)) {
        fields.Status = fields.Status[0] ?? '';
      }
      await airtablePatchRecord('Client Inquiries', recordId, fields);
      push({ text: 'Saved ✔︎', type: 'success' });
      if (closeAfter) onClose();
    } catch (e: any) {
      push({ text: e?.message || 'Could not save', type: 'error' });
    } finally {
      setSaving(false);
    }
  }

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
            <Field label="Company Size">
              <select className="select" {...bind('companySize')}>
                <option value="">— Select company size —</option>
                {COMPANY_SIZE_OPTIONS.map(o => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </Field>
            <Field label="Industry">
              <select className="select" {...bind('industry')}>
                <option value="">— Select industry —</option>
                {INDUSTRIES.map(o => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </Field>
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
            <Field label="Audience Size">
              <select className="select" {...bind('audienceSize')}>
                <option value="">— Select audience —</option>
                {LARGEST_AUDIENCE.map(o => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </Field>
            <div className="field" style={{gridColumn:'1 / -1'}}>
              <label className="field__label">Speaking Topic</label>
              <input className="input" value={form.speakingTopic} onChange={e => setForm({ ...form, speakingTopic: e.target.value })} />
            </div>
            <Field label="Budget Range (USD)">
              <select className="select" {...bind('budgetRange')}>
                <option value="">— Select budget —</option>
                {BUDGET_RANGE_USD.map(o => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Presentation Format">
              <select className="select" {...bind('format')}>
                <option value="">— Select format —</option>
                {PRESENTATION_FORMAT.map(o => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </Field>
            <div className="field" style={{gridColumn:'1 / -1'}}>
              <label className="field__label">Additional Requirements</label>
              <textarea className="textarea" value={form.requirements} onChange={e => setForm({ ...form, requirements: e.target.value })} />
            </div>
            <Field label="Status">
              <select className="select" {...bind('status')}>
                <option value="">— Select status —</option>
                {STATUS_OPTIONS.map(o => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </Field>
            <div className="field">
              <label className="field__label">Created Date</label>
              <input className="input" value={form.createdDate} onChange={e => setForm({ ...form, createdDate: e.target.value })} />
            </div>
            <Field label="Internal notes">
              <textarea className="textarea" rows={4} {...bind('notes')} />
            </Field>
          </div>
        </div>
          <div className="modal__footer">
            <button className="btn" disabled={saving} onClick={onClose}>Close</button>
            <button className="btn" disabled={saving} onClick={() => handleSave(false)}>{saving ? 'Saving…' : 'Save'}</button>
            <button className="btn btn--primary" disabled={saving} onClick={() => handleSave(true)}>{saving ? 'Saving…' : 'Save & Close'}</button>
          </div>
      </div>
    </div>,
    document.body
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="field">
      <label className="field__label">{label}</label>
      {children}
    </div>
  );
}
