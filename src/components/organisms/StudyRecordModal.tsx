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
import { RefObject } from "react";
import {
	FieldErrors,
	FieldValues,
	UseFormHandleSubmit,
	UseFormRegister,
} from "react-hook-form";
import { PrimaryButton } from "../atoms/PrimaryButton";

type StudyRecordModalProps = {
	isOpen: boolean;
	onClose: () => void;
	handleSubmit: UseFormHandleSubmit<FieldValues>;
	onSubmit: (values: FieldValues) => void;
	register: UseFormRegister<any>;
	errors: FieldErrors;
	isSubmitting: boolean;
	editRecordData: any;
	initialRef: RefObject<HTMLInputElement>;
};

export const StudyRecordModal = ({
	isOpen,
	onClose,
	handleSubmit,
	onSubmit,
	register,
	errors,
	isSubmitting,
	editRecordData,
	initialRef,
}: StudyRecordModalProps) => (
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
