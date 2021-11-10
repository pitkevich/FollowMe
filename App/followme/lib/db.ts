import mariadb from 'mariadb';
import { ConnectionConfig } from 'mariadb';

function createConnection(option?: ConnectionConfig): Promise<mariadb.Connection> {
  return mariadb.createConnection({
    host: process.env.MYSQL_HOST,
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    port: parseInt(process.env.MYSQL_PORT ?? '3306'),
  });
}

export async function query<T>(
  q: string,
  id: string | number
): Promise<queryResult<T>> {
  const connection = await createConnection();
  try {
    const rows = (await connection.query( q, id )) as T[];
    return { success: true, message: undefined, data: rows };
  } catch (err) {
    return { success: false, message: (err as Error).message };
  }
  finally {
    await connection.end();
  }
}

export interface queryResult<T> {
  success: boolean;
  message: string | undefined;
  data?: T[];
}