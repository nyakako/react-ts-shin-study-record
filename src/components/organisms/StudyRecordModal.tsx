import {
	Button,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
} from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { StudyRecord } from "../../domain/studyRecord";
import { PrimaryButton } from "../atoms/PrimaryButton";

type StudyRecordModalProps = {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (values: FieldValues) => void;
	editRecordData: StudyRecord | null;
};

export const StudyRecordModal = ({
	isOpen,
	onClose,
	onSubmit,
	editRecordData,
}: StudyRecordModalProps) => {
	const initialRef = useRef<HTMLInputElement | null>(null);
	const {
		handleSubmit,
		register,
		reset,
		formState: { errors, isSubmitting },
	} = useForm();

	useEffect(() => {
		// initialFocusと編集時のdefaultValueを同時に実現するのに必要な処理
		if (isOpen) {
			reset();
		}
	}, [isOpen, reset]);

	return (
		<Modal isOpen={isOpen} onClose={onClose} initialFocusRef={initialRef}>
			<ModalOverlay />
			<ModalContent>
				<form onSubmit={handleSubmit(onSubmit)}>
					<ModalHeader>{editRecordData ? "記録編集" : "新規登録"}</ModalHeader>
					<ModalCloseButton />
					<ModalBody pb={6}>
						<FormControl isInvalid={!!errors.title}>
							<FormLabel>学習記録</FormLabel>
							<Input
								placeholder="学習した内容"
								{...register("title", {
									required: "内容の入力は必須です",
								})}
								ref={initialRef}
								defaultValue={editRecordData ? editRecordData.title : ""}
							/>
							<FormErrorMessage>
								{errors.title && errors.title.message
									? errors.title.message.toString()
									: null}
							</FormErrorMessage>
						</FormControl>

						<FormControl mt={4} isInvalid={!!errors.time}>
							<FormLabel>学習時間</FormLabel>
							<Input
								placeholder="2"
								{...register("time", {
									required: "時間の入力は必須です",
									min: {
										value: 0,
										message: "時間は0以上である必要があります",
									},
								})}
								defaultValue={editRecordData ? editRecordData.time : ""}
							/>
							<FormErrorMessage>
								{errors.time && errors.time.message
									? errors.time.message.toString()
									: null}
							</FormErrorMessage>
						</FormControl>
					</ModalBody>
					<ModalFooter>
						<PrimaryButton isLoading={isSubmitting} type="submit">
							{editRecordData ? "更新" : "登録"}
						</PrimaryButton>
						<Button ml={4} onClick={onClose}>
							キャンセル
						</Button>
					</ModalFooter>
				</form>
			</ModalContent>
		</Modal>
	);
};
