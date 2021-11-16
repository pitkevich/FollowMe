import mariadb from 'mariadb';
import {ConnectionConfig} from 'mariadb';

function createConnection(option?: ConnectionConfig): Promise<mariadb.Connection> {
    return mariadb.createConnection({
        host: process.env.MYSQL_HOST,
        database: process.env.MYSQL_DATABASE,
        user: process.env.MYSQL_USERNAME,
        password: process.env.MYSQL_PASSWORD,
        port: parseInt(process.env.MYSQL_PORT ?? '3306'),
        ... option ?? {}
    });
}

export async function query<T extends ITData>(
    q: string,
    values: (string | number)[] | string | number = []
): Promise<IQueryResult<T>> {
    const connection = await createConnection();
    try {
        const rows = await connection.query(q, values);
        const result = rows.map((row: T) => restoreDataField(row));
        return {success: true, message: undefined, data: result};
    } catch (err) {
        return {success: false, message: (err as Error).message, data: []};
    } finally {
        await connection.end();
    }
}

export async function insert<T extends ITData>(
    q: string,
    value: any[]
): Promise<IQueryResult<T>> {
    const connection = await createConnection({multipleStatements: true});
    try {
        const rows = await connection.query(q, value);
        const okPacket: { affectedRows: number, insertId: number, warningStatus: number } = rows[0];
        if (!okPacket || okPacket.affectedRows != 1 || rows.length != 2) throw Error('Unknown')
        const result = rows[1].map((row: T) => restoreDataField(row));
        return {success: true, message: undefined, data: result};
    } catch (err) {
        return {success: false, message: (err as Error).message, data: []};
    } finally {
        await connection.end();
    }
}

export async function update<T extends ITData>(
    q: string,
    value: any[]
): Promise<IQueryResult<T>> {
    const connection = await createConnection({multipleStatements: true});
    try {
        const rows = await connection.query(q, value);
        const okPacket: { affectedRows: number, insertId: number, warningStatus: number } = rows[0];
        if (!okPacket || okPacket.affectedRows != 1 || rows.length != 2) {
            return {success: true, message: '404', data: []};
        }
        else {
            const result = rows[1].map((row: T) => restoreDataField(row));
            return {success: true, message: undefined, data: result};
        }
    } catch (err) {
        return {success: false, message: (err as Error).message, data: []};
    } finally {
        await connection.end();
    }
}

export async function remove<T extends ITData>(
    q: string,
    value: string | number
): Promise<IQueryResult<T>> {
    const connection = await createConnection();
    try {
        const okPacket: { affectedRows: number, insertId: number, warningStatus: number } =
            await connection.query(q, value);
        if (okPacket?.affectedRows != 1) {
            return {success: true, message: '404', data: []};
        }
        return {success: true, message: undefined, data: []};
    } catch (err) {
        return {success: false, message: (err as Error).message, data: []};
    } finally {
        await connection.end();
    }
}

export interface IQueryResult<T extends ITData> {
    success: boolean;
    message: string | undefined;
    data: T[];
}

export interface ITData {
    data?: any;
}

function restoreDataField<T extends ITData>(row: T): T {
    if (typeof row.data === 'string' && row.data.length > 0) {
        row.data = JSON.parse(row.data);
    }
    return row;
}
