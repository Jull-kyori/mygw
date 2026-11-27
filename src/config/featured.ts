export type FeaturedProject = { repo: string; title?: string; description?: string; image?: string; demo?: string };

// Isi dengan nama repository GitHub yang ingin ditonjolkan.
export const featuredProjects: FeaturedProject[] = [
  { repo: 'deepfake-detection', title: 'Deteksi Video Deepfake', description: 'Riset deteksi video manipulasi dengan transfer learning dan arsitektur CNN.' },
  { repo: 'posyanducare', title: 'PosyanduCare', description: 'Sistem digital untuk membantu pencatatan dan pemantauan layanan posyandu.' },
  { repo: 'taskflow-ai', title: 'TaskFlow AI', description: 'Pengelola tugas yang memadukan produktivitas dan kecerdasan buatan.' },
];
