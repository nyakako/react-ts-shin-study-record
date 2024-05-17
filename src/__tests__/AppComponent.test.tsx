import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import App from "../App";
import { StudyRecord } from "../domain/studyRecord";

const initialRecords = [
	new StudyRecord("1", "title1", 1, new Date().toString()),
	new StudyRecord("2", "title2", 2, new Date().toString()),
	new StudyRecord("3", "title3", 3, new Date().toString()),
	new StudyRecord("4", "title4", 4, new Date().toString()),
];

const mockFetchStudyRecords = jest.fn().mockResolvedValue(initialRecords);

const mockInsertStudyRecord = jest.fn().mockImplementation((newRecord) => {
	const newRecords = [
		...initialRecords,
		new StudyRecord(
			"5",
			newRecord.title,
			newRecord.time,
			new Date().toString()
		),
	];
	mockFetchStudyRecords.mockResolvedValueOnce(newRecords);
	return {
		data: [
			{
				id: "5",
				title: newRecord.title,
				time: newRecord.time,
				created_at: new Date().toString(),
			},
		],
		error: null,
	};
});

jest.mock("../utils/supabaseFunctions.ts", () => {
	return {
		fetchStudyRecords: () => mockFetchStudyRecords(),
		insertStudyRecord: (newRecord: StudyRecord) =>
			mockInsertStudyRecord(newRecord),
	};
});

describe("App", () => {
	it("1.ローディング画面をみることができる", () => {
		render(<App />);
		expect(screen.getByTestId("spinner")).toBeInTheDocument();
	});
	it("2.テーブル内のデータを確認できる", async () => {
		render(<App />);
		await waitFor(() => screen.getAllByTestId("table"));
		const studyRecords = screen
			.getByTestId("table")
			.querySelector("tbody")
			?.querySelectorAll("tr");
		expect(studyRecords).toHaveLength(4); // /mockの4件
	});

	it("3.新規登録ボタンがあること", async () => {
		render(<App />);
		await waitFor(() => screen.getAllByTestId("table"));
		expect(screen.getByTestId("addButton")).toBeInTheDocument();
	});

	it("4.タイトルがあること", async () => {
		render(<App />);
		await waitFor(() => screen.getAllByTestId("table"));
		expect(screen.getByTestId("title")).toBeInTheDocument();
	});

	it("5.データを登録したら1件追加されること", async () => {
		render(<App />);
		await waitFor(() => screen.getAllByTestId("table"));
		fireEvent.click(screen.getByTestId("addButton"));
		fireEvent.input(screen.getByLabelText("学習記録"), {
			target: { value: "title5" },
		});
		fireEvent.input(screen.getByLabelText("学習時間"), {
			target: { value: 5 },
		});
		fireEvent.click(screen.getByTestId("submitButton"));

		await waitFor(() => expect(mockInsertStudyRecord).toHaveBeenCalledTimes(1));
		const studyRecords = screen
			.getByTestId("table")
			.querySelector("tbody")
			?.querySelectorAll("tr");
		expect(studyRecords).toHaveLength(5); // 新しいデータ1件と既存の4件
	});
});
