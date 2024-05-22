import {
	Alert,
	AlertDescription,
	AlertIcon,
	AlertTitle,
	Box,
	Center,
	Flex,
	Heading,
} from "@chakra-ui/react";
import { ReactNode } from "react";

type MainTemplateProps = {
	children: ReactNode;
	error?: string;
};

export const MainTemplate = ({ children, error }: MainTemplateProps) => (
	<Flex align="center" justify="center">
		<Box height="100vh">
			<Center mt={4} mb={4}>
				<Heading as="h1">Shin Study Record</Heading>
			</Center>
			{error && (
				<Alert status="error">
					<AlertIcon />
					<AlertTitle>Error</AlertTitle>
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			)}
			{children}
		</Box>
	</Flex>
);
