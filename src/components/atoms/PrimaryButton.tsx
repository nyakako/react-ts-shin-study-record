import { Button } from "@chakra-ui/react";
import { FC, ReactNode, memo } from "react";

type Props = {
	children: ReactNode;
	onClick?: () => void;
	isLoading?: boolean;
	type?: "button" | "submit" | "reset";
};

export const PrimaryButton: FC<Props> = memo((props) => {
	const { children, isLoading = false, onClick, type } = props;
	return (
		<Button
			bg="green.500"
			color="white"
			_hover={{ opacity: 0.8 }}
			isLoading={isLoading}
			onClick={onClick}
			type={type}
		>
			{children}
		</Button>
	);
});
