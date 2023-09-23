export interface NoticeType {
  key: number;
  title: string;
  regDate: Date | null;
}

export const NOTICE_LIST: NoticeType[] = [
  {
    key: 0,
    title: '어플 오류시 참고 부탁드립니다.',
    regDate: new Date(),
  },
  {
    key: 1,
    title: '가이드라인 작성 시 참고부탁드립니다.',
    regDate: new Date(),
  },
];
