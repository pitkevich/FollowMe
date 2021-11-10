import type {NextApiRequest, NextApiResponse} from 'next'
import {query} from "../../../lib/db";


type Data = {
    token: string,
    name: string,
    picKey?: number
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
                const results = await query<any>(
                    `SELECT 'someone' as one`,
                    id
                );
                if (!results.success) {
                    res.status(500).end(results.message ?? 'unknown error');
                } else {
                    return res.json(
                        {
                            token: '1',
                            name: results.data.map(i => {
                                const y: { one: string } = i;
                                return y.one;
                            }).join(',')
                        });
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
