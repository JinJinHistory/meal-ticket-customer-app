export class CommonListModel<T> {
	public totalCount: number = 0;
	public skip: number = 0;
	public take: number = 0;
	public totalPage: number = 0;
	public currentPage: number = 0;
	public items: Array<T> | null = null;
}