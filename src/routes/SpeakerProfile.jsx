import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { findSpeakerByEmail, updateSpeakerRecord } from '@/lib/airtableClient';

// ---- helpers for select coercion ----
const toSingle = (val) => (val ? String(val) : '');
const toMulti = (arr) => Array.isArray(arr) ? arr.map(String) : [];

const fromSingle = (val) => (val ? String(val) : undefined);               // Airtable singleSelect accepts a string
const fromMulti = (arr) => (Array.isArray(arr) && arr.length ? arr : undefined); // Airtable multiSelect accepts string[]

export default function SpeakerProfile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [recordId, setRecordId] = useState(null);
  const [email, setEmail] = useState('');
  const [activeTab, setActiveTab] = useState('Identity');
  const [err, setErr] = useState('');

  // ---- form state (only external tabs) ----
  const [form, setForm] = useState({
    // Identity
    'First Name': '', 'Last Name': '', 'Email': '', 'Phone': '',
    'Professional Title': '', 'Company': '', 'Location': '', 'Country': '',
    'Profile Image': [], // attachments (array of {url})
    // Background
    'Professional Bio': '', 'Education': '', 'Achievements': '',
    // Experience
    'Years Experience': '', 'Speaking Experience': '', 'Number of Events': '',
    'Largest Audience': '', 'Virtual Experience': '',
    // Expertise & Content
    'Industry': '', 'Expertise Areas': [], 'Speaking Topics': '', 'Key Messages': '',
    // Why booking
    'Speakers Delivery Style': '', 'Why the audience should listen to these topics': '',
    'What the speeches will address': '', 'What participants will learn': '',
    'What the audience will take home': '', 'Benefits for the individual': '',
    'Benefits for the organisation': '',
    // Media & Languages
    'Header Image': [], 'Video Link 1': '', 'Video Link 2': '', 'Video Link 3': '',
    'Spoken Languages': [],
    // Logistics & Fees
    'Fee Range General': '', 'Fee Range Local': '', 'Fee Range Continental': '',
    'Fee Range International': '', 'Fee Range Virtual': '',
    'Travel Willingness': '', 'Travel Requirements': '',
    // Contact & Admin
    'Website': '', 'LinkedIn': '', 'Twitter': '',
    'References': '', 'Banking Details': '',
    'PA Name': '', 'PA Email': '', 'PA Phone': '',
    'Special Requirements': '', 'Additional Info': '',
  });

  const tabs = useMemo(() => ([
    { key: 'Identity', fields: ['First Name','Last Name','Email','Phone','Professional Title','Company','Location','Country','Profile Image']},
    { key: 'Background', fields: ['Professional Bio','Education','Achievements']},
    { key: 'Experience', fields: ['Years Experience','Speaking Experience','Number of Events','Largest Audience','Virtual Experience']},
    { key: 'Expertise & Content', fields: ['Industry','Expertise Areas','Speaking Topics','Key Messages']},
    { key: 'Why booking', fields: ['Speakers Delivery Style','Why the audience should listen to these topics','What the speeches will address','What participants will learn','What the audience will take home','Benefits for the individual','Benefits for the organisation']},
    { key: 'Media & Languages', fields: ['Header Image','Video Link 1','Video Link 2','Video Link 3','Spoken Languages']},
    { key: 'Logistics & Fees', fields: ['Fee Range General','Fee Range Local','Fee Range Continental','Fee Range International','Fee Range Virtual','Travel Willingness','Travel Requirements']},
    { key: 'Contact & Admin', fields: ['Website','LinkedIn','Twitter','References','Banking Details','PA Name','PA Email','PA Phone','Special Requirements','Additional Info']},
  ]), []);

  // ---- load current user + their record ----
  useEffect(() => {
    (async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user?.email) {
          navigate('/speaker-login', { replace: true }); return;
        }
        setEmail(user.email);

        const rec = await findSpeakerByEmail(user.email);
        if (!rec) { setErr('No profile found for your email. Please contact ASB.'); setLoading(false); return; }
        setRecordId(rec.id);

        const f = rec.fields || {};
        setForm((prev) => ({
          ...prev,
          'First Name': toSingle(f['First Name']),
          'Last Name': toSingle(f['Last Name']),
          'Email': toSingle(f['Email']),
          'Phone': toSingle(f['Phone']),
          'Professional Title': toSingle(f['Professional Title']),
          'Company': toSingle(f['Company'] || f['Company/Organization']),
          'Location': toSingle(f['Location']),
          'Country': toSingle(f['Country']),
          'Profile Image': Array.isArray(f['Profile Image']) ? f['Profile Image'] : [],
          'Professional Bio': toSingle(f['Professional Bio']),
          'Education': toSingle(f['Education']),
          'Achievements': toSingle(f['Achievements']),
          'Years Experience': toSingle(f['Years Experience']),
          'Speaking Experience': toSingle(f['Speaking Experience']),
          'Number of Events': toSingle(f['Number of Events']),
          'Largest Audience': toSingle(f['Largest Audience']),
          'Virtual Experience': toSingle(f['Virtual Experience']),
          'Industry': toSingle(f['Industry']),
          'Expertise Areas': toMulti(f['Expertise Areas']),
          'Speaking Topics': toSingle(f['Speaking Topics']),
          'Key Messages': toSingle(f['Key Messages']),
          'Speakers Delivery Style': toSingle(f['Speakers Delivery Style']),
          'Why the audience should listen to these topics': toSingle(f['Why the audience should listen to these topics']),
          'What the speeches will address': toSingle(f['What the speeches will address']),
          'What participants will learn': toSingle(f['What participants will learn']),
          'What the audience will take home': toSingle(f['What the audience will take home']),
          'Benefits for the individual': toSingle(f['Benefits for the individual']),
          'Benefits for the organisation': toSingle(f['Benefits for the organisation']),
          'Header Image': Array.isArray(f['Header Image']) ? f['Header Image'] : [],
          'Video Link 1': toSingle(f['Video Link 1']),
          'Video Link 2': toSingle(f['Video Link 2']),
          'Video Link 3': toSingle(f['Video Link 3']),
          'Spoken Languages': toMulti(f['Spoken Languages']),
          'Fee Range General': toSingle(f['Fee Range General']),
          'Fee Range Local': toSingle(f['Fee Range Local']),
          'Fee Range Continental': toSingle(f['Fee Range Continental']),
          'Fee Range International': toSingle(f['Fee Range International']),
          'Fee Range Virtual': toSingle(f['Fee Range Virtual']),
          'Travel Willingness': toSingle(f['Travel Willingness']),
          'Travel Requirements': toSingle(f['Travel Requirements']),
          'Website': toSingle(f['Website']),
          'LinkedIn': toSingle(f['LinkedIn']),
          'Twitter': toSingle(f['Twitter'] || f['Twitter/X Profile']),
          'References': toSingle(f['References']),
          'Banking Details': toSingle(f['Banking Details']),
          'PA Name': toSingle(f['PA Name']),
          'PA Email': toSingle(f['PA Email']),
          'PA Phone': toSingle(f['PA Phone']),
          'Special Requirements': toSingle(f['Special Requirements']),
          'Additional Info': toSingle(f['Additional Info']),
        }));
        setLoading(false);
      } catch (e) {
        setErr(e.message || 'Failed to load profile'); setLoading(false);
      }
    })();
  }, [navigate]);

  const handleChange = (field, value) => setForm((x) => ({ ...x, [field]: value }));

  const handleSave = async (closeAfter = false) => {
    if (!recordId) return;
    setSaving(true); setErr('');
    try {
      const payload = {
        'First Name': fromSingle(form['First Name']),
        'Last Name': fromSingle(form['Last Name']),
        // Email is key – keep read-only
        'Phone': fromSingle(form['Phone']),
        'Professional Title': fromSingle(form['Professional Title']),
        'Company': fromSingle(form['Company']),
        'Location': fromSingle(form['Location']),
        'Country': fromSingle(form['Country']),
        // Keep existing attachment objects if unchanged
        'Profile Image': Array.isArray(form['Profile Image']) && form['Profile Image'].length ? form['Profile Image'] : undefined,

        'Professional Bio': fromSingle(form['Professional Bio']),
        'Education': fromSingle(form['Education']),
        'Achievements': fromSingle(form['Achievements']),

        'Years Experience': fromSingle(form['Years Experience']),
        'Speaking Experience': fromSingle(form['Speaking Experience']),
        'Number of Events': fromSingle(form['Number of Events']),
        'Largest Audience': fromSingle(form['Largest Audience']),
        'Virtual Experience': fromSingle(form['Virtual Experience']),

        'Industry': fromSingle(form['Industry']),
        'Expertise Areas': fromMulti(form['Expertise Areas']),
        'Speaking Topics': fromSingle(form['Speaking Topics']),
        'Key Messages': fromSingle(form['Key Messages']),

        'Speakers Delivery Style': fromSingle(form['Speakers Delivery Style']),
        'Why the audience should listen to these topics': fromSingle(form['Why the audience should listen to these topics']),
        'What the speeches will address': fromSingle(form['What the speeches will address']),
        'What participants will learn': fromSingle(form['What participants will learn']),
        'What the audience will take home': fromSingle(form['What the audience will take home']),
        'Benefits for the individual': fromSingle(form['Benefits for the individual']),
        'Benefits for the organisation': fromSingle(form['Benefits for the organisation']),

        'Header Image': Array.isArray(form['Header Image']) && form['Header Image'].length ? form['Header Image'] : undefined,
        'Video Link 1': fromSingle(form['Video Link 1']),
        'Video Link 2': fromSingle(form['Video Link 2']),
        'Video Link 3': fromSingle(form['Video Link 3']),
        'Spoken Languages': fromMulti(form['Spoken Languages']),

        'Fee Range General': fromSingle(form['Fee Range General']),
        'Fee Range Local': fromSingle(form['Fee Range Local']),
        'Fee Range Continental': fromSingle(form['Fee Range Continental']),
        'Fee Range International': fromSingle(form['Fee Range International']),
        'Fee Range Virtual': fromSingle(form['Fee Range Virtual']),
        'Travel Willingness': fromSingle(form['Travel Willingness']),
        'Travel Requirements': fromSingle(form['Travel Requirements']),

        'Website': fromSingle(form['Website']),
        'LinkedIn': fromSingle(form['LinkedIn']),
        'Twitter': fromSingle(form['Twitter']),
        'References': fromSingle(form['References']),
        'Banking Details': fromSingle(form['Banking Details']),
        'PA Name': fromSingle(form['PA Name']),
        'PA Email': fromSingle(form['PA Email']),
        'PA Phone': fromSingle(form['PA Phone']),
        'Special Requirements': fromSingle(form['Special Requirements']),
        'Additional Info': fromSingle(form['Additional Info']),
      };

      await updateSpeakerRecord(recordId, payload);
      if (closeAfter) navigate('/speaker-dashboard', { replace: true });
    } catch (e) {
      setErr(e.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  // ---- simple UI (mirrors your tabs; style can be swapped for your Modal) ----
  if (loading) return <PageWrap><h1>Loading your profile…</h1></PageWrap>;
  return (
    <PageWrap>
      <h1>Edit My Profile</h1>
      <p>Signed in as <strong>{email}</strong></p>
      {err && <p style={{color:'crimson'}}>{err}</p>}

      <div style={{display:'flex', gap:8, flexWrap:'wrap', margin:'16px 0'}}>
        {tabs.map(t => (
          <button key={t.key}
            onClick={() => setActiveTab(t.key)}
            style={{
              padding:'8px 12px', borderRadius:999, border:'1px solid #ddd',
              background: activeTab===t.key ? 'black' : 'white',
              color: activeTab===t.key ? 'white' : 'black'
            }}>
            {t.key}
          </button>
        ))}
      </div>

      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:16}}>
        {tabs.find(t => t.key===activeTab).fields.map((field) => (
          <Field
            key={field}
            label={field}
            value={form[field]}
            onChange={(v)=>handleChange(field, v)}
          />
        ))}
      </div>

      <div style={{marginTop:24, display:'flex', gap:12}}>
        <button disabled={saving} onClick={() => handleSave(false)}>Save</button>
        <button disabled={saving} onClick={() => handleSave(true)} style={{background:'black', color:'white'}}>Save & Close</button>
        <button onClick={() => navigate('/speaker-dashboard')}>Cancel</button>
      </div>
    </PageWrap>
  );
}

function PageWrap({children}) {
  return <div style={{padding:24, maxWidth:1100, margin:'0 auto'}}>{children}</div>;
}

// Minimal field renderer; swap with your existing Input components later
function Field({label, value, onChange}) {
  const isLong = [
    'Professional Bio','Education','Achievements','Speaking Topics','Key Messages',
    'Speakers Delivery Style','Why the audience should listen to these topics',
    'What the speeches will address','What participants will learn',
    'What the audience will take home','Benefits for the individual',
    'Benefits for the organisation','Travel Requirements','References',
    'Banking Details','Special Requirements','Additional Info'
  ].includes(label);

  // Multi-select chips (simple comma list for now)
  const isMulti = ['Expertise Areas','Spoken Languages'].includes(label);

  // Attachments are shown read-only for Phase-1 (keep existing URLs)
  const isAttachment = ['Profile Image','Header Image'].includes(label);

  if (isAttachment) {
    return (
      <div style={{gridColumn:'1 / -1'}}>
        <div style={{fontWeight:600, marginBottom:4}}>{label}</div>
        {Array.isArray(value) && value.length
          ? <ul>{value.map((a,i)=><li key={i}><a href={a.url} target="_blank" rel="noreferrer">{a.filename || a.url}</a></li>)}</ul>
          : <em>No file selected</em>}
        <div style={{fontSize:12, color:'#666'}}>File uploads: enable in Phase-2 (we’ll wire S3/Cloudinary and update Airtable attachments).</div>
      </div>
    );
  }

  if (isMulti) {
    return (
      <div>
        <div style={{fontWeight:600, marginBottom:4}}>{label}</div>
        <input
          type="text"
          value={Array.isArray(value) ? value.join(', ') : ''}
          onChange={(e)=>onChange(e.target.value.split(',').map(x=>x.trim()).filter(Boolean))}
          placeholder="Comma-separate choices (must match Airtable options)"
        />
      </div>
    );
  }

  if (isLong) {
    return (
      <div style={{gridColumn:'1 / -1'}}>
        <div style={{fontWeight:600, marginBottom:4}}>{label}</div>
        <textarea rows={6} value={value || ''} onChange={(e)=>onChange(e.target.value)} />
      </div>
    );
  }

  const type = label.toLowerCase().includes('email') ? 'email'
             : label.toLowerCase().includes('url') || ['Website','LinkedIn','Twitter','Video Link 1','Video Link 2','Video Link 3'].includes(label) ? 'url'
             : label.toLowerCase().includes('phone') ? 'tel'
             : 'text';

  return (
    <div>
      <div style={{fontWeight:600, marginBottom:4}}>{label}</div>
      <input type={type} value={value || ''} onChange={(e)=>onChange(e.target.value)} />
    </div>
  );
}
