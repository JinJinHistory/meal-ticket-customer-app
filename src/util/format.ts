// 천단위 콤마
export const addComma = (x: number) => {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}