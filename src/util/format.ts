// 천단위 콤마
import moment from "moment";

export const addComma = (x: number) => {
	if (!x) {
		return 0;
	}

	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// moment 를 사용해서 날짜 포맷 변경
export const momentFormat = (date: Date | string | null, format: string) => {
	if (!date) {
		return '';
	}
	return moment(date).format(format);
}