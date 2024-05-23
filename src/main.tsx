import { ChakraProvider } from "@chakra-ui/react";
import React from "react";
import ReactDOM from "react-dom/client";
import StudyRecordApp from "./components/pages/StudyRecordApp.tsx";
import theme from "./theme/theme.ts";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<ChakraProvider theme={theme}>
			<StudyRecordApp />
		</ChakraProvider>
	</React.StrictMode>
);
