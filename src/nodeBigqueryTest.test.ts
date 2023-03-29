import { describe, it, expect } from "vitest"
import { generateSQL } from "./nodeBigqueryTest"

describe("nodeBigQueryTest.test.ts", () => {
    it("one mock table test", () => {
        const mockSQL = generateSQL("SELECT * FROM `test`", {
            "test": {
                schema: [
                    {
                        name: "name",
                        type: "STRING",
                    },
                    {
                        name: "age",
                        type: "NUMBER",
                    },
                ],
                mockData: [
                    { name: "test", age: 10 },
                    { name: "test2", age: 20 },
                ],
            },
        })
        console.log(mockSQL)
        expect(mockSQL.includes("test2")).toBe(true)
    })
})
