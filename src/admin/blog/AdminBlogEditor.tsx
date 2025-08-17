import React, { useEffect, useRef, useState } from 'react';
import { createPost, getPost, updatePost } from '@/lib/airtable.ts';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { useNavigate, useParams } from 'react-router-dom';

declare global { interface Window { ClassicEditor: any; DOMPurify: any } }

export default function AdminBlogEditor() {
  const { id } = useParams();
  const nav = useNavigate();

  const [loading, setLoading] = useState(true);
  const [initialBody, setInitialBody] = useState<string>('');
  const [form, setForm] = useState<any>({
    Name:'', Slug:'', Status:'Draft', Type:'Article', Excerpt:'',
    'Hero Image':'', 'Hero Video URL':'', 'Publish Date':'',
    Author:'', Tags:'', Featured:false, 'Pin Order':0
  });

  const editorElem = useRef<HTMLDivElement>(null);
  const editorInstance = useRef<any>(null);

  function set<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm(p => ({ ...p, [k]: v }));
  }

  useEffect(() => {
    (async () => {
      // Load record if editing
      if (id && id !== 'new') {
        const r = await getPost(id);
        setForm({
          Name: r.Name || '',
          Slug: (r as any).Slug || '',
          Status: (r as any).Status || 'Draft',
          Type: (r as any).Type || 'Article',
          Excerpt: (r as any).Excerpt || '',
          'Hero Image': (r as any)['Hero Image'] || '',
          'Hero Video URL': (r as any)['Hero Video URL'] || '',
          'Publish Date': (r as any)['Publish Date'] || '',
          Author: (r as any).Author || '',
          Tags: Array.isArray((r as any).Tags) ? (r as any).Tags.join(', ') : ((r as any).Tags || ''),
          Featured: !!(r as any).Featured,
          'Pin Order': (r as any)['Pin Order'] || 0
        });
        setInitialBody((r as any).Body || '');
      }

      // Init CKEditor (CDN)
      if (editorElem.current && !editorInstance.current) {
        const ClassicEditor = window.ClassicEditor;
        editorInstance.current = await ClassicEditor.create(editorElem.current, {
          toolbar: [
            'heading', '|', 'bold', 'italic', 'link',
            'bulletedList', 'numberedList', 'blockQuote',
            'insertTable', 'horizontalLine', '|',
            'imageUpload', 'undo', 'redo'
          ]
        });

        // Wire image upload → Cloudinary
        editorInstance.current.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
          return {
            upload: () => loader.file.then(async (file: File) => {
              const url = await uploadToCloudinary(file);
              return { default: url };
            }),
            abort: () => {}
          };
        };

        // Prefill body
        if (initialBody) editorInstance.current.setData(initialBody);
      }

      setLoading(false);
    })();

    return () => { editorInstance.current?.destroy?.(); editorInstance.current = null; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, initialBody]);

  async function save() {
    if (!form.Name?.trim()) return alert('Title is required');
    if (!form.Slug?.trim()) return alert('Slug is required');
    if (form.Status !== 'Draft' && !form['Publish Date']) return alert('Publish Date required for Scheduled/Published');
    if (form.Type === 'Video' && !form['Hero Video URL']) return alert('Hero Video URL required for Video');

    const raw = editorInstance.current?.getData?.() || '';
    const Body = window.DOMPurify ? window.DOMPurify.sanitize(raw) : raw;

    const payload: any = {
      Name: form.Name,
      Slug: form.Slug.toLowerCase().replace(/\s+/g,'-'),
      Status: form.Status,
      Type: form.Type,
      Excerpt: form.Excerpt,
      'Hero Image': form['Hero Image'] || undefined,
      'Hero Video URL': form['Hero Video URL'] || undefined,
      'Publish Date': form['Publish Date'] || undefined,
      Author: form.Author || undefined,
      Tags: String(form.Tags || '').split(',').map((s:string)=>s.trim()).filter(Boolean),
      Featured: !!form.Featured,
      'Pin Order': Number(form['Pin Order'] || 0),
      Body
    };

    if (id && id !== 'new') {
      await updatePost(id, payload);
    } else {
      const rec = await createPost(payload);
      return nav(`/admin/blog/${rec.id}`);
    }
    alert('Saved');
  }

  function preview() {
    if (!form.Slug) return alert('Add a Slug first');
    window.open(`/#/blog/${form.Slug}?preview=1`, '_blank');
  }

  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Side fields */}
        <div className="space-y-3">
          <label className="block">Title
            <input className="mt-1 border p-2 rounded w-full" value={form.Name} onChange={e=>set('Name', e.target.value)} />
          </label>
          <label className="block">Slug
            <input className="mt-1 border p-2 rounded w-full" value={form.Slug} onChange={e=>set('Slug', e.target.value)} />
          </label>
          <label className="block">Status
            <select className="mt-1 border p-2 rounded w-full" value={form.Status} onChange={e=>set('Status', e.target.value)}>
              <option>Draft</option><option>Scheduled</option><option>Published</option>
            </select>
          </label>
          <label className="block">Publish Date
            <input type="date" className="mt-1 border p-2 rounded w-full" value={form['Publish Date'] || ''} onChange={e=>set('Publish Date', e.target.value)} />
          </label>
          <label className="block">Type
            <select className="mt-1 border p-2 rounded w-full" value={form.Type} onChange={e=>set('Type', e.target.value)}>
              <option>Article</option><option>Video</option>
            </select>
          </label>
          <label className="block">Hero Video URL (for Video)
            <input className="mt-1 border p-2 rounded w-full" value={form['Hero Video URL']} onChange={e=>set('Hero Video URL', e.target.value)} />
          </label>
          <label className="block">Hero Image URL (optional)
            <input className="mt-1 border p-2 rounded w-full" value={form['Hero Image']} onChange={e=>set('Hero Image', e.target.value)} />
          </label>
          <label className="block">Excerpt
            <textarea className="mt-1 border p-2 rounded w-full" rows={3} value={form.Excerpt} onChange={e=>set('Excerpt', e.target.value)} />
          </label>
          <label className="block">Author
            <input className="mt-1 border p-2 rounded w-full" value={form.Author} onChange={e=>set('Author', e.target.value)} />
          </label>
          <label className="block">Tags (comma-separated)
            <input className="mt-1 border p-2 rounded w-full" value={form.Tags} onChange={e=>set('Tags', e.target.value)} />
          </label>
          <label className="block flex items-center gap-2">
            <input type="checkbox" checked={!!form.Featured} onChange={e=>set('Featured', e.target.checked)} />
            Featured
          </label>
          <label className="block">Pin Order
            <input type="number" className="mt-1 border p-2 rounded w-full" value={form['Pin Order']} onChange={e=>set('Pin Order', Number(e.target.value))} />
          </label>

          <div className="flex gap-2 pt-2">
            <button onClick={save} className="px-3 py-2 border rounded">Save</button>
            <button onClick={preview} className="px-3 py-2 border rounded">Preview</button>
            <button onClick={()=>nav('/admin/blog')} className="ml-auto px-3 py-2 border rounded">Back</button>
          </div>
        </div>

        {/* CKEditor canvas */}
        <div className="md:col-span-2">
          <div className="border rounded p-2">
            <div ref={editorElem}></div>
            {loading && <div className="p-4 text-sm text-gray-500">Loading editor…</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

