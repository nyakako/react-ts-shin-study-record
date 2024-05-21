import { StudyRecord } from "../domain/studyRecord";
import { supabase } from "./supabase";

export async function fetchStudyRecords() {
	return supabase
		.from("study-record")
		.select("*")
		.order("title", { ascending: true })
		.then((response) => {
			if (response.error) {
				throw new Error(
					`データの取得に失敗しました: ${response.error.message}`
				);
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
		});
}

export async function insertStudyRecord(newRecord: StudyRecord) {
	return supabase
		.from("study-record")
		.insert(newRecord)
		.select()
		.then(({ data, error }) => {
			if (error) {
				throw new Error(`レコードの追加に失敗しました: ${error.message}`);
			}
			return data;
		});
}

export async function updateStudyRecord(newRecord: StudyRecord) {
	return supabase
		.from("study-record")
		.update({
			title: newRecord.title,
			time: newRecord.time,
		})
		.eq("id", newRecord.id)
		.select()
		.then(({ data, error }) => {
			if (error) {
				throw new Error(`レコードの更新に失敗しました: ${error.message}`);
			}
			return data;
		});
}

export async function deleteStudyRecord(id: string) {
	return supabase
		.from("study-record")
		.delete()
		.eq("id", id)
		.then(({ error }) => {
			if (error) {
				throw new Error(`レコードの削除に失敗しました: ${error.message}`);
			}
		});
}
