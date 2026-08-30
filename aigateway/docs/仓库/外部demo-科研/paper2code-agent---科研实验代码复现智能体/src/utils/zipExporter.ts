import JSZip from 'jszip';
import { GeneratedCodeFile } from '../types';

export async function exportProjectAsZip(paperTitle: string, files: GeneratedCodeFile[]) {
  const zip = new JSZip();
  const cleanName = paperTitle.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase().slice(0, 30);
  const rootFolder = zip.folder(`paper2code_${cleanName}`) || zip;

  for (const file of files) {
    // Remove leading slash if present
    const cleanPath = file.path.startsWith('/') ? file.path.slice(1) : file.path;
    rootFolder.file(cleanPath, file.content);
  }

  const content = await zip.generateAsync({ type: 'blob' });
  const downloadUrl = URL.createObjectURL(content);
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = `paper2code_${cleanName}_reproduction.zip`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(downloadUrl);
}
