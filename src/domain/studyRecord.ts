import { formatDate } from "../utils/formatDate";

export class StudyRecord {
	constructor(
		public id: string,
		public title: string,
		public time: number,
		public created_at: string
	) {
		this.created_at = formatDate(created_at);
	}
}
