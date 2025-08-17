import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { getPostBySlug, isPostVisible } from '@/lib/airtable';

function useQuery() { return new URLSearchParams(useLocation().search); }

function toYouTubeEmbed(url?: string) {
  if (!url) return null;
  try {
    if (url.includes('watch?v=')) {
      const u = new URL(url);
      const id = u.searchParams.get('v');
      return id ? `https://www.youtube.com/embed/${id}` : url;
    }
    if (url.includes('youtu.be/')) {
      const id = url.split('youtu.be/')[1].split(/[?&]/)[0];
      return `https://www.youtube.com/embed/${id}`;
    }
  } catch {}
  return url; // already an embed or other provider
}

export default function BlogPost() {
  const { slug } = useParams();
  const q = useQuery();
  const preview = q.get('preview') === '1';

  const [post, setPost] = useState<any | null>(null);
  const [state, setState] = useState<'loading'|'notfound'|'forbidden'|'ready'>('loading');

  useEffect(() => {
    (async () => {
      const rec = await getPostBySlug(slug || '');
      if (!rec) return setState('notfound');
      if (!isPostVisible(rec, preview)) return setState('forbidden');
      setPost(rec);
      setState('ready');
    })();
  }, [slug, preview]);

  if (state === 'loading') return <div className="p-6">Loading…</div>;
  if (state === 'notfound') return <div className="p-6">Post not found.</div>;
  if (state === 'forbidden') return <div className="p-6">This post is not published yet.</div>;

  const heroImage =
    typeof post['Hero Image'] === 'string' ? post['Hero Image'] :
    (Array.isArray(post['Hero Image']) && post['Hero Image'][0]?.url) ? post['Hero Image'][0].url : null;

  const videoEmbed = toYouTubeEmbed(post['Hero Video URL']);

  const safeBody =
    (typeof window !== 'undefined' && window.DOMPurify)
      ? window.DOMPurify.sanitize(post.Body || '')
      : (post.Body || '');

  return (
    <article className="max-w-3xl mx-auto p-6 space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">{post.Name}</h1>
        {post['Publish Date'] && <div className="text-sm text-gray-600">{new Date(post['Publish Date']).toDateString()}</div>}
        {post.Excerpt && <p className="text-gray-700">{post.Excerpt}</p>}
      </header>

      {post.Type === 'Video' && videoEmbed && (
        <div className="aspect-video">
          <iframe
            src={videoEmbed}
            width="100%" height="100%" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen frameBorder={0} title="Video"
            className="w-full h-full"
          />
        </div>
      )}

      {post.Type !== 'Video' && heroImage && (
        <img src={heroImage} alt="" className="w-full rounded" loading="lazy" />
      )}

      <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: safeBody }} />
    </article>
  );
}

