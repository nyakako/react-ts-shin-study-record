import { Flex, useDisclosure } from "@chakra-ui/react";
import { useState } from "react";
import { FieldValues } from "react-hook-form";
import { StudyRecord } from "../../domain/studyRecord";
import { useStudyRecords } from "../../hooks/useStudyRecord";
import { PrimaryButton } from "../atoms/PrimaryButton";
import { LoadingSpinner } from "../molecules/LoadingSpinner";
import { StudyRecordModal } from "../organisms/StudyRecordModal";
import { StudyRecordTable } from "../organisms/StudyRecordTable";
import { MainTemplate } from "../templates/MainTemplate";

function StudyRecordApp() {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { records, isLoading, error, addRecord, editRecord, deleteRecord } =
		useStudyRecords();
	const [editRecordData, setEditRecordData] = useState<StudyRecord | null>(
		null
	);

	const handleAddClick = () => {
		setEditRecordData(null);
		onOpen();
	};

	const handleEditClick = (record: StudyRecord) => {
		setEditRecordData(record);
		onOpen();
	};

	const handleDeleteClick = (id: string) => {
		deleteRecord(id);
	};

	const onClickSubmit = async (values: FieldValues) => {
		const newRecord: StudyRecord = {
			id: editRecordData ? editRecordData.id : values.id,
			title: values.title,
			time: values.time,
			created_at: values.created_at,
		};
		if (editRecordData) {
			await editRecord(newRecord);
		} else {
			await addRecord(newRecord);
		}
		onClose();
	};

	if (isLoading) {
		return <LoadingSpinner />;
	}

	return (
		<MainTemplate error={error}>
			<Flex justifyContent="flex-end">
				<PrimaryButton onClick={handleAddClick}>新規登録</PrimaryButton>
			</Flex>
			<StudyRecordTable
				records={records}
				onEdit={handleEditClick}
				onDelete={handleDeleteClick}
			/>
			<StudyRecordModal
				isOpen={isOpen}
				onClose={onClose}
				onSubmit={onClickSubmit}
				editRecordData={editRecordData}
			/>
		</MainTemplate>
	);
}

export default StudyRecordApp;
