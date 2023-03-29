import { TableField } from "@google-cloud/bigquery"

export type tableData = {
    schema: TableField[]
    mockData: Record<string, any>[]
}

export type mockTestTable = Record<string, tableData>

type BIGQUERY_SCHEMA_TYPE = "STRING" | "NUMBER" | "INTEGER" | "FLOAT" | "TIMESTAMP" | "BOOLEAN" | "DATE" | "RECORD"
type BIGQUERY_SCHEMA_TYPE_PURE = Omit<BIGQUERY_SCHEMA_TYPE, "RECORD">

export const generateSQL = (rawSQL: string, mockTestTable: mockTestTable) => {
    printMockData(mockTestTable)
    return mockTestSQL(rawSQL, mockTestTable)
}

function printMockData(mockTestTable: mockTestTable) {
    for (const [key, value] of Object.entries(mockTestTable)) {
        console.log(`==================== ${key} ====================`)
        console.table(value.mockData)
    }
}

const mockTestSQL = (rawSQL: string, mockTestTable: mockTestTable) => {
    const list: { sql: string; tableName: string }[] = []
    for (const [tableName, tableData] of Object.entries(mockTestTable)) {
        list.push({ sql: mockTestTableGen(tableData), tableName: tableName })
    }
    const withSQL = list.map((value) => `\`${value.tableName}\` AS (\n${value.sql}\n)`).join(",\n")
    return `with ${withSQL}
      SELECT
          *
      FROM (
          ${rawSQL}
      )`
}

/**
 * テーブル作成用のSELECT文を生成する関数
 * javascript objectからスキーマに対応したSQLを生成する
 */
export function generateSQLForCreateTable({ tableData }: { tableData: tableData }) {
    return mockTestTableGen(tableData)
}

function mockTestTableGen(table: tableData) {
    const valueList: string[] = []
    table.mockData.forEach((data) => {
        const fieldSQLList: string[] = []
        for (const [name, value] of Object.entries(data)) {
            const schema = getSchemaFromColumnName(name, table.schema)
            if (schema === null) {
                throw new Error(`column name ${name} is not found in schema`)
            }
            const fieldSQL = generateDateType(value, schema) + ` ${name}`
            fieldSQLList.push(fieldSQL)
        }
        valueList.push("SELECT " + fieldSQLList.join(","))
    })
    return `${valueList.map((value) => value).join("\nUNION ALL\n")}`
}
function getSchemaFromColumnName(columnName: string, schema: TableField[]) {
    const result = schema.find((value) => value.name === columnName)
    return result === undefined ? null : result
}

function generateDateType(value: unknown, schema: TableField) {
    const type = schema.type as BIGQUERY_SCHEMA_TYPE_PURE
    if (value === null) {
        return "NULL"
    }
    if (type === "STRING") {
        return `'${value}'`
    }
    if (type === "NUMBER" || type === "INTEGER" || type === "FLOAT") {
        return `${value}`
    }
    if (type === "TIMESTAMP") {
        return `TIMESTAMP("${value}") `
    }
    if (type === "BOOLEAN") {
        return `${value}`
    }
    if (type === "DATE") {
        return `DATE("${value}") `
    }
    if (type === "RECORD") {
        if (schema.mode === "REPEATED") {
            return generateArrayType(value, schema)
        }
        return generateRecordType(value, schema.fields as TableField[])
    }
    throw new Error(`type ${type} is not supported`)
}

function generateArrayType(value: unknown, schema: TableField) {
    const columnNames: string[] = []
    const fieldSQLList: string[] = []
    const childSchema = schema.fields
    if (childSchema === undefined) {
        throw new Error(`child schema is not found`)
    }
    for (const row of childSchema) {
        columnNames.push(`${row.name} ${row.type}`)
    }
    if (columnNames.length === 0) {
        throw new Error(`column name is not found in schema`)
    }
    for (const row of value as unknown[]) {
        const valueSQLList: string[] = []
        for (const [name, v] of Object.entries(row as object)) {
            const childrenSchema = getSchemaFromColumnName(name, childSchema)
            if (childrenSchema === null) {
                throw new Error(`column name ${name} is not found in schema`)
            }
            const fieldSQL = generateDateType(v, childrenSchema)
            valueSQLList.push(fieldSQL)
        }
        fieldSQLList.push(`(${valueSQLList.join(", ")})`)
    }
    if (columnNames.length === 0) {
        throw new Error(`column name is not found in schema`)
    }
    return `ARRAY<STRUCT<${columnNames.join(", ")}>>[${fieldSQLList.join(", ")}]`
}

function generateRecordType(value: unknown, schema: TableField[]) {
    const columnNames: string[] = []
    const fieldSQLList: string[] = []
    for (const [name, v] of Object.entries(value as object)) {
        const childrenSchema = getSchemaFromColumnName(name, schema)
        if (childrenSchema === null) {
            throw new Error(`column name ${name} is not found in schema`)
        }
        columnNames.push(`${name} ${childrenSchema.type}`)
        const fieldSQL = generateDateType(v, childrenSchema)
        fieldSQLList.push(fieldSQL)
    }
    if (columnNames.length === 0) {
        throw new Error(`column name is not found in schema`)
    }
    return `STRUCT<${columnNames.join(", ")}>(${fieldSQLList.join(", ")})`
}
