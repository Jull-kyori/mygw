export type FeaturedProject = { repo: string; title?: string; description?: string; image?: string; demo?: string; tech?: string[] };

// Isi dengan nama repository GitHub yang ingin ditonjolkan.
export const featuredProjects: FeaturedProject[] = [
  { repo: 'Deepfake-Detection-Transfer-Learning-Benchmark', title: 'Deteksi Video Deepfake', description: 'Riset deteksi video manipulasi dengan transfer learning dan pembandingan beberapa arsitektur.', tech: ['Python', 'TensorFlow', 'Keras', 'Deep Learning'] },
  { repo: 'bakesbangpol-po', title: 'Website Bakesbangpol Ponorogo', description: 'Pembaruan website instansi dan pengelolaan informasi publik.', tech: ['HTML', 'Tailwind CSS', 'Node.js', 'Express'] },
  { repo: 'Taskflow-ai', title: 'TaskFlow AI', description: 'Aplikasi pengelola tugas yang menggabungkan produktivitas dan kecerdasan buatan.', tech: ['Next.js', 'TypeScript', 'Framer Motion'] },
];
