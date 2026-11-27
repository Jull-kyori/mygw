export type FeaturedProject = { repo: string; title?: string; description?: string; image?: string; demo?: string };

// Isi dengan nama repository GitHub yang ingin ditonjolkan.
export const featuredProjects: FeaturedProject[] = [
  { repo: 'Deepfake-Detection-Transfer-Learning-Benchmark', title: 'Deteksi Video Deepfake', description: 'Riset deteksi video manipulasi dengan transfer learning dan pembandingan beberapa arsitektur.' },
  { repo: 'bakesbangpol-po', title: 'Website Bakesbangpol Ponorogo', description: 'Pembaruan website instansi dan pengelolaan informasi publik.' },
  { repo: 'Taskflow-ai', title: 'TaskFlow AI', description: 'Aplikasi pengelola tugas yang menggabungkan produktivitas dan kecerdasan buatan.' },
];
