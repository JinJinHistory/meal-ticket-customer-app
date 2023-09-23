export interface OngoingType {
  key: number;
  title: string;
  regDate: Date | null;
  state: EnumReviewState;
}

export interface CompletedType {
  key: number;
  title: string;
  regDate: Date | null;
  comDate: Date | null;
  state: EnumReviewState;
}

export interface ReviewListSearchType {
  searchType: { key: number; name: string };
  searchItems: { key: number; name: string }[];
}

export const ONGOING_REVIEW_LIST_SEARCH_TYPE_LIST: ReviewListSearchType[] = [
  {
    searchType: { key: 0, name: '조회기간' },
    searchItems: [
      { key: 0, name: '1개월' },
      { key: 1, name: '3개월' },
      { key: 2, name: '직접설정' },
    ],
  },
  {
    searchType: { key: 1, name: '상태' },
    searchItems: [
      { key: 0, name: '전체' },
      { key: 1, name: '검수대기중' },
      { key: 2, name: '미배정' },
      { key: 3, name: '검수중' },
    ],
  },
  {
    searchType: { key: 2, name: '정렬' },
    searchItems: [
      { key: 0, name: '최신순' },
      { key: 1, name: '과거순' },
    ],
  },
];

export enum EnumReviewState {
  // 최종완료
  FINAL_COMPLETE = '최종완료',
  // 완료
  COMPLETE = '완료',
  // 포스팅검수대기중
  POSTING_WAIT = '포스팅검수대기중',
  // 미배정
  NOT_ASSIGN = '미배정',
  // 리뷰검수중
  REVIEW_WAIT = '리뷰검수중',
}

export const ONGOING_REVIEW_LIST: OngoingType[] = [
  {
    key: 0,
    title: '방문자리뷰#8',
    regDate: new Date(),
    state: EnumReviewState.POSTING_WAIT,
  },
  {
    key: 1,
    title: '방문자리뷰#7',
    regDate: new Date(),
    state: EnumReviewState.NOT_ASSIGN,
  },
  {
    key: 2,
    title: '#방문자리뷰9',
    regDate: new Date(),
    state: EnumReviewState.POSTING_WAIT,
  },
  {
    key: 3,
    title: '#방문자리뷰6',
    regDate: new Date(),
    state: EnumReviewState.POSTING_WAIT,
  },
  {
    key: 4,
    title: '#방문자리뷰10',
    regDate: new Date(),
    state: EnumReviewState.POSTING_WAIT,
  },
  {
    key: 5,
    title: '#방문자리뷰10',
    regDate: new Date(),
    state: EnumReviewState.REVIEW_WAIT,
  },
  {
    key: 6,
    title: '#방문자리뷰10',
    regDate: new Date(),
    state: EnumReviewState.REVIEW_WAIT,
  },
  {
    key: 7,
    title: '#방문자리뷰10',
    regDate: new Date(),
    state: EnumReviewState.REVIEW_WAIT,
  },
  {
    key: 8,
    title: '#방문자리뷰10',
    regDate: new Date(),
    state: EnumReviewState.REVIEW_WAIT,
  },
  {
    key: 9,
    title: '#방문자리뷰10',
    regDate: new Date(),
    state: EnumReviewState.REVIEW_WAIT,
  },
  {
    key: 10,
    title: '#방문자리뷰10',
    regDate: new Date(),
    state: EnumReviewState.REVIEW_WAIT,
  },
];

export const COMPLETED_REVIEW_LIST: CompletedType[] = [
  {
    key: 0,
    title: '방문자리뷰#8',
    regDate: new Date(),
    comDate: new Date(),
    state: EnumReviewState.FINAL_COMPLETE,
  },
  {
    key: 1,
    title: '방문자리뷰#7',
    regDate: new Date(),
    comDate: new Date(),
    state: EnumReviewState.COMPLETE,
  },
  {
    key: 2,
    title: '#방문자리뷰9',
    regDate: new Date(),
    comDate: new Date(),
    state: EnumReviewState.FINAL_COMPLETE,
  },
  {
    key: 3,
    title: '#방문자리뷰6',
    regDate: new Date(),
    comDate: new Date(),
    state: EnumReviewState.FINAL_COMPLETE,
  },
  {
    key: 4,
    title: '#방문자리뷰10',
    regDate: new Date(),
    comDate: new Date(),
    state: EnumReviewState.FINAL_COMPLETE,
  },
];
