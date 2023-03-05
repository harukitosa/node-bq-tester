import { describe, it, expect } from "vitest"
import { mockTestSQL } from "./nodeBigqueryTest"

describe("nodeBigQueryTest.test.ts", () => {
    it("sample_test2", () => {
        const result = mockTestSQL("SELECT * FROM `test`", {
            tableName: "test",
            mockData: [
                {
                    id: 1,
                    name: "test",
                },
                {
                    id: 2,
                    name: "test2",
                },
            ],
        })
        console.log(result)
        // expect(result).toBe()
    })
})
