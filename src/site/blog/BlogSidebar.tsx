import React, { useEffect, useMemo, useState } from 'react';
import { listPublicPosts } from '../../lib/airtable';
import './blog.css';

function cld(u?: string, t='w_160,f_auto,q_auto,c_fill,g_auto'){
  return u && u.includes('/upload/') ? u.replace('/upload/','/upload/'+t+'/') : u;
}
function thumbOf(p:any){
  const raw = typeof p['Hero Image']==='string' ? p['Hero Image'] :
    (Array.isArray(p['Hero Image']) && p['Hero Image'][0]?.url) ? p['Hero Image'][0].url : '';
  return cld(raw);
}

export default function BlogSidebar({ currentSlug }: { currentSlug?: string }) {
  const [rows,setRows]=useState<any[]>([]);
  useEffect(()=>{(async()=>{ setRows(await listPublicPosts(12)); })();},[]);

  const latest = useMemo(()=> rows.filter(r=>r.Slug!==currentSlug).slice(0,3),[rows,currentSlug]);

  const topics = useMemo(()=>{
    const counts: Record<string,number> = {};
    rows.forEach(r => (Array.isArray(r.Tags)?r.Tags:[]).forEach((t:string)=>{counts[t]=(counts[t]||0)+1;}));
    return Object.entries(counts).sort((a,b)=>b[1]-a[1]).slice(0,8).map(e=>e[0]);
  },[rows]);

  return (
    <aside className="blog-sidebar">
      <div className="sb-card">
        <h3 className="sb-title">Quick Inquiry</h3>
        <a className="btn" href="/#/contact">Book a Workshop</a>
      </div>

      <div className="sb-card">
        <h3 className="sb-title">Latest Articles</h3>
        {latest.map(p=>(
          <a key={p.Slug||p.id} href={`/#/blog/${p.Slug}`} className="latest-item">
            <img className="latest-thumb" src={thumbOf(p)} alt="" loading="lazy"/>
            <div>
              <div style={{fontWeight:700,lineHeight:1.2}}>{p.Name}</div>
              <div className="latest-meta">
                {p['Publish Date'] ? new Date(p['Publish Date']).toLocaleDateString() : ''}
              </div>
            </div>
          </a>
        ))}
      </div>

      <div className="sb-card">
        <h3 className="sb-title">Popular Topics</h3>
        <div className="tag-list">
          {topics.map(t=> <a key={t} className="tag" href={`/#/blog?tag=${encodeURIComponent(t)}`}>{t}</a>)}
        </div>
      </div>
    </aside>
  );
}
