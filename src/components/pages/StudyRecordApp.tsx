import { Flex, useDisclosure } from "@chakra-ui/react";
import { RefObject, useRef, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { StudyRecord } from "../../domain/studyRecord";
import { useStudyRecords } from "../../hooks/useStudyRecord";
import { PrimaryButton } from "../atoms/PrimaryButton";
import { LoadingSpinner } from "../molecules/LoadingSpinner";
import { StudyRecordModal } from "../organisms/StudyRecordModal";
import { StudyRecordTable } from "../organisms/StudyRecordTable";
import { MainTemplate } from "../templates/MainTemplate";

function StudyRecordApp() {
	const {
		handleSubmit,
		register,
		reset,
		setValue,
		formState: { errors, isSubmitting },
	} = useForm();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const initialRef = useRef<RefObject<HTMLInputElement>>(null);
	const { records, isLoading, error, addRecord, editRecord, deleteRecord } =
		useStudyRecords();
	const [editRecordData, setEditRecordData] = useState<StudyRecord | null>(
		null
	);

	const handleAddClick = () => {
		onOpen();
	};

	const handleEditClick = (record: StudyRecord) => {
		setEditRecordData(record);
		setValue("title", record.title);
		setValue("time", record.time);
		onOpen();
	};

	const handleDeleteClick = (id: string) => {
		deleteRecord(id);
	};

	const onCloseModal = () => {
		reset();
		setEditRecordData(null);
		onClose();
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
		onCloseModal();
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
				onClose={onCloseModal}
				handleSubmit={handleSubmit}
				onSubmit={onClickSubmit}
				register={register}
				errors={errors}
				isSubmitting={isSubmitting}
				initialRef={initialRef}
				editRecordData={editRecordData}
			/>
		</MainTemplate>
	);
}

export default StudyRecordApp;
