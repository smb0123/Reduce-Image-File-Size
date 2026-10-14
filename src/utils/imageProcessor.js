import { SIZE_LIMIT } from '../constants';

const toBlob = (canvas, type, quality) =>
  new Promise((resolve) => canvas.toBlob(resolve, type, quality));

const positive = (v) => {
  const n = parseFloat(v);
  return n > 0 ? n : 0;
};

// 용량을 줄이려고 크기를 몇 배로 줄일지 (용량 비율의 제곱근 기준)
const shrinkFactor = (size) =>
  Math.max(0.5, Math.min(0.9, Math.sqrt(SIZE_LIMIT / size) * 0.95));

export function supportsAvif() {
  const c = document.createElement('canvas');
  c.width = c.height = 1;
  return c.toDataURL('image/avif').startsWith('data:image/avif');
}

export async function readImageSize(file) {
  const bitmap = await createImageBitmap(file);
  const size = { width: bitmap.width, height: bitmap.height };
  bitmap.close();
  return size;
}

// 설정에 따라 결과 이미지의 목표 너비/높이를 계산합니다.
export function getTargetSize({ width, height }, s) {
  if (s.sizeMode === 'pct') {
    const k = (positive(s.percent) || 100) / 100;
    return [Math.max(1, Math.round(width * k)), Math.max(1, Math.round(height * k))];
  }
  if (s.sizeMode === 'px') {
    const w = positive(s.width);
    const h = positive(s.height);
    if (w && h) {
      if (s.fit === 'contain') {
        const k = Math.min(w / width, h / height);
        return [Math.max(1, Math.round(width * k)), Math.max(1, Math.round(height * k))];
      }
      return [Math.round(w), Math.round(h)];
    }
    if (w) return [Math.round(w), Math.max(1, Math.round((height * w) / width))];
    if (h) return [Math.max(1, Math.round((width * h) / height)), Math.round(h)];
  }
  return [width, height];
}

function drawToCanvas(bitmap, w, h, type, crop) {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingQuality = 'high';
  if (type === 'image/jpeg') {
    // JPG는 투명을 지원하지 않아 흰 배경을 깔아 줍니다.
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, w, h);
  }
  if (crop) {
    const k = Math.max(w / bitmap.width, h / bitmap.height);
    const sw = w / k;
    const sh = h / k;
    ctx.drawImage(bitmap, (bitmap.width - sw) / 2, (bitmap.height - sh) / 2, sw, sh, 0, 0, w, h);
  } else {
    ctx.drawImage(bitmap, 0, 0, w, h);
  }
  return canvas;
}

/**
 * 이미지를 변환합니다.
 * 1) 선택한 화질로 인코딩 → 1MB 이하면 끝
 * 2) 넘으면 화질을 낮춰가며 1MB 바로 아래를 이진 탐색
 * 3) 최저 화질로도 넘으면 크기를 줄여 다시 시도 (크기를 직접 지정했다면 크기 유지)
 * 반환: { blob, width, height, note, tone }
 */
export async function convertImage(file, src, s) {
  const bitmap = await createImageBitmap(file);
  const type = s.type;
  const isPng = type === 'image/png';
  const [tw, th] = getTargetSize(src, s);
  const keepSize = s.sizeMode === 'px' && (positive(s.width) || positive(s.height));
  const crop = s.sizeMode === 'px' && positive(s.width) && positive(s.height) && s.fit === 'cover';
  const floor = keepSize ? 0.05 : 0.35;

  let scale = 1;
  let blob;
  let w = tw;
  let h = th;

  for (let tries = 0; tries < 14; tries++) {
    w = Math.max(1, Math.round(tw * scale));
    h = Math.max(1, Math.round(th * scale));
    const canvas = drawToCanvas(bitmap, w, h, type, crop);

    if (isPng) {
      blob = await toBlob(canvas, type);
      if (blob.size <= SIZE_LIMIT || keepSize) break;
      scale *= shrinkFactor(blob.size);
      continue;
    }

    const top = await toBlob(canvas, type, s.quality);
    if (top.size <= SIZE_LIMIT) {
      blob = top;
      break;
    }
    const low = await toBlob(canvas, type, floor);
    if (low.size > SIZE_LIMIT) {
      if (keepSize) {
        blob = low;
        break;
      }
      scale *= shrinkFactor(low.size);
      continue;
    }
    let lo = floor;
    let hi = s.quality;
    blob = low;
    for (let i = 0; i < 6; i++) {
      const mid = (lo + hi) / 2;
      const t = await toBlob(canvas, type, mid);
      if (t.size <= SIZE_LIMIT) {
        blob = t;
        lo = mid;
      } else hi = mid;
    }
    break;
  }
  bitmap.close();

  let note = '';
  let tone = 'ok';
  if (blob.size > SIZE_LIMIT) {
    note = keepSize
      ? '지정한 크기를 유지해서 1MB를 넘었어요. 크기를 줄이거나 WebP를 써 보세요.'
      : '1MB 안으로 맞추지 못했어요.';
    tone = 'warn';
  } else if (scale < 1) {
    note = '1MB를 맞추려고 크기를 자동으로 줄였어요.';
  }

  // 이미 충분히 작은 원본은 다시 인코딩하면 오히려 커질 수 있어 그대로 둡니다.
  const unchanged = file.type === type && tw === src.width && th === src.height;
  if (unchanged && blob.size >= file.size && file.size <= SIZE_LIMIT) {
    return { blob: file, width: src.width, height: src.height, note: '이미 충분히 작아서 원본을 그대로 뒀어요.', tone: '' };
  }
  return { blob, width: w, height: h, note, tone };
}
