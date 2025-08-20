import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { getPostBySlug, isPostVisible } from '../../lib/airtable';
import './blog.css';

declare global { interface Window { DOMPurify: any } }
function useQuery(){ return new URLSearchParams(useLocation().search); }

function toYouTubeEmbed(url?: string){
  if(!url) return null;
  try{
    if(url.includes('watch?v=')){ const u=new URL(url); const id=u.searchParams.get('v'); return id?`https://www.youtube.com/embed/${id}`:url; }
    if(url.includes('youtu.be/')){ const id=url.split('youtu.be/')[1].split(/[?&]/)[0]; return `https://www.youtube.com/embed/${id}`; }
  }catch{}
  return url;
}

// add Cloudinary auto-optimizations if possible
function cld(url?: string, transform='f_auto,q_auto'){
  if(!url) return url;
  if(url.includes('res.cloudinary.com') && url.includes('/upload/')){
    return url.replace('/upload/','/upload/'+transform+'/');
  }
  return url;
}

// basic SEO without extra libs
function upsertMeta(name:string, content:string){
  let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
  if(!el){ el=document.createElement('meta'); el.setAttribute('name',name); document.head.appendChild(el); }
  el.setAttribute('content',content);
}
function upsertOG(property:string, content:string){
  let el = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null;
  if(!el){ el=document.createElement('meta'); el.setAttribute('property',property); document.head.appendChild(el); }
  el.setAttribute('content',content);
}

export default function BlogPost(){
  const { slug } = useParams();
  const q = useQuery();
  const preview = q.get('preview')==='1';

  const [post, setPost] = useState<any|null>(null);
  const [state, setState] = useState<'loading'|'notfound'|'forbidden'|'ready'>('loading');

  useEffect(()=>{ (async()=>{
    const rec = await getPostBySlug(slug||'');
    if(!rec) return setState('notfound');
    if(!isPostVisible(rec, preview)) return setState('forbidden');
    setPost(rec); setState('ready');
  })(); },[slug,preview]);

  useEffect(()=>{ if(!post) return;
    const title = post['OG Title'] || post.Name;
    const desc = post['OG Description'] || post.Excerpt || '';
    const hero = typeof post['Hero Image']==='string' ? post['Hero Image'] :
      (Array.isArray(post['Hero Image']) && post['Hero Image'][0]?.url) ? post['Hero Image'][0].url : '';
    const ogImage = post['OG Image'] || cld(hero, 'w_1200,h_630,c_fill,f_auto,q_auto');

    document.title = `${title} — African Speaker Bureau`;
    upsertMeta('description', desc);
    upsertOG('og:title', title);
    upsertOG('og:description', desc);
    if(ogImage) upsertOG('og:image', ogImage);
  },[post]);

  if(state!=='ready'){
    const msg =
      state==='loading' ? 'Loading…' :
      state==='notfound' ? 'Post not found.' :
      'This post is not published yet.';
    return <article className="asb-blog blog-article">{msg}</article>;
  }

  const heroImage =
    typeof post['Hero Image'] === 'string' ? post['Hero Image'] :
    (Array.isArray(post['Hero Image']) && post['Hero Image'][0]?.url) ? post['Hero Image'][0].url : null;

  const videoEmbed = toYouTubeEmbed(post['Hero Video URL']);
  const safeBody =
    (typeof window!=='undefined' && window.DOMPurify)
      ? window.DOMPurify.sanitize(post.Body || '')
      : (post.Body || '');

  return (
    <article className="asb-blog blog-article">
      <header className="blog-header">
        <h1 className="blog-title">{post.Name}</h1>
        {post['Publish Date'] && (
          <div className="blog-date">
            {new Date(post['Publish Date']).toLocaleDateString(undefined,{weekday:'short',year:'numeric',month:'short',day:'numeric'})}
          </div>
        )}
        {post.Excerpt && <p className="blog-excerpt">{post.Excerpt}</p>}
      </header>

      {post.Type==='Video' && videoEmbed && (
        <div className="blog-hero aspect-video">
          <iframe
            src={videoEmbed} title="Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen />
        </div>
      )}

      {post.Type!=='Video' && heroImage && (
        <img className="blog-hero" src={cld(heroImage,'w_1600,f_auto,q_auto')} alt="" loading="lazy" />
      )}

      <div className="rich-content" dangerouslySetInnerHTML={{ __html: safeBody }} />
    </article>
  );
}
