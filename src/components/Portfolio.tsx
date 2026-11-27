'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { ArrowDown, ArrowDownRight, ArrowUpRight, Braces, Check, Code2, Cpu, Database, Github, GraduationCap, Instagram, Linkedin, Mail, MapPin, Menu, Moon, Search, Sparkles, Star, Sun, X, Terminal, Smartphone, Wifi, Layers } from 'lucide-react';
import { site } from '@/config/site';
import { featuredProjects } from '@/config/featured';
import type { Project } from '@/types/github';

type Props = { projects: Project[]; profile: { public_repos: number; followers: number } | null; languages: string[]; isFallback: boolean };
const languageColors: Record<string, string> = { TypeScript: '#47a9eb', JavaScript: '#f2cc60', Python: '#8caaee', HTML: '#e78284', CSS: '#ca9ee6', 'C++': '#ef9f76', PHP: '#babbf1' };
const experiences = [
  { date: 'Pengalaman', title: 'Magang — Bakesbangpol Ponorogo', text: 'Membantu pembaruan website instansi, merapikan tampilan publik, dan membangun dashboard admin untuk pengelolaan berita.', tags: ['Web Instansi', 'Dashboard Admin', 'CMS'], icon: Braces },
  { date: 'Riset & Eksplorasi', title: 'Pengembangan Proyek AI & IoT', text: 'Mengeksplorasi deteksi video deepfake berbasis deep learning serta merangkai prototipe perangkat cerdas menggunakan ESP32.', tags: ['Python', 'TensorFlow', 'ESP32'], icon: Cpu },
  { date: '2022 — sekarang', title: 'Universitas Muhammadiyah Ponorogo', text: 'Mahasiswa semester 7, Program Studi Informatika, Fakultas Teknik. Aktif membangun produk web full stack dan solusi digital.', tags: ['Informatika', 'Full Stack', 'Semester 7'], icon: GraduationCap },
];
const reveal = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } } };
const revealLeft = { hidden: { opacity: 0, x: -38 }, show: { opacity: 1, x: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } } };
const revealRight = { hidden: { opacity: 0, x: 38 }, show: { opacity: 1, x: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } } };
const revealScale = { hidden: { opacity: 0, scale: 0.91 }, show: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } } };
const revealVariants = { up: reveal, left: revealLeft, right: revealRight, scale: revealScale };
type CodePreview = { path: string; language: string; code: string };
const previewCache = new Map<string, CodePreview | null>();
const blurPlaceholder = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';
const heroCodeLines = ['const saya = {', '  nama: "Faza",', '  fokus: "Web · AI · IoT",', '  kampus: "UMPO"', '};'];

function TikTokIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
  );
}

function CustomCursor({ reduced }: { reduced: boolean }) {
  const [enabled, setEnabled] = useState(false);
  const [cursorState, setCursorState] = useState<'default' | 'interactive' | 'text'>('default');
  const [pressed, setPressed] = useState(false);
  const [visible, setVisible] = useState(false);
  const rawX = useMotionValue(-100);
  const rawY = useMotionValue(-100);
  const ringX = useSpring(rawX, { stiffness: 320, damping: 28, mass: 0.45 });
  const ringY = useSpring(rawY, { stiffness: 320, damping: 28, mass: 0.45 });
  const dotX = useSpring(rawX, { stiffness: 900, damping: 38, mass: 0.15 });
  const dotY = useSpring(rawY, { stiffness: 900, damping: 38, mass: 0.15 });

  useEffect(() => {
    if (reduced || typeof window === 'undefined') return;
    const fine = window.matchMedia('(pointer: fine)');
    const sync = () => setEnabled(fine.matches);
    sync();
    fine.addEventListener('change', sync);
    return () => fine.removeEventListener('change', sync);
  }, [reduced]);

  useEffect(() => {
    if (!enabled) return;
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      rawX.set(event.clientX);
      rawY.set(event.clientY);
      setVisible(true);
      const target = event.target as HTMLElement | null;
      if (!target) return;
      if (target.closest('a, button, input, .project-card, .tech-tile, .filter-chip, .focus-row')) {
        setCursorState('interactive');
      } else if (target.closest('h1, h2, h3, .hover-word')) {
        setCursorState('text');
      } else {
        setCursorState('default');
      }
    };
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);
    const onLeave = () => setVisible(false);

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    window.addEventListener('pointerup', onUp, { passive: true });
    document.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      document.removeEventListener('mouseleave', onLeave);
    };
  }, [enabled, rawX, rawY]);

  if (!enabled || reduced) return null;
  return (
    <div className={`custom-cursor ${visible ? 'is-visible' : ''} is-${cursorState} ${pressed ? 'is-pressed' : ''}`} aria-hidden="true">
      <motion.span className="custom-cursor-ring" style={{ x: ringX, y: ringY }} />
      <motion.span className="custom-cursor-dot" style={{ x: dotX, y: dotY }} />
    </div>
  );
}

function MagneticLink({ href, children, className, reduced }: { href: string; children: React.ReactNode; className: string; reduced: boolean }) {
  const rawX = useMotionValue(0); const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 180, damping: 18 }); const y = useSpring(rawY, { stiffness: 180, damping: 18 });
  return <motion.a href={href} className={className} style={reduced ? undefined : { x, y }} onPointerMove={(event) => {
    if (reduced || event.pointerType !== 'mouse') return;
    const rect = event.currentTarget.getBoundingClientRect(); rawX.set((event.clientX - rect.left - rect.width / 2) * 0.12); rawY.set((event.clientY - rect.top - rect.height / 2) * 0.16);
  }} onPointerLeave={() => { rawX.set(0); rawY.set(0); }}>{children}</motion.a>;
}

function CodeCard({ reduced }: { reduced: boolean }) {
  const [line, setLine] = useState(0); const [text, setText] = useState('');
  useEffect(() => {
    if (reduced) { setLine(heroCodeLines.length); setText(''); return; }
    let stopped = false; let timeout = 0; let index = 0; let lineIndex = 0;
    const type = () => {
      if (stopped) return;
      if (lineIndex >= heroCodeLines.length) { timeout = window.setTimeout(() => { lineIndex = 0; index = 0; setLine(0); setText(''); timeout = window.setTimeout(type, 900); }, 2600); return; }
      const current = heroCodeLines[lineIndex]; index += 1; setLine(lineIndex); setText(current.slice(0, index));
      if (index >= current.length) { lineIndex += 1; index = 0; timeout = window.setTimeout(type, 190); }
      else timeout = window.setTimeout(type, 34);
    };
    timeout = window.setTimeout(type, 950);
    return () => { stopped = true; window.clearTimeout(timeout); };
  }, [reduced]);
  return <Glass className="float-note note-code code-card" aria-label="Cuplikan kode perkenalan"> <span className="code-top"><i /><i /><i /><small>profil.js</small></span><code>{heroCodeLines.slice(0, line).map((item) => <span key={item}>{item}</span>)}<span>{text}<i className="typing-caret" /></span></code></Glass>;
}

type PaletteEntry = { group: string; label: string; icon: React.ReactNode; run: () => void };
function CommandPalette({ open, close, projects, navigate, chooseProject, copyEmail, toggleTheme }: { open: boolean; close: () => void; projects: Project[]; navigate: (section: string) => void; chooseProject: (project: Project) => void; copyEmail: () => void; toggleTheme: () => void }) {
  const [query, setQuery] = useState(''); const [selectedIndex, setSelectedIndex] = useState(0); const inputRef = useRef<HTMLInputElement>(null);
  const sections = ['Beranda', 'Tentang', 'Proyek', 'Keahlian', 'Perjalanan', 'Kontak'];
  const entries: PaletteEntry[] = [
    ...sections.map((section) => ({ group: 'Navigasi', label: `Buka bagian ${section}`, icon: <ArrowDownRight size={15} />, run: () => navigate(section) })),
    ...projects.filter((project) => (project.displayName || project.name).toLowerCase().includes(query.toLowerCase())).slice(0, 5).map((project) => ({ group: 'Proyek', label: project.displayName || project.name, icon: <Layers size={15} />, run: () => chooseProject(project) })),
    ...(site.email ? [{ group: 'Aksi', label: 'Salin alamat email', icon: <Mail size={15} />, run: copyEmail }] : []),
    { group: 'Aksi', label: 'Ganti tema terang / gelap', icon: <Sun size={15} />, run: toggleTheme },
    { group: 'Aksi', label: 'Buka GitHub', icon: <Github size={15} />, run: () => window.open(`https://github.com/${site.githubUsername}`, '_blank', 'noopener,noreferrer') },
    ...(site.instagram ? [{ group: 'Aksi', label: 'Buka Instagram', icon: <Instagram size={15} />, run: () => window.open(site.instagram, '_blank', 'noopener,noreferrer') }] : []),
    ...(site.tiktok ? [{ group: 'Aksi', label: 'Buka TikTok', icon: <TikTokIcon size={15} />, run: () => window.open(site.tiktok, '_blank', 'noopener,noreferrer') }] : []),
    ...(site.linkedin ? [{ group: 'Aksi', label: 'Buka LinkedIn', icon: <Linkedin size={15} />, run: () => window.open(site.linkedin, '_blank', 'noopener,noreferrer') }] : []),
  ].filter((entry) => entry.label.toLowerCase().includes(query.toLowerCase()));
  useEffect(() => { if (open) { setQuery(''); setSelectedIndex(0); window.setTimeout(() => inputRef.current?.focus(), 30); } }, [open]);
  useEffect(() => { setSelectedIndex(0); }, [query]);
  useEffect(() => {
    if (!open) return;
    const oldOverflow = document.body.style.overflow; const previousFocus = document.activeElement as HTMLElement | null; document.body.style.overflow = 'hidden';
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
      if (event.key === 'Tab') {
        const focusables = [...document.querySelectorAll<HTMLElement>('.palette input, .palette button')];
        if (focusables.length) { const first = focusables[0]; const last = focusables[focusables.length - 1]; if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); } else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); } }
      }
      if (event.key === 'ArrowDown') { event.preventDefault(); setSelectedIndex((index) => (index + 1) % Math.max(entries.length, 1)); }
      if (event.key === 'ArrowUp') { event.preventDefault(); setSelectedIndex((index) => (index - 1 + Math.max(entries.length, 1)) % Math.max(entries.length, 1)); }
      if (event.key === 'Enter' && entries[selectedIndex]) { event.preventDefault(); entries[selectedIndex].run(); close(); }
    };
    window.addEventListener('keydown', onKey); return () => { document.body.style.overflow = oldOverflow; window.removeEventListener('keydown', onKey); previousFocus?.focus(); };
  }, [open, close, entries, selectedIndex]);
  let position = -1;
  return <AnimatePresence>{open && <motion.div className="palette-backdrop" role="presentation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => { if (event.target === event.currentTarget) close(); }}><motion.div className="palette glass" role="dialog" aria-modal="true" aria-label="Pencarian cepat" initial={{ opacity: 0, y: 18, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: 0.98 }}><label className="palette-search"><Search size={17} /><input ref={inputRef} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari bagian, proyek, atau aksi..." aria-label="Cari bagian, proyek, atau aksi" /><kbd>ESC</kbd></label><div className="palette-results" role="listbox">{entries.length ? [...new Set(entries.map((entry) => entry.group))].map((group) => <section key={group}><span className="card-eyebrow">{group}</span>{entries.filter((entry) => entry.group === group).map((entry) => { position += 1; const itemIndex = position; return <button key={`${group}-${entry.label}`} role="option" aria-selected={selectedIndex === itemIndex} className="palette-option" onMouseEnter={() => setSelectedIndex(itemIndex)} onClick={() => { entry.run(); close(); }}>{entry.icon}<span>{entry.label}</span><ArrowUpRight size={13} /></button>; })}</section>) : <p className="palette-empty">Tidak ada hasil yang cocok.</p>}</div><div className="palette-hint"><span>↑ ↓ pilih</span><span>↵ buka</span><span>esc tutup</span></div></motion.div></motion.div>}</AnimatePresence>;
}

function Glass({ children, className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) { return <div className={`glass ${className}`} {...props}>{children}</div>; }
function usePointerGlow() {
  return { onPointerMove: (event: React.PointerEvent<HTMLElement> | React.MouseEvent<HTMLElement>) => { const rect = event.currentTarget.getBoundingClientRect(); event.currentTarget.style.setProperty('--mx', `${event.clientX - rect.left}px`); event.currentTarget.style.setProperty('--my', `${event.clientY - rect.top}px`); } };
}
function SectionHeading({ eyebrow, title, copy, direction = 'up' }: { eyebrow: string; title: React.ReactNode; copy?: string; direction?: 'up' | 'left' | 'right' | 'scale' }) {
  const reduceMotion = useReducedMotion();
  return <motion.div variants={revealVariants[direction]} initial={reduceMotion ? false : 'hidden'} whileInView={reduceMotion ? undefined : 'show'} viewport={{ once: true, amount: 0.25 }} className="section-heading"><span className="eyebrow">{eyebrow}</span><h2>{title}</h2>{copy && <p>{copy}</p>}</motion.div>;
}

function ProjectCard({ project, onOpen, index, dimmed = false }: { project: Project; onOpen: (project: Project) => void; index: number; dimmed?: boolean }) {
  const pointer = usePointerGlow();
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [preview, setPreview] = useState<CodePreview | null | undefined>(() => previewCache.get(project.name));
  const hoverTimer = useRef<number | null>(null);
  const reduceMotion = useReducedMotion();
  const name = project.displayName || project.name.replace(/[-_]/g, ' ').replace(/\b\p{L}/gu, (letter) => letter.toUpperCase());
  const description = project.displayDescription || project.description;
  const featured = project.featured || featuredProjects.some((item) => item.repo.toLowerCase() === project.name.toLowerCase());
  const cardVariant = index % 3 === 0 ? revealLeft : index % 3 === 1 ? revealScale : revealRight;

  useEffect(() => () => { if (hoverTimer.current) window.clearTimeout(hoverTimer.current); }, []);

  const handleEnter = () => {
    if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => {
      setHovered(true);
      if (previewCache.has(project.name)) {
        setPreview(previewCache.get(project.name));
        return;
      }
      fetch(`/api/projects/${encodeURIComponent(project.name)}/preview`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data: CodePreview | null) => {
          previewCache.set(project.name, data);
          setPreview(data);
        })
        .catch(() => {
          previewCache.set(project.name, null);
          setPreview(null);
        });
    }, 130);
  };

  const handleLeave = () => {
    if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
    setHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  return <motion.article layout layoutId={`project-${project.id}`} variants={cardVariant} initial={reduceMotion ? false : 'hidden'} whileInView={reduceMotion ? undefined : 'show'} viewport={{ once: true, amount: 0.15 }} transition={{ delay: reduceMotion ? 0 : Math.min(index * 0.045, 0.2) }} className={`project-card glass glow ${featured ? 'featured-card' : ''} ${dimmed ? 'project-dimmed' : ''}`} {...pointer}
    onMouseEnter={handleEnter}
    onMouseMove={(event) => { pointer.onPointerMove(event); if (reduceMotion) return; const rect = event.currentTarget.getBoundingClientRect(); const x = (event.clientX - rect.left) / rect.width - 0.5; const y = (event.clientY - rect.top) / rect.height - 0.5; setTilt({ x: y * -5, y: x * 6 }); event.currentTarget.style.setProperty('--px', `${x * 12}px`); event.currentTarget.style.setProperty('--py', `${y * 8}px`); }}
    onMouseLeave={handleLeave} style={{ transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}>
    <button className="card-open" onClick={() => onOpen(project)} aria-label={`Lihat detail ${name}`}><span className="project-index">{String(index + 1).padStart(2, '0')} / PROYEK</span><span className="card-arrow"><ArrowUpRight size={18} /></span>
      {featured && <span className="featured-label"><Sparkles size={12} /> Pilihan</span>}
      <h3>{name}</h3>{description && <p>{description}</p>}
      <div className="project-meta"><span><i className="language-dot" style={{ backgroundColor: languageColors[project.language || ''] || '#a5a5be' }} />{project.language || 'Eksplorasi'}</span><span><Star size={14} />{project.stargazers_count}</span><span>{new Date(project.updated_at).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })}</span></div>
      <div className="topic-list">{project.topics?.slice(0, 3).map((topic) => <span key={topic}>{topic}</span>)}</div>
    </button>
    <AnimatePresence>{hovered && (
      <motion.div className="project-hover-preview" initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 6, scale: 0.97 }} transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }} aria-hidden="true">
        <div className="preview-bar"><span className="preview-dots"><i /><i /><i /></span><small>{preview?.path || (project.image ? 'Pratinjau visual' : `${project.language || 'Repository'} · ${project.stargazers_count}★`)}</small><span className="preview-badge">{preview?.language || project.language || 'Preview'}</span></div>
        {project.image && <img className="preview-thumb" src={project.image} alt="" />}
        {preview?.code ? (
          <pre className="preview-code"><code>{preview.code.split('\n').slice(0, 6).join('\n')}</code></pre>
        ) : !project.image ? (
          <div className="preview-summary"><p>{description || 'Eksplorasi proyek & kode sumber di GitHub.'}</p><span>Klik kartu untuk ringkasan README & statistik bahasa ↗</span></div>
        ) : null}
      </motion.div>
    )}</AnimatePresence>
    <div className="card-actions"><a href={project.html_url} target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()}>Kode <ArrowUpRight size={14} /></a>{(project.displayDemo || project.homepage) && <a href={project.displayDemo || project.homepage || '#'} target="_blank" rel="noreferrer">Demo <ArrowUpRight size={14} /></a>}</div>
  </motion.article>;
}

function ProjectModal({ project, close }: { project: Project; close: () => void }) {
  const [details, setDetails] = useState<{ readme: string; languages: Record<string, number>; ok?: boolean } | null>(null);
  const [codePreview, setCodePreview] = useState<CodePreview | null | undefined>(() => previewCache.get(project.name));
  const modalRef = useRef<HTMLDivElement>(null);
  const projectName = project.displayName || project.name;
  useEffect(() => {
    let active = true;
    fetch(`/api/repo/${encodeURIComponent(project.name)}`).then((response) => response.json()).then((data) => { if (active) setDetails(data); }).catch(() => { if (active) setDetails({ readme: '', languages: {}, ok: false }); });
    if (!previewCache.has(project.name)) {
      fetch(`/api/projects/${encodeURIComponent(project.name)}/preview`).then((r) => (r.ok ? r.json() : null)).then((data: CodePreview | null) => { previewCache.set(project.name, data); if (active) setCodePreview(data); }).catch(() => { previewCache.set(project.name, null); if (active) setCodePreview(null); });
    }
    return () => { active = false; };
  }, [project.name]);
  useEffect(() => {
    const oldOverflow = document.body.style.overflow; const previousFocus = document.activeElement as HTMLElement | null; document.body.style.overflow = 'hidden';
    modalRef.current?.querySelector<HTMLElement>('button')?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
      if (event.key === 'Tab' && modalRef.current) {
        const focusables = [...modalRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')];
        if (!focusables.length) return;
        const first = focusables[0]; const last = focusables[focusables.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = oldOverflow; window.removeEventListener('keydown', onKey); previousFocus?.focus(); };
  }, [close]);
  const total = Object.values(details?.languages || {}).reduce((sum, value) => sum + value, 0);
  return <motion.div className="modal-backdrop modal-backdrop-frameless" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => { if (event.target === event.currentTarget) close(); }}>
    <motion.div ref={modalRef} layoutId={`project-${project.id}`} className="modal modal-frameless" initial={{ y: 24, scale: 0.96, opacity: 0 }} animate={{ y: 0, scale: 1, opacity: 1 }} exit={{ y: 16, scale: 0.97, opacity: 0 }} transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <button className="icon-button modal-close modal-close-floating" onClick={close} aria-label="Tutup detail"><X size={18} /></button>
      {project.image && <div className="modal-hero-media"><Image className="modal-thumbnail" src={project.image} alt={`Pratinjau proyek ${projectName}`} width={1000} height={560} sizes="(max-width: 640px) 100vw, 720px" placeholder="blur" blurDataURL={blurPlaceholder} priority /></div>}
      <div className="modal-frameless-body">
        <span className="eyebrow">PRATINJAU PROYEK</span>
        <h2 id="modal-title" className="gradient-text">{projectName}</h2>
        {(project.displayDescription || project.description) && <p className="modal-lead">{project.displayDescription || project.description}</p>}
        <div className="modal-meta"><span><i className="language-dot" style={{ backgroundColor: languageColors[project.language || ''] || '#a5a5be' }} /> {project.language || 'Eksplorasi'}</span><span><Star size={13} /> {project.stargazers_count}</span><span>Diperbarui {new Date(project.updated_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span></div>
        {codePreview?.code && <div className="modal-code-float"><div className="modal-code-head"><span>{codePreview.path}</span><small>{codePreview.language}</small></div><pre><code>{codePreview.code.split('\n').slice(0, 10).join('\n')}</code></pre></div>}
        <div className="modal-frameless-grid">
          <div className="modal-block"><h3>Ringkasan</h3>{details ? <p>{details.readme || (details.ok === false ? 'Informasi tambahan belum tersedia saat ini. Anda tetap dapat melihat repository proyek.' : 'Ringkasan README belum tersedia.')}</p> : <div className="skeleton-line" />}</div>
          <div className="modal-block"><h3>Komposisi bahasa</h3>{total > 0 ? <div className="language-bars">{Object.entries(details!.languages).sort((a, b) => b[1] - a[1]).map(([language, bytes]) => <div key={language}><div><span>{language}</span><span>{Math.round(bytes / total * 100)}%</span></div><i><b style={{ width: `${bytes / total * 100}%`, background: languageColors[language] || '#a78bfa' }} /></i></div>)}</div> : <p className="muted">Statistik bahasa belum tersedia.</p>}</div>
        </div>
        <div className="modal-actions"><a className="button button-primary" href={project.html_url} target="_blank" rel="noreferrer">Buka Kode <ArrowUpRight size={16} /></a>{(project.displayDemo || project.homepage) && <a className="button button-glass" href={project.displayDemo || project.homepage || '#'} target="_blank" rel="noreferrer">Lihat Demo <ArrowUpRight size={16} /></a>}</div>
      </div>
    </motion.div>
  </motion.div>;
}

export default function Portfolio({ projects, profile, languages, isFallback }: Props) {
  const [active, setActive] = useState('Beranda'); const [filter, setFilter] = useState('Semua'); const [search, setSearch] = useState(''); const [selected, setSelected] = useState<Project | null>(null);
  const [theme, setTheme] = useState<'gelap' | 'terang'>('gelap'); const [copied, setCopied] = useState(false); const [role, setRole] = useState(0); const [menuOpen, setMenuOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false); const [activeTech, setActiveTech] = useState<string | null>(null); const [techCategory, setTechCategory] = useState<string>('Semua'); const timelineRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion(); const { scrollYProgress } = useScroll(); const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const { scrollYProgress: journeyProgress } = useScroll({ target: timelineRef, offset: ['start 70%', 'end 70%'] });
  const journeyScale = useSpring(useTransform(journeyProgress, [0, 1], [0, 1]), { stiffness: 80, damping: 25 });
  const roles = ['Pengembang Full Stack', 'Penjelajah Data & AI', 'Perakit IoT']; const links = ['Beranda', 'Tentang', 'Proyek', 'Keahlian', 'Perjalanan', 'Kontak'];
  useEffect(() => {
    const saved = window.localStorage.getItem('faza-theme');
    setTheme(saved === 'terang' || saved === 'gelap' ? saved : window.matchMedia('(prefers-color-scheme: light)').matches ? 'terang' : 'gelap');
  }, []);
  function toggleTheme() { setTheme((current) => { const next = current === 'gelap' ? 'terang' : 'gelap'; window.localStorage.setItem('faza-theme', next); return next; }); }
  useEffect(() => {
    const onShortcut = (event: KeyboardEvent) => { if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); setPaletteOpen((open) => !open); } };
    window.addEventListener('keydown', onShortcut); return () => window.removeEventListener('keydown', onShortcut);
  }, []);
  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)');
    const move = (event: PointerEvent) => { if (event.pointerType !== 'mouse') return; document.documentElement.style.setProperty('--cursor-x', `${event.clientX}px`); document.documentElement.style.setProperty('--cursor-y', `${event.clientY}px`); document.documentElement.style.setProperty('--ambient-x', `${(event.clientX / window.innerWidth - 0.5) * 22}px`); document.documentElement.style.setProperty('--ambient-y', `${(event.clientY / window.innerHeight - 0.5) * 22}px`); };
    if (fine.matches && !reduceMotion) window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, [reduceMotion]);
  useEffect(() => {
    // Hentikan pergantian otomatis saat pengunjung meminta gerakan yang lebih sedikit.
    if (reduceMotion) return;
    const timer = window.setInterval(() => setRole((current) => (current + 1) % roles.length), 2900);
    return () => window.clearInterval(timer);
  }, [reduceMotion, roles.length]);
  useEffect(() => { const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) setActive(entry.target.id); }), { rootMargin: '-35% 0px -55% 0px' }); links.forEach((label) => { const element = document.getElementById(label === 'Beranda' ? 'beranda' : label.toLowerCase()); if (element) observer.observe(element); }); return () => observer.disconnect(); }, []);
  const filters = useMemo(() => ['Semua', ...new Set([...languages, ...projects.flatMap((project) => project.topics || [])])], [languages, projects]);
  const visibleProjects = useMemo(() => projects.filter((project) => (filter === 'Semua' || project.language === filter || project.topics?.includes(filter.toLowerCase())) && `${project.name} ${project.displayName || ''} ${project.description || ''} ${(project.topics || []).join(' ')}`.toLowerCase().includes(search.toLowerCase())), [projects, filter, search]);
  // GitHub mengurutkan proyek pilihan lebih dulu, lalu proyek populer.
  const featuredProjectsList = visibleProjects.slice(0, 3);
  const otherProjects = visibleProjects.slice(3);
  const technologyGroups = [
    { title: 'Web depan', icon: Code2, tone: 'lilac', items: ['HTML', 'CSS', 'JavaScript', 'React', 'Next.js', 'Tailwind CSS'] },
    { title: 'Web belakang', icon: Database, tone: 'blue', items: ['Node.js', 'Express', 'PHP', 'MySQL'] },
    { title: 'Data dan AI', icon: Sparkles, tone: 'pink', items: ['Python', 'TensorFlow', 'Keras', 'Google Colab'] },
    { title: 'Perangkat', icon: Cpu, tone: 'mint', items: ['Android Java/Kotlin', 'ESP32', 'Arduino'] },
  ];
  const technologyIcon = (technology: string) => /android|mobile/i.test(technology) ? Smartphone : /iot|esp|arduino/i.test(technology) ? Wifi : /database|mysql|sql/i.test(technology) ? Database : /ai|tensor|keras|python/i.test(technology) ? Sparkles : /node|express|php/i.test(technology) ? Terminal : /react|next|tailwind|html|css|javascript/i.test(technology) ? Code2 : Braces;
  const usesTechnology = (project: Project, technology: string) => [project.language || '', ...(project.topics || []), ...(project.tech || [])].some((item) => item.toLowerCase() === technology.toLowerCase() || item.toLowerCase().includes(technology.toLowerCase()));
  const topLanguage = Object.entries(projects.reduce<Record<string, number>>((counts, project) => { if (project.language) counts[project.language] = (counts[project.language] || 0) + 1; return counts; }, {})).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Python';
  async function copyEmail() { if (!site.email) return; try { await navigator.clipboard.writeText(site.email); setCopied(true); window.setTimeout(() => setCopied(false), 2200); } catch { window.location.href = `mailto:${site.email}`; } }
  return <main data-theme={theme} className="portfolio-shell">
    <div className="ambient"><span /><span /><span /><span /></div><div className="bg-grid-pattern" aria-hidden="true" /><div className="bg-ornaments" aria-hidden="true"><span className="ornament-ring ring-1" /><span className="ornament-ring ring-2" /><span className="ornament-cross cross-1">+</span><span className="ornament-cross cross-2">✦</span></div><div className="noise" />
    <motion.div className="scroll-progress" style={{ scaleX: progress }} />
    <div className="cursor-glow" aria-hidden="true" />
    <CustomCursor reduced={Boolean(reduceMotion)} />
    <header className="site-header"><a href="#beranda" className="brand"><span className="brand-mark">F<span>.</span></span><span>Faza<span className="brand-last"> Mughni</span></span></a><nav className={`nav-pill ${menuOpen ? 'nav-open' : ''}`} aria-label="Navigasi utama">{links.map((label) => <a href={`#${label === 'Beranda' ? 'beranda' : label.toLowerCase()}`} key={label} onClick={() => setMenuOpen(false)} className={active === label ? 'active' : ''}>{active === label && <motion.i layoutId="nav-active" className="nav-active" />}<span className="nav-label">{label}</span></a>)}</nav><div className="header-actions"><button className="icon-button search-toggle" onClick={() => setPaletteOpen(true)} aria-label="Buka pencarian cepat"><Search size={16} /></button><button className="icon-button theme-toggle" onClick={toggleTheme} aria-label={`Aktifkan mode ${theme === 'gelap' ? 'terang' : 'gelap'}`}>{theme === 'gelap' ? <Sun size={17} /> : <Moon size={17} />}</button><button className="icon-button menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Buka navigasi">{menuOpen ? <X size={20} /> : <Menu size={20} />}</button></div></header>

    <section className="hero section-wrap" id="beranda"><motion.div className="hero-copy" initial={reduceMotion ? false : 'hidden'} animate="show" variants={{ show: { transition: { staggerChildren: reduceMotion ? 0 : 0.12 } } }}><motion.div variants={reveal} className="status-pill"><span className="status-dot" /> TERBUKA UNTUK KOLABORASI</motion.div><motion.p variants={reveal} className="hero-kicker hover-word">Halo, saya</motion.p><motion.h1 variants={reveal} className="hover-word">Faza Ilmal<br /><span className="gradient-text">Mughni<span className="hero-period">.</span></span></motion.h1><motion.div variants={reveal} className="role-line"><span className="role-prefix">Saya seorang</span><AnimatePresence mode="wait"><motion.span key={role} className="role-value" initial={reduceMotion ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -10 }} transition={{ duration: reduceMotion ? 0 : 0.32 }}>{roles[role]}</motion.span></AnimatePresence></motion.div><motion.p variants={reveal} className="hero-description">Merancang pengalaman web yang bermakna, mengeksplorasi AI, dan menghubungkan ide digital dengan dunia nyata.</motion.p><motion.div variants={reveal} className="hero-actions"><MagneticLink href="#proyek" className="button button-primary" reduced={Boolean(reduceMotion)}>Jelajahi proyek <ArrowDownRight size={17} /></MagneticLink><MagneticLink href="#kontak" className="button button-glass" reduced={Boolean(reduceMotion)}>Mari terhubung <ArrowUpRight size={16} /></MagneticLink></motion.div><motion.div variants={reveal} className="social-links"><a className="hover-underline" href={`https://github.com/${site.githubUsername}`} target="_blank" rel="noreferrer"><Github size={16} /> GitHub <ArrowUpRight size={12} /></a>{site.instagram && <a className="hover-underline" href={site.instagram} target="_blank" rel="noreferrer"><Instagram size={16} /> Instagram <ArrowUpRight size={12} /></a>}{site.tiktok && <a className="hover-underline" href={site.tiktok} target="_blank" rel="noreferrer"><TikTokIcon size={16} /> TikTok <ArrowUpRight size={12} /></a>}{site.email && <a className="hover-underline" href={`mailto:${site.email}`}><Mail size={16} /> Email <ArrowUpRight size={12} /></a>}{site.linkedin && <a className="hover-underline" href={site.linkedin} target="_blank" rel="noreferrer"><Linkedin size={16} /> LinkedIn <ArrowUpRight size={12} /></a>}</motion.div><motion.div variants={reveal} className="hero-highlights"><div><span>FOKUS</span><b>Full Stack · AI · IoT</b></div><div><span>BASIS</span><b>Ponorogo, Indonesia</b></div><div><span>PROYEK</span><b>{projects.length}+ Repository</b></div></motion.div></motion.div>
		<motion.div className="hero-art" initial={reduceMotion ? false : { opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: reduceMotion ? 0 : 0.3, duration: reduceMotion ? 0 : 0.8 }}><div className="orbit orbit-one" /><div className="orbit orbit-two" /><Glass className="hero-orb"><div className="orb-top"><span className="orb-spark"><Sparkles size={15} /></span><span>RUANG EKSPLORASI</span></div><div className="orb-glyph profile-photo-wrap"><Image src="/profile.png" alt="Foto profil Faza Ilmal Mughni" width={768} height={1024} priority className="profile-photo" /></div><div className="orb-bottom"><div><span>BERBASIS</span><b>Rasa ingin tahu</b></div><ArrowDownRight size={18} /></div></Glass><CodeCard reduced={Boolean(reduceMotion)} /><Glass className="float-note note-ai"><span className="ai-dot" /><span>AI + IoT</span></Glass><div className="art-caption">PONOROGO, INDONESIA <span>—</span> {new Date().getFullYear()}</div></motion.div>
      <a href="#tentang" className="scroll-cue"><span>GULIR UNTUK MENJELAJAH</span><ArrowDown size={14} /></a></section>

    <section className="section-wrap about-section" id="tentang"><SectionHeading direction="left" eyebrow="SEDIKIT TENTANG SAYA" title={<>Teknologi dengan<br /><span className="gradient-text">tujuan yang berarti.</span></>} copy="Saya suka memecah persoalan menjadi pengalaman digital yang terasa sederhana, berguna, dan dekat dengan kehidupan sehari-hari." />
      <motion.div className="about-hud" initial={reduceMotion ? false : 'hidden'} whileInView={reduceMotion ? undefined : 'show'} viewport={{ once: true, amount: 0.15 }} variants={{ show: { transition: { staggerChildren: reduceMotion ? 0 : 0.1 } } }}>
        <motion.div variants={revealLeft}><Glass className="about-core glow" {...usePointerGlow()}>
          <div className="hud-header"><span className="card-eyebrow">01 / PROFIL INTI</span><span className="hud-badge"><i className="status-dot" /> AKTIF · SEMESTER 7</span></div>
          <h3 className="hover-word">Belajar, mencoba,<br />lalu membangun.</h3>
          <p>Mahasiswa Informatika Universitas Muhammadiyah Ponorogo (2022 — sekarang) yang berfokus pada pengembangan produk digital, kecerdasan buatan, dan perangkat IoT.</p>
          <div className="about-telemetry">
            <div><span>DOMISILI</span><b><MapPin size={12} /> Ponorogo, ID</b></div>
            <div><span>REPOSITORY</span><b><Github size={12} /> {profile?.public_repos ?? projects.length}+ Publik</b></div>
            <div><span>BAHASA UTAMA</span><b><Code2 size={12} /> {topLanguage}</b></div>
          </div>
          <div className="about-core-foot"><span className="about-signature">faza<span>.</span>dev</span><span className="language-visual" aria-hidden="true"><i /><i /><i /><i /><i /></span></div>
        </Glass></motion.div>
        <motion.div variants={revealRight}><Glass className="about-focus-hud glow" {...usePointerGlow()}>
          <div className="hud-header"><span className="card-eyebrow">02 / BIDANG EKSPLORASI</span><span className="hud-tag">UMPO · FT</span></div>
          <div className="focus-row"><span className="focus-icon focus-web"><Code2 size={16} /></span><div><b>Web full stack</b><small>Dari ide ke produk digital modern</small></div><ArrowUpRight size={15} /></div>
          <div className="focus-row"><span className="focus-icon focus-ai"><Sparkles size={16} /></span><div><b>Data & kecerdasan buatan</b><small>Deteksi video deepfake & visi komputer</small></div><ArrowUpRight size={15} /></div>
          <div className="focus-row"><span className="focus-icon focus-iot"><Cpu size={16} /></span><div><b>Internet of Things</b><small>ESP32, sensor, dan perangkat cerdas</small></div><ArrowUpRight size={15} /></div>
        </Glass></motion.div>
      </motion.div></section>

    <div className="section-divider" aria-hidden="true"><i /><span>✦</span><i /></div>

    <section className="section-wrap projects-section" id="proyek"><div className="project-heading"><SectionHeading direction="scale" eyebrow="DIBUAT DENGAN RASA INGIN TAHU" title={<>Proyek yang<br /><span className="gradient-text">sedang bercerita.</span></>} copy="Kumpulan eksperimen, produk, dan solusi yang saya bangun dari berbagai hal yang membuat saya penasaran." /><div className="project-count"><span>{String(projects.length).padStart(2, '0')}</span><small>PROYEK<br />TEREKAM</small></div></div>
      {isFallback && <div className="fallback-note"><span className="status-dot" /> Data contoh ditampilkan. Isi username GitHub di src/config/site.ts untuk memuat proyek asli.</div>}
      <div className="mac-project-window"><div className="mac-window-titlebar"><div className="mac-window-controls" aria-hidden="true"><i /><i /><i /></div><span className="mac-window-label"><Github size={13} /> GitHub Repositories</span><span className="mac-window-spacer" /></div>
      <div className="project-tools"><div className="filter-list" role="group" aria-label="Filter proyek">{filters.map((item) => <button key={item} className={`filter-chip ${filter === item ? 'selected' : ''}`} onClick={() => setFilter(item)}>{item}</button>)}</div><label className="search-box"><Search size={15} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Cari proyek..." aria-label="Cari proyek" /><kbd>Ctrl / ⌘ K</kbd></label></div>
      {featuredProjectsList.length > 0 && <><div className="projects-subheading"><span>{String(featuredProjectsList.length).padStart(2, '0')} PROYEK PILIHAN</span><i /></div><motion.div layout className="featured-bento-grid"><AnimatePresence mode="sync">{featuredProjectsList.map((project, index) => <ProjectCard key={project.id} project={project} index={index} onOpen={setSelected} dimmed={Boolean(activeTech && !usesTechnology(project, activeTech))} />)}</AnimatePresence></motion.div></>}
      {otherProjects.length > 0 && <section className="projects-more" aria-label="Proyek lainnya"><div className="projects-more-heading"><div><span className="card-eyebrow">LANJUTKAN MENJELAJAH</span><h3>Proyek lainnya</h3></div><span className="projects-more-count">{String(otherProjects.length).padStart(2, '0')} proyek</span></div><div className="projects-more-scroll" tabIndex={0} aria-label="Daftar proyek lainnya, dapat digulir"><motion.div layout className="projects-grid"><AnimatePresence mode="sync">{otherProjects.map((project, index) => <ProjectCard key={project.id} project={project} index={index + featuredProjectsList.length} onOpen={setSelected} dimmed={Boolean(activeTech && !usesTechnology(project, activeTech))} />)}</AnimatePresence></motion.div></div></section>}
      {visibleProjects.length === 0 && <div className="empty-state glass">Belum ada proyek yang cocok. Coba kata kunci lain, ya.</div>}</div><p className="project-footnote">Daftar proyek tersinkron otomatis dari GitHub setiap satu jam <span>↗</span></p></section>

    <div className="section-divider" aria-hidden="true"><i /><span>✦</span><i /></div>

    <section className="section-wrap skills-section" id="keahlian"><SectionHeading direction="right" eyebrow="PERANGKAT DI MEJA KERJA" title={<>Teknologi sebagai<br /><span className="gradient-text">alat untuk berkarya.</span></>} copy="Pilih node teknologi untuk menyoroti proyek terkait pada jendela repositori di atas." />
      <motion.div variants={revealScale} initial={reduceMotion ? false : 'hidden'} whileInView={reduceMotion ? undefined : 'show'} viewport={{ once: true, amount: 0.2 }}>
        <Glass className="tech-console glow" {...usePointerGlow()}>
          <div className="tech-console-head">
            <div className="tech-console-status"><span className="status-dot" /><span>TECH MATRIX // {technologyGroups.reduce((sum, g) => sum + g.items.length, 0)} NODE AKTIF</span></div>
            <div className="tech-tabs" role="tablist" aria-label="Kategori teknologi">
              {['Semua', ...technologyGroups.map((g) => g.title)].map((cat) => (
                <button key={cat} role="tab" aria-selected={techCategory === cat} className={`tech-tab ${techCategory === cat ? 'is-active' : ''}`} onClick={() => setTechCategory(cat)}>{cat}</button>
              ))}
            </div>
          </div>
          <div className="tech-constellation">
            {technologyGroups.filter((group) => techCategory === 'Semua' || group.title === techCategory).flatMap((group) =>
              group.items.map((item, itemIndex) => {
                const TechIcon = technologyIcon(item);
                const selectedTech = activeTech === item;
                return (
                  <button key={item} className={`tech-node tone-${group.tone} ${selectedTech ? 'is-selected' : ''}`} aria-pressed={selectedTech} onClick={() => setActiveTech(selectedTech ? null : item)} style={{ ['--phase' as string]: `${itemIndex * -0.25}s` }}>
                    <span className="tech-node-icon"><TechIcon size={15} /></span>
                    <span className="tech-node-body"><b>{item}</b><small>{group.title}</small></span>
                    <i className="tech-node-pulse" aria-hidden="true" />
                  </button>
                );
              })
            )}
          </div>
          <div className="tech-console-foot">
            <span>{activeTech ? `Filter aktif: ${activeTech} (${projects.filter((p) => usesTechnology(p, activeTech)).length} proyek cocok)` : 'Klik salah satu teknologi untuk menyoroti proyek terkait'}</span>
            {activeTech && <button className="clear-tech-inline" onClick={() => setActiveTech(null)}>Reset <X size={12} /></button>}
          </div>
        </Glass>
      </motion.div>
    </section>

    <div className="section-divider" aria-hidden="true"><i /><span>✦</span><i /></div>

    <section className="section-wrap journey-section" id="perjalanan"><div className="journey-layout"><div className="journey-aside"><SectionHeading direction="left" eyebrow="LANGKAH YANG MEMBENTUK" title={<>Perjalanan yang<br /><span className="gradient-text">masih berlangsung.</span></>} copy="Setiap tahap belajar, magang, dan eksperimen membentuk cara saya merancang solusi yang rapi dan berdampak." /><motion.div variants={revealScale} initial={reduceMotion ? false : 'hidden'} whileInView={reduceMotion ? undefined : 'show'} viewport={{ once: true, amount: 0.25 }}><Glass className="journey-summary glow" {...usePointerGlow()}><span className="card-eyebrow">SAAT INI</span><h3>Menjembatani kode, data, dan perangkat nyata.</h3><p>Fokus menyelesaikan studi Informatika sembari membangun portofolio proyek web, AI, dan IoT yang siap digunakan.</p><div className="journey-metrics"><div><strong>{experiences.length}</strong><span>Fase utama</span></div><div><strong>{projects.length}+</strong><span>Karya publik</span></div></div></Glass></motion.div></div><div className="timeline" ref={timelineRef}><motion.span className="timeline-progress" style={{ scaleY: journeyScale }} />{experiences.map((item, index) => { const Icon = item.icon; return <motion.div key={item.title} variants={reveal} initial={reduceMotion ? false : { opacity: 0, x: index % 2 ? 34 : -34 }} whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }} transition={{ duration: reduceMotion ? 0 : 0.55, delay: reduceMotion ? 0 : index * 0.08 }} viewport={{ once: true, amount: 0.45 }} className="timeline-item"><div className="timeline-rail"><motion.span className="timeline-dot" whileInView={reduceMotion ? undefined : { scale: 1.25, boxShadow: '0 0 18px rgba(193,166,255,.85)' }} viewport={{ once: true }} /><span className="timeline-line" /></div><Glass className="timeline-card glow" {...usePointerGlow()}><span className="card-eyebrow">{item.date}</span><span className="timeline-icon"><Icon size={18} /></span><h3 className="hover-word">{item.title}</h3><p>{item.text}</p>{item.tags && <div className="timeline-tags">{item.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>}<span className="timeline-number">0{index + 1}</span></Glass></motion.div>; })}</div></div></section>

    <div className="section-divider" aria-hidden="true"><i /><span>✦</span><i /></div>

    <section className="section-wrap contact-section" id="kontak"><motion.div variants={revealScale} initial={reduceMotion ? false : 'hidden'} whileInView={reduceMotion ? undefined : 'show'} viewport={{ once: true, amount: 0.2 }}><Glass className="contact-panel glow" {...usePointerGlow()}><div className="contact-orbit" /><div className="contact-copy"><span className="eyebrow">ADA IDE MENARIK?</span><h2 className="hover-word">Mari buat sesuatu<br /><span className="gradient-text">yang berarti.</span></h2><p>Terbuka untuk kolaborasi, obrolan teknologi, atau sekadar bertukar ide. Kotak masuk saya selalu terbuka.</p>{site.email && <button className="button button-primary" onClick={copyEmail}>{copied ? <><Check size={16} /> Email tersalin</> : <><Mail size={16} /> Salin alamat email</>}</button>}{copied && <span className="copy-toast" role="status">Email tersalin</span>}</div><div className="contact-links"><span className="card-eyebrow">TEMUKAN SAYA DI</span><div className="contact-links-grid"><a className="contact-card link-github" href={`https://github.com/${site.githubUsername}`} target="_blank" rel="noreferrer"><span><Github size={18} /></span><div><b>GitHub</b><small>@{site.githubUsername}</small></div><ArrowUpRight size={16} /></a>{site.instagram && <a className="contact-card link-ig" href={site.instagram} target="_blank" rel="noreferrer"><span><Instagram size={18} /></span><div><b>Instagram</b><small>{site.instagramHandle || 'Lihat profil'}</small></div><ArrowUpRight size={16} /></a>}{site.tiktok && <a className="contact-card link-tiktok" href={site.tiktok} target="_blank" rel="noreferrer"><span><TikTokIcon size={18} /></span><div><b>TikTok</b><small>{site.tiktokHandle || 'Konten & eksplorasi'}</small></div><ArrowUpRight size={16} /></a>}{site.email && <a className="contact-card link-email" href={`mailto:${site.email}`}><span><Mail size={18} /></span><div><b>Email</b><small>{site.email}</small></div><ArrowUpRight size={16} /></a>}{site.linkedin && <a className="contact-card link-linkedin" href={site.linkedin} target="_blank" rel="noreferrer"><span><Linkedin size={18} /></span><div><b>LinkedIn</b><small>Terhubung secara profesional</small></div><ArrowUpRight size={16} /></a>}</div></div></Glass></motion.div></section>
    <footer className="site-footer"><a href="#beranda" className="brand"><span className="brand-mark">F<span>.</span></span><span>Faza<span className="brand-last"> Mughni</span></span></a><span>Dibuat dengan rasa ingin tahu <span className="footer-heart">✳</span> dari Ponorogo</span><a className="back-top" href="#beranda">Kembali ke atas <ArrowUpRight size={14} /></a><small>© {new Date().getFullYear()} FAZA ILMAL MUGHNI</small></footer>
    <AnimatePresence>{selected && <ProjectModal project={selected} close={() => setSelected(null)} />}</AnimatePresence>
    <CommandPalette open={paletteOpen} close={() => setPaletteOpen(false)} projects={projects} navigate={(section) => { const id = section === 'Beranda' ? 'beranda' : section.toLowerCase(); document.getElementById(id)?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' }); setPaletteOpen(false); }} chooseProject={setSelected} copyEmail={copyEmail} toggleTheme={toggleTheme} />
  </main>;
}
