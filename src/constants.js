// 결과물의 최대 용량 (1MB = 1,000,000 byte 기준이라 어떤 단위로 봐도 1MB 미만)
export const SIZE_LIMIT = 1_000_000;

// 출력 형식은 JPG만 지원합니다.
export const OUTPUT_TYPE = 'image/jpeg';
export const OUTPUT_EXTENSION = 'jpg';

export const STRENGTH_OPTIONS = [
  { value: 0.5, label: '최대 압축 (용량 최소)' },
  { value: 0.65, label: '강한 압축' },
  { value: 0.8, label: '균형 (화질 우선)' },
];

export const SIZE_MODES = [
  { value: 'orig', label: '원본 크기 유지' },
  { value: 'px', label: '픽셀로 지정' },
  { value: 'pct', label: '원본의 %로 지정' },
];

export const FIT_OPTIONS = [
  { value: 'cover', label: '정확한 크기로 맞추고 넘치는 부분 자르기' },
  { value: 'stretch', label: '정확한 크기로 맞추고 비율은 늘려서 맞추기' },
  { value: 'contain', label: '비율 유지, 입력한 크기 안에 맞추기' },
];

export const DEFAULT_SETTINGS = {
  quality: 0.5,
  sizeMode: 'orig', // orig | px | pct
  width: '',
  height: '',
  percent: 50,
  fit: 'cover', // cover | stretch | contain (너비·높이를 모두 입력했을 때)
};
