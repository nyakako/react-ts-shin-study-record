import { StudyRecord } from "../domain/studyRecord";
import { supabase } from "./supabase";

export async function fetchStudyRecords() {
	const response = await supabase.from("study-record").select("*");

	if (response.error) {
		throw new Error(response.error.message);
	}

	const studyRecordData = response.data.map((record: StudyRecord) => {
		return new StudyRecord(
			record.id,
			record.title,
			record.time,
			record.created_at
		);
	});
	return studyRecordData;
}

export async function insertStudyRecord(newRecord: StudyRecord) {
	const { data, error } = await supabase
		.from("study-record")
		.insert(newRecord)
		.select();
	return { data, error };
}

export async function deleteStudyRecord(id: string) {
	await supabase.from("study-record").delete().eq("id", id);
}
