import {
	Alert,
	AlertDescription,
	AlertIcon,
	AlertTitle,
	Box,
	Button,
	ButtonGroup,
	Center,
	Flex,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Heading,
	IconButton,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Table,
	TableContainer,
	Tbody,
	Td,
	Th,
	Thead,
	Tr,
	useDisclosure,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { PrimaryButton } from "./components/atoms/PrimaryButton";
import { LoadingSpinner } from "./components/molecules/LoadingSpinner";
import { StudyRecord } from "./domain/studyRecord";
import { useStudyRecords } from "./hooks/useStudyRecord";

function App() {
	const {
		handleSubmit,
		register,
		reset,
		setValue,
		formState: { errors, isSubmitting },
	} = useForm();

	const { isOpen, onOpen, onClose } = useDisclosure();
	const { records, isLoading, error, addRecord, editRecord, deleteRecord } =
		useStudyRecords();
	const [editRecordData, setEditRecordData] = useState<StudyRecord | null>(
		null
	);
	const initialRef = useRef(null);
	const finalRef = useRef(null);

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
		<Flex align="center" justify="center">
			<Box height="100vh">
				<Center mt={4} mb={4}>
					<Heading as="h1">Shin Study Record</Heading>
				</Center>

				{error && (
					<Alert status="error">
						<AlertIcon />
						<AlertTitle>error</AlertTitle>
						<AlertDescription>{error}</AlertDescription>
					</Alert>
				)}

				<Box>
					<Flex justifyContent="flex-end">
						<PrimaryButton onClick={handleAddClick}>新規登録</PrimaryButton>
					</Flex>
					<TableContainer>
						<Table variant="striped" colorScheme="blackAlpha" width="600px">
							<Thead>
								<Tr>
									{/* <Th>id</Th> */}
									<Th>title</Th>
									<Th>time</Th>
									<Th>created_at</Th>
									<Th></Th>
								</Tr>
							</Thead>
							<Tbody>
								{records.map((record) => (
									<Tr key={record.id}>
										{/* <Td>{record.id}</Td> */}
										<Td>{record.title}</Td>
										<Td>{record.time}時間</Td>
										<Td>{record.created_at}</Td>
										<Td>
											<ButtonGroup spacing="4">
												<IconButton
													aria-label="編集"
													icon={<FiEdit />}
													size="lg"
													variant="outline"
													onClick={() => handleEditClick(record)}
												/>

												<IconButton
													aria-label="削除"
													icon={<FiTrash2 />}
													size="lg"
													variant="outline"
													onClick={() => handleDeleteClick(record.id)}
												/>
											</ButtonGroup>
										</Td>
									</Tr>
								))}
							</Tbody>
						</Table>
					</TableContainer>
					<Modal
						initialFocusRef={initialRef}
						finalFocusRef={finalRef}
						isOpen={isOpen}
						onClose={onCloseModal}
					>
						<ModalOverlay />
						<ModalContent>
							<form onSubmit={handleSubmit(onClickSubmit)}>
								<ModalHeader>
									{editRecordData ? "記録編集" : "新規登録"}
								</ModalHeader>
								<ModalCloseButton />
								<ModalBody pb={6}>
									<FormControl isInvalid={!!errors.title}>
										<FormLabel>学習記録</FormLabel>
										<Input
											// ref={initialRef}
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
									<Button ml={4} onClick={onCloseModal}>
										キャンセル
									</Button>
								</ModalFooter>
							</form>
						</ModalContent>
					</Modal>
				</Box>
			</Box>
		</Flex>
	);
}

export default App;
