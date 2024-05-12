import { StudyRecord } from "../domain/studyRecord";
import { supabase } from "./supabase";

export default async function fetchStudyRecords() {
	const response = await supabase.from("study-record").select("*");

	if (response.error) {
		throw new Error(response.error.message);
	}

	const studyRecordData = response.data.map((record) => {
		return new StudyRecord(
			record.id,
			record.title,
			record.time,
			record.created_at
		);
	});
	return studyRecordData;
}
