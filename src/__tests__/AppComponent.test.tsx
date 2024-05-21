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

const mockInsertStudyRecord = jest
	.fn()
	.mockImplementation((newRecord: StudyRecord) => {
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
		return Promise.resolve({
			data: [
				{
					id: "1",
					title: newRecord.title,
					time: newRecord.time,
					created_at: new Date().toString(),
				},
			],
			error: null,
		});
	});

const mockUpdateStudyRecord = jest.fn().mockImplementation((updatedRecord) => {
	const updatedRecords = initialRecords.map((record) =>
		record.id === updatedRecord.id ? updatedRecord : record
	);
	mockFetchStudyRecords.mockResolvedValueOnce(updatedRecords);
	return Promise.resolve({ data: [updatedRecord], error: null });
});

const mockDeleteStudyRecord = jest.fn().mockImplementation((id: string) => {
	const newRecords = initialRecords.filter((record) => record.id !== id);
	mockFetchStudyRecords.mockResolvedValueOnce(newRecords);
	return Promise.resolve();
});

jest.mock("../utils/supabaseFunctions.ts", () => {
	return {
		fetchStudyRecords: () => mockFetchStudyRecords(),
		insertStudyRecord: (newRecord: StudyRecord) =>
			mockInsertStudyRecord(newRecord),
		deleteStudyRecord: (id: string) => mockDeleteStudyRecord(id),
		updateStudyRecord: (updatedRecord: StudyRecord) =>
			mockUpdateStudyRecord(updatedRecord),
	};
});

describe("App", () => {
	test("1.ローディング画面をみることができる", () => {
		render(<App />);
		expect(screen.getByTestId("spinner")).toBeInTheDocument();
	});
	test("2.テーブル内のデータを確認できる", async () => {
		render(<App />);
		await waitFor(() => screen.getByRole("table"));
		const studyRecords = screen
			.getByRole("table")
			.querySelector("tbody")
			?.querySelectorAll("tr");
		expect(studyRecords).toHaveLength(4); // /mockの4件
	});

	test("3.新規登録ボタンがあること", async () => {
		render(<App />);
		await waitFor(() => screen.getByRole("table"));
		const addButton = screen.getByRole("button", { name: "新規登録" });
		expect(addButton).toBeInTheDocument();
	});

	test("4.タイトルがあること", async () => {
		render(<App />);
		await waitFor(() => screen.getByRole("table"));
		const pageTitle = screen.getByRole("heading", { level: 1 });
		expect(pageTitle).toBeInTheDocument();
	});

	test("5.データを登録したらテーブルに1件追加されること", async () => {
		render(<App />);
		await waitFor(() => screen.getByRole("table"));

		const addButton = screen.getByRole("button", { name: "新規登録" });
		fireEvent.click(addButton);

		fireEvent.input(screen.getByLabelText("学習記録"), {
			target: { value: "title5" },
		});
		fireEvent.input(screen.getByLabelText("学習時間"), {
			target: { value: 5 },
		});
		const submitButton = screen.getByRole("button", { name: "登録" });
		fireEvent.click(submitButton);

		await waitFor(() => expect(mockInsertStudyRecord).toHaveBeenCalledTimes(1));
		const studyRecords = screen
			.getByRole("table")
			.querySelector("tbody")
			?.querySelectorAll("tr");
		expect(studyRecords).toHaveLength(5); // 新しいデータ1件と既存の4件
	});

	test("6.モーダルが新規登録というタイトルになっている。初期表示が空欄", async () => {
		render(<App />);
		await waitFor(() => screen.getByRole("table"));

		const addButton = screen.getByRole("button", { name: "新規登録" });
		fireEvent.click(addButton);
		await waitFor(() => screen.getByRole("dialog"));
		const modalTitle = screen.getByRole("banner");

		expect(modalTitle).toHaveTextContent("新規登録");

		const titleInput = screen.getByLabelText("学習記録");
		const timeInput = screen.getByLabelText("学習時間");
		expect(titleInput).not.toHaveValue();
		expect(timeInput).not.toHaveValue();
	});

	test("7.学習内容がないときに登録するとエラーがでる", async () => {
		render(<App />);
		await waitFor(() => screen.getByRole("table"));
		const addButton = screen.getByRole("button", { name: "新規登録" });
		fireEvent.click(addButton);

		const titleInput = screen.getByLabelText("学習記録");
		fireEvent.change(titleInput, { target: { value: "" } });

		const submitButton = screen.getByRole("button", { name: "登録" });
		fireEvent.click(submitButton);

		const errorMessage = await screen.findByText("内容の入力は必須です");
		expect(errorMessage).toBeInTheDocument();
	});

	test("8.学習時間が未入力、0以下のときに登録するとエラーがでる", async () => {
		render(<App />);
		await waitFor(() => screen.getByRole("table"));
		const addButton = screen.getByRole("button", { name: "新規登録" });
		fireEvent.click(addButton);

		const timeInput = screen.getByLabelText("学習時間");
		fireEvent.change(timeInput, { target: { value: "" } });
		const submitButton = screen.getByRole("button", { name: "登録" });
		fireEvent.click(submitButton);

		const notInputErrorMessage = await screen.findByText(
			"時間の入力は必須です"
		);
		expect(notInputErrorMessage).toBeInTheDocument();

		fireEvent.change(timeInput, { target: { value: -1 } });
		fireEvent.click(submitButton);

		const validationErrorMessage = await screen.findByText(
			"時間は0以上である必要があります"
		);
		expect(validationErrorMessage).toBeInTheDocument();
	});

	test("9.データを削除したらテーブルから1件データが減ること", async () => {
		render(<App />);
		await waitFor(() => screen.getByRole("table"));

		const deleteButton = screen.getAllByRole("button", { name: "削除" })[0];
		fireEvent.click(deleteButton);

		await waitFor(() => expect(mockDeleteStudyRecord).toHaveBeenCalledTimes(1));
		await waitFor(() => screen.getByRole("table"));
		const studyRecords = screen
			.getByRole("table")
			.querySelector("tbody")
			?.querySelectorAll("tr");
		expect(studyRecords).toHaveLength(3); // 既存の4件-1件
	});
	test("10.モーダルが記録編集というタイトルになっている", async () => {
		render(<App />);
		await waitFor(() => screen.getByRole("table"));

		const editButton = screen.getAllByRole("button", { name: "編集" })[0];
		fireEvent.click(editButton);

		const modalTitle = screen.getByRole("banner");
		expect(modalTitle).toHaveTextContent("記録編集");

		const titleInput = screen.getByLabelText("学習記録");
		const timeInput = screen.getByLabelText("学習時間");
		expect(titleInput).toHaveValue("title1");
		expect(timeInput).toHaveValue("1");
	});

	test("11.編集して登録するとデータが更新される", async () => {
		render(<App />);
		await waitFor(() => screen.getByRole("table"));

		const editButton = screen.getAllByRole("button", { name: "編集" })[0];
		fireEvent.click(editButton);

		fireEvent.input(screen.getByLabelText("学習記録"), {
			target: { value: "edit_test" },
		});
		fireEvent.input(screen.getByLabelText("学習時間"), {
			target: { value: 99 },
		});
		const submitButton = screen.getByRole("button", { name: "更新" });
		fireEvent.click(submitButton);

		await waitFor(() => expect(mockUpdateStudyRecord).toHaveBeenCalledTimes(1));

		await waitFor(() => screen.getByRole("table"));

		const tbody = screen.getByRole("table").querySelector("tbody");
		const studyRecords = tbody ? tbody.querySelectorAll("tr") : null;

		if (!studyRecords) {
			throw new Error("Table rows not found");
		}

		expect(studyRecords).toHaveLength(4);
		const updatedRow = studyRecords[0];
		expect(updatedRow).toHaveTextContent("edit_test");
		expect(updatedRow).toHaveTextContent("99");
	});

	// test("logRoles: アクセシブルネームを確認する", async () => {
	// 	const { container } = render(<App />);
	// 	await waitFor(() => screen.getByRole("table"));

	// 	const addButton = screen.getByRole("button", { name: "新規登録" });
	// 	fireEvent.click(addButton);
	// 	const dialog = await waitFor(() => screen.getByRole("dialog"));

	// 	logRoles(container);
	// });
});
