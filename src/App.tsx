import {
	Spinner,
	Table,
	TableContainer,
	Tbody,
	Td,
	Th,
	Thead,
	Tr,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { StudyRecord } from "./domain/studyRecord";
import { fetchStudyRecords } from "./utils/supabaseFunctions";

function App() {
	const [records, setRecords] = useState<StudyRecord[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	useEffect(() => {
		const getAllStudyRecords = async () => {
			const studyRecordData = await fetchStudyRecords();
			setRecords(studyRecordData);
			setIsLoading(false);
		};
		getAllStudyRecords();
	});
	return (
		<>
			<h1 data-testid="title">Shin Study Record</h1>
			{isLoading ? (
				<Spinner />
			) : (
				<TableContainer>
					<Table variant="striped" colorScheme="blackAlpha" data-testid="table">
						<Thead>
							<Tr>
								<Th>title</Th>
								<Th>time</Th>
								<Th>created_at</Th>
							</Tr>
						</Thead>
						<Tbody>
							{records.map((record) => (
								<Tr key={record.id}>
									<Td>{record.title}</Td>
									<Td>{record.time}</Td>
									<Td>{record.created_at}</Td>
								</Tr>
							))}
						</Tbody>
					</Table>
				</TableContainer>
			)}
		</>
	);
}

export default App;
