// BIGQUERY
interface mockTestTable {
    tableName: string
    mockData: Record<string, number | string>[]
}

export const mockTestSQL = (rawSQL: string, arg: mockTestTable) => {
    return `${mockTestTable(arg.tableName, arg.mockData)}  
${rawSQL}`
}

const mockTestTable = (tableName: string, mockData: Record<string, number | string>[]) => {
    const valueList: string[] = []
    mockData.forEach((data) => {
        const sql: string[] = []
        for (const [key, value] of Object.entries(data)) {
            if (typeof value === "string") {
                sql.push(`"${value}" ${key} `)
            } else {
                sql.push(`${value} ${key} `)
            }
        }
        valueList.push("SELECT " + sql.join(","))
    })
    return `WITH ${tableName} AS (
${valueList.map((value) => value).join("\nUNION ALL\n")}
)
	`
}
