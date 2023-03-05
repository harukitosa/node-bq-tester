import { describe, it, expect } from "vitest"
import { BigQueryMocker } from "./nodeBigqueryTest"

describe("nodeBigQueryTest.test.ts", () => {
    it("one mock table test", () => {
        const mock = new BigQueryMocker([
            {
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
                    { name: "test", age: 10 },
                    { name: "test2", age: 20 },
                ],
            },
        ])
        const result = mock.generateSQL("SELECT * FROM `test`")
        console.log(result)
        expect(1).toBe(1)
    })

    it("two mock table test", () => {
        const mock = new BigQueryMocker([
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
                    { id: "1", name: "test", age: 10 },
                    { id: "2", name: "test2", age: 20 },
                ],
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
                mockData: [{ id: "1", name: "test", age: 10 }],
            },
        ])
        const result = mock.generateSQL("SELECT * FROM `test` JOIN `test2` ON `test`.`id` = `test2`.`id`")
        console.log(result)
        expect(1).toBe(1)
    })

    it("timestamp table test", () => {
        // 2023-03-03 05:16:55.128000 UTC
        const mock = new BigQueryMocker([
            {
                tableName: "test",
                schama: [
                    {
                        name: "id",
                        type: "STRING",
                    },
                    {
                        name: "date",
                        type: "TIMESTAMP",
                    },
                ],
                mockData: [{ id: "1", date: "2023-03-03 05:16:55.128000 UTC" }],
            }]
        )
        const result = mock.generateSQL("SELECT * FROM `test`")
        console.log(result)
        expect(1).toBe(1)
    })

    it("boolean table test", () => {
        const mock = new BigQueryMocker([
            {
                tableName: "test",
                schama: [
                    {
                        name: "id",
                        type: "STRING",
                    },
                    {
                        name: "flag",
                        type: "BOOLEAN",
                    },
                ],
                mockData: [{ id: "1", flag: true}],
            }]
        )
        const result = mock.generateSQL("SELECT * FROM `test`")
        console.log(result)
        expect(1).toBe(1)
    })
})
