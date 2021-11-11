import type {NextApiRequest, NextApiResponse} from 'next'
import {query} from "../../../lib/db";


type Data = {
    token: string,
    name: string,
    picKey?: number,
    data?: undefined
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const {
        query: {id},
        method,
    } = req;

    switch (method) {
        case 'GET':
            // Get data from your database
            if (process.env.STORAGE === 'MYSQL') {
                const results = await query<Data>(
                    `SELECT '1' as token, 'someone' as name`,
                    id
                );
                if (!results.success) {
                    res.status(500).end(results.message ?? 'unknown error');
                } else if (results.data.length === 0) {
                    res.status(404).end(`\'${id}\' Not Found`)
                } else {
                    res.json(results.data[0]);
                }
            } else {
                if (id === '1') {
                    res.status(200).json({token: '1', name: 'John Doe'})
                } else {
                    res.status(404).end(`\'${id}\' Not Found`)
                }
            }
            break;
        default:
            res.setHeader('Allow', ['GET'])
            res.status(405).end(`Method ${method} Not Allowed`)
    }
};
