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

export async function query(
  q: string,
  values: (string | number)[] | string | number = []
) {
  const connection = await createConnection();
  try {
    const rows = await connection.query({ sql: 'SELECT 1 as one' });
    if (rows[0].one !== 1){
      throw Error('one !== 1');
    }
    return rows;
  } catch (err) {
    // Received expected error
    throw Error((err as Error).message);
  }
  finally {
    await connection.end();
  }
}
