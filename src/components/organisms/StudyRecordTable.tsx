import {
	ButtonGroup,
	IconButton,
	Table,
	TableContainer,
	Tbody,
	Td,
	Th,
	Thead,
	Tr,
} from "@chakra-ui/react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { StudyRecord } from "../../domain/studyRecord";

type StudyRecordTableProps = {
	records: StudyRecord[];
	onEdit: (record: StudyRecord) => void;
	onDelete: (id: string) => void;
};

export const StudyRecordTable = ({
	records,
	onEdit,
	onDelete,
}: StudyRecordTableProps) => (
	<TableContainer>
		<Table variant="striped" colorScheme="blackAlpha" width="600px">
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
						<Td>{record.time}時間</Td>
						<Td>{record.created_at}</Td>
						<Td>
							<ButtonGroup spacing="4">
								<IconButton
									aria-label="編集"
									icon={<FiEdit />}
									size="lg"
									variant="outline"
									onClick={() => onEdit(record)}
								/>
								<IconButton
									aria-label="削除"
									icon={<FiTrash2 />}
									size="lg"
									variant="outline"
									onClick={() => onDelete(record.id)}
								/>
							</ButtonGroup>
						</Td>
					</Tr>
				))}
			</Tbody>
		</Table>
	</TableContainer>
);
