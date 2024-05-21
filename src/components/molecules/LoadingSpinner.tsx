import { Box, Center, Spinner } from "@chakra-ui/react";
import { FC, memo } from "react";

export const LoadingSpinner: FC = memo(() => {
	return (
		<>
			<Box h="80vh">
				<Center h="100%">
					<Spinner
						thickness="4px"
						emptyColor="gray.100"
						color="green.300"
						speed="0.4s"
						size="xl"
						data-testid="spinner"
					/>
				</Center>
			</Box>
		</>
	);
});
