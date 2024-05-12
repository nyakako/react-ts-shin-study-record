import { render, screen } from "@testing-library/react";
import App from "../App";

describe("title", () => {
	it("should render title", () => {
		render(<App />);
		expect(screen.getByText("Hello World")).toBeInTheDocument();
	});
});
