import { render, screen, waitFor } from "@testing-library/react";
import App from "../App";

describe("title", () => {
	it("should render title", async () => {
		render(<App />);
		await waitFor(() => screen.getAllByTestId("table"));
		expect(screen.getByTestId("title")).toBeInTheDocument();
	});
});
