import {
	Box,
	Button,
	Center,
	Flex,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Heading,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Spinner,
	Table,
	TableContainer,
	Tbody,
	Td,
	Th,
	Thead,
	Tr,
	useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { StudyRecord } from "./domain/studyRecord";
import {
	deleteStudyRecord,
	fetchStudyRecords,
	insertStudyRecord,
} from "./utils/supabaseFunctions";

function App() {
	const {
		handleSubmit,
		register,
		reset,
		formState: { errors, isSubmitting },
	} = useForm();
	const { isOpen, onOpen, onClose } = useDisclosure();

	const initialRef = useRef(null);
	const finalRef = useRef(null);
	const [records, setRecords] = useState<StudyRecord[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const onClickAddButton = () => {
		onOpen();
	};
	const onClickDeleteRecord = async (id: string) => {
		setIsLoading(true);
		await deleteStudyRecord(id);
		const studyRecordData = await fetchStudyRecords();
		setRecords(studyRecordData);
		setIsLoading(false);
	};
	const onSubmit = async (values: FieldValues) => {
		const newStudyRecord: StudyRecord = {
			id: values.id,
			title: values.title,
			time: values.time,
			created_at: values.created_at,
		};
		setIsLoading(true);
		await insertStudyRecord(newStudyRecord);
		const studyRecordData = await fetchStudyRecords();
		setRecords(studyRecordData);
		reset();
		onClose();
		setIsLoading(false);
	};
	useEffect(() => {
		const getAllStudyRecords = async () => {
			const studyRecordData = await fetchStudyRecords();
			console.log(studyRecordData);
			setRecords(studyRecordData);
			setIsLoading(false);
		};
		getAllStudyRecords();
	}, []);
	if (isLoading) {
		return (
			<Box h="80vh">
				<Center h="100%">
					<Spinner
						thickness="4px"
						emptyColor="gray.100"
						color="orange.300"
						speed="0.4s"
						size="xl"
						data-testid="spinner"
					/>
				</Center>
			</Box>
		);
	}

	return (
		<Flex align="center" justify="center">
			<Box height="100vh">
				<Center mt={4} mb={4}>
					<Heading as="h1" data-testid="title">
						Shin Study Record
					</Heading>
				</Center>

				<Box>
					<Button
						colorScheme="orange"
						onClick={onClickAddButton}
						data-testid="addButton"
					>
						登録
					</Button>
					<TableContainer>
						<Table
							variant="striped"
							colorScheme="blackAlpha"
							data-testid="table"
							width="600px"
						>
							<Thead>
								<Tr>
									<Th>title</Th>
									<Th>time</Th>
									<Th>created_at</Th>
									<Th></Th>
								</Tr>
							</Thead>
							<Tbody>
								{records.map((record) => (
									<Tr key={record.id}>
										<Td>{record.title}</Td>
										<Td>{record.time}</Td>
										<Td>{record.created_at}</Td>
										<Td>
											<button onClick={() => onClickDeleteRecord(record.id)}>
												削除
											</button>
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
						onClose={onClose}
					>
						<ModalOverlay />
						<ModalContent>
							<form onSubmit={handleSubmit(onSubmit)}>
								<ModalHeader data-testid="modalTitle">新規登録</ModalHeader>
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
									<Button
										colorScheme="blue"
										mr={3}
										isLoading={isSubmitting}
										type="submit"
										data-testid="submitButton"
									>
										登録
									</Button>
									<Button onClick={onClose}>キャンセル</Button>
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
