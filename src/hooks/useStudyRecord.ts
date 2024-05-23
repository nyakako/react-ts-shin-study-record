import { useEffect, useState } from "react";
import { StudyRecord } from "../domain/studyRecord";
import {
	deleteStudyRecord,
	fetchStudyRecords,
	insertStudyRecord,
	updateStudyRecord,
} from "../utils/supabaseFunctions";
import { useMessage } from "./useMessage";

export const useStudyRecords = () => {
	const [records, setRecords] = useState<StudyRecord[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | undefined>(undefined);
	const { showMessage } = useMessage();

	useEffect(() => {
		const getAllStudyRecords = async () => {
			setIsLoading(true);
			fetchStudyRecords()
				.then((studyRecordData) => {
					setRecords(studyRecordData);
				})
				.catch((error) => {
					setError(error.message);
				})
				.finally(() => {
					setIsLoading(false);
				});
		};
		getAllStudyRecords();
	}, []);

	const addRecord = async (record: StudyRecord) => {
		setIsLoading(true);
		insertStudyRecord(record)
			.then(() => fetchStudyRecords())
			.then((studyRecordData) => {
				setRecords(studyRecordData);
				showMessage({
					title: "学習記録を登録しました",
					status: "success",
				});
			})
			.catch((error) => {
				setError(error.message);
			})
			.finally(() => {
				setIsLoading(false);
			});
	};

	const editRecord = async (record: StudyRecord) => {
		setIsLoading(true);
		updateStudyRecord(record)
			.then(() => fetchStudyRecords())
			.then((studyRecordData) => {
				setRecords(studyRecordData);
				showMessage({
					title: "学習記録を更新しました",
					status: "success",
				});
			})
			.catch((error) => {
				setError(error.message);
			})
			.finally(() => {
				setIsLoading(false);
			});
	};

	const deleteRecord = async (id: string) => {
		setIsLoading(true);
		deleteStudyRecord(id)
			.then(() => fetchStudyRecords())
			.then((studyRecordData) => {
				setRecords(studyRecordData);
				showMessage({
					title: "学習記録を削除しました",
					status: "success",
				});
			})
			.catch((error) => {
				setError(error.message);
			})
			.finally(() => {
				setIsLoading(false);
			});
	};

	return { records, isLoading, error, addRecord, editRecord, deleteRecord };
};
