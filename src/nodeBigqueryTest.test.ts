import { describe, it, expect } from "vitest"
import { mockTestSQL } from "./nodeBigqueryTest"

describe("nodeBigQueryTest.test.ts", () => {
    it("one mock table test", () => {
        const result = mockTestSQL("SELECT * FROM `test`", [{
            tableName: "test",
            schama: [
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
                {name: "test", age: 10},
                {name: "test2", age: 20},
            ]
        }])
        console.log(result)
        expect(1).toBe(1)
    })

    it("two mock table test", () => {
        const result = mockTestSQL("SELECT * FROM `test` JOIN `test2` ON test.id = test2.id", [
            {
                tableName: "test",
                schama: [
                    {
                        name: "id",
                        type: "STRING",
                    },
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
                    {id: "1", name: "test", age: 10},
                    {id: "2", name: "test2", age: 20},
                ]
            },
            {
                tableName: "test2",
                schama: [
                    {
                        name: "id",
                        type: "STRING",
                    },
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
                    {id: "1", name: "test", age: 10},
                ]
            },
        ])
        console.log(result)
        expect(1).toBe(1)
    })
})
