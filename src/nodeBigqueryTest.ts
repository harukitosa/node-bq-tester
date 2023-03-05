import { TableField } from "@google-cloud/bigquery"

// BIGQUERY
interface mockTestTable {
    tableName: string
    schama: TableField[]
    mockData: Record<string, number | string>[]
}

export const mockTestSQL = (rawSQL: string, arg: mockTestTable[]) => {
    const list = arg.map((value) => mockTestTable(value))
    const withSQL = list.map((value) => `${value.tableName} AS (\n${value.sql}\n)`).join(",\n")
    return `with ${withSQL}  
${rawSQL}`
}

const mockTestTable = (table: mockTestTable) => {
    const valueList: string[] = []

    table.mockData.forEach((data) => {
        const sql: string[] = []
        for (const [key, value] of Object.entries(data)) {
            table.schama.forEach((schame) => {
                if (schame.name === key) {
                    if (schame.type === "STRING") {
                        sql.push(`"${value}" ${key} `)
                    } else if (schame.type === "NUMBER") {
                        sql.push(`${value} ${key} `)
                    } else {
                        throw new Error("not support type")
                    }
                }
            })
        }
        valueList.push("SELECT " + sql.join(","))
    })
    return {tableName: table.tableName, sql: `${valueList.map((value) => value).join("\nUNION ALL\n")}`}
}