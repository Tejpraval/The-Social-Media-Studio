import { toPng } from 'html-to-image';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export async function exportSlide(node, fileName) {
  const dataUrl = await toPng(node, {
    cacheBust: true,
    pixelRatio: 2,
    backgroundColor: '#ffffff'
  });
  saveAs(dataUrl, fileName);
}

export async function exportZip(nodes, projectTitle = 'creatoros-carousel') {
  const zip = new JSZip();
  for (let index = 0; index < nodes.length; index += 1) {
    const dataUrl = await toPng(nodes[index], {
      cacheBust: true,
      pixelRatio: 2,
      backgroundColor: '#ffffff'
    });
    zip.file(`slide-${String(index + 1).padStart(2, '0')}.png`, dataUrl.split(',')[1], { base64: true });
  }
  const blob = await zip.generateAsync({ type: 'blob' });
  saveAs(blob, `${projectTitle.replace(/[^\w-]+/g, '-').toLowerCase()}.zip`);
}
